const { today, dayKey, addDays, fromDay, makeSlots, minutes } = (() => {
  const t = require('../../utils/time')
  return { ...t, fromDay: value => { const [y,m,d] = value.split('-').map(Number); return new Date(y,m-1,d) } }
})()
const store = require('../../utils/store')
const rowsFor = (slots, from, to) => {
  const rows = []
  slots.forEach((slot, index) => {
    const hour = Math.floor(minutes(slot.start) / 60)
    if (!rows.length || rows[rows.length - 1].hourNumber !== hour) rows.push({ hourNumber: hour, label: `${String(hour).padStart(2, '0')}:00`, cells: [] })
    rows[rows.length - 1].cells.push({ ...slot, index, flex: minutes(slot.end) - minutes(slot.start), selected: from >= 0 && index >= from && index <= to })
  })
  return rows
}

Page({
  data: {
    date: today(), monthLabel: '', layout: 'blocks', collapseProgress: 0, calendarHeightRpx: 516, monthOffsetRpx: 0, navTop: 26, navRight: 180, navHeight: 34,
    slots: [], hourRows: [], month: [], agenda: [], weekdays: ['一','二','三','四','五','六','日'], paletteHidden: false, fullscreen: false, paletteRows: [],
    settings: {}, palette: [], selectedFrom: -1, selectedTo: -1, selectedEventId: '', selectedLabel: '', selectionHint: false,
    developerMode: false, undoEvent: null, rowHeight: 72, blockFontSize: 24
  },
  onLoad() {
    if (wx.getMenuButtonBoundingClientRect) {
      const button = wx.getMenuButtonBoundingClientRect()
      const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
      if (button) this.setData({ navTop: button.top, navRight: info.windowWidth - button.left + 8, navHeight: button.height })
    }
  },
  onShow() {
    this.getTabBar().setData({ selected: 1, developerMode: Boolean(store.read().settings.developerMode) })
    this.refresh()
    const paletteId = getApp().globalData.pendingPaletteId
    if (paletteId) {
      getApp().globalData.pendingPaletteId = ''
      this.applyPalette(paletteId)
    }
  },
  onUnload() { if (this.undoTimer) clearTimeout(this.undoTimer) },
  refresh() {
    const state = store.read()
    const { date } = this.data
    const day = fromDay(date)
    const pending = (state.orders || []).filter(order => order.status === 'pending').map(order => ({ id: `pending-${order.id}`, orderId: order.id, source: 'order', date: order.date, start: order.start, end: order.end, type: 'pending', title: `${order.buyerName} · 待确认` }))
    const displayEvents = [...state.events.filter(event => event.type !== 'open'), ...pending]
    const eventsFor = value => displayEvents.filter(e => e.date === value).sort((a, b) => a.start.localeCompare(b.start))
    const dateCell = value => {
      const events = eventsFor(value)
      return { date: value, day: Number(value.slice(-2)), selected: value === date, count: events.length, chips: events.slice(0, 1).map(e => ({ id: e.id, title: e.title, type: e.type })), extra: Math.max(0, events.length - 1) }
    }
    const first = `${date.slice(0, 7)}-01`
    const offset = (fromDay(first).getDay() + 6) % 7
    const month = Array.from({ length: 42 }, (_, i) => {
      const value = addDays(first, i - offset)
      return { ...dateCell(value), active: value.slice(0, 7) === date.slice(0, 7) }
    })
    const slots = makeSlots(date, state.settings.startHour, state.settings.endHour, state.settings.mode, displayEvents)
    const hourRows = rowsFor(slots, this.data.selectedFrom, this.data.selectedTo)
    const agenda = eventsFor(date).map(e => ({ ...e, range: `${e.start}–${e.end}` }))
    const selectedEvent = state.events.find(event => event.id === this.data.selectedEventId)
    const selected = this.data.selectedFrom >= 0 ? slots.slice(this.data.selectedFrom, this.data.selectedTo + 1) : []
    const palette = state.palette.filter(item => item.id !== 'open')
    const candidates = palette.filter(item => state.settings.labelLevel === 2 ? Boolean(item.parentId) : !item.parentId)
    const paletteRows = candidates.filter(item => item.pinned !== false).slice(0, 8).map(item => ({ ...item, hasChildren: palette.some(child => child.parentId === item.id) }))
    this.setData({ monthLabel: `${day.getMonth() + 1}月`, slots, hourRows, month, agenda, settings: state.settings, developerMode: Boolean(state.settings.developerMode), palette, paletteRows, selectedLabel: selected.length ? selectedEvent ? `${selectedEvent.title} · ${selectedEvent.start}–${selectedEvent.end}` : `${selected[0].start}–${selected[selected.length - 1].end}` : '', rowHeight: [72, 86, 100][state.settings.blockHeight || 0] || 72, blockFontSize: [20, 24, 28][state.settings.blockFontSize ?? 1] || 24 })
    this.updateCalendarGeometry(this.data.collapseProgress)
  },
  setLayout(e) {
    this.setData({ layout: e.currentTarget.dataset.layout })
    this.updateSelection(-1, -1)
  },
  updateCalendarGeometry(progress) {
    const date = this.data.date
    const first = `${date.slice(0, 7)}-01`
    const offset = (fromDay(first).getDay() + 6) % 7
    const selectedWeek = Math.floor((offset + Number(date.slice(-2)) - 1) / 7)
    const p = Math.max(0, Math.min(1, progress))
    this.setData({ collapseProgress: p, calendarHeightRpx: Math.round(516 - 430 * p), monthOffsetRpx: Math.round(selectedWeek * 86 * p) })
  },
  onContentScroll(e) {
    this.contentScrollTop = e.detail.scrollTop || 0
  },
  collapseTouchStart(e) {
    if (!e.touches.length) return
    this.collapseTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY, progress: this.data.collapseProgress, scrollTop: this.contentScrollTop || 0 }
  },
  collapseTouchMove(e) {
    if (!this.collapseTouch || !e.touches.length || this.dragAnchor !== undefined) return
    const dx = e.touches[0].clientX - this.collapseTouch.x
    const dy = this.collapseTouch.y - e.touches[0].clientY
    if (Math.abs(dy) < Math.abs(dx) * 1.2) return
    if (dy < 0 && this.collapseTouch.scrollTop > 10) return
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    const distance = 430 * info.windowWidth / 750
    const progress = Math.max(0, Math.min(1, this.collapseTouch.progress + dy / distance))
    if (Math.abs(progress - this.data.collapseProgress) >= 0.02) this.updateCalendarGeometry(progress)
  },
  collapseTouchEnd() { this.collapseTouch = null },
  changeDate(date) { this.setData({ date }); this.updateSelection(-1, -1); this.refresh() },
  shiftMonth(count) {
    const old = fromDay(this.data.date)
    const last = new Date(old.getFullYear(), old.getMonth() + count + 1, 0).getDate()
    this.changeDate(dayKey(new Date(old.getFullYear(), old.getMonth() + count, Math.min(old.getDate(), last))))
  },
  calendarTouchStart(e) { this.calendarTouch = e.touches[0] },
  calendarTouchEnd(e) {
    if (!this.calendarTouch || !e.changedTouches.length) return
    const dx = e.changedTouches[0].clientX - this.calendarTouch.clientX
    const dy = e.changedTouches[0].clientY - this.calendarTouch.clientY
    this.calendarTouch = null
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.3) this.shiftMonth(dx < 0 ? 1 : -1)
  },
  goToday() { this.updateCalendarGeometry(0); this.changeDate(today()) },
  chooseDate(e) { this.changeDate(e.currentTarget.dataset.date) },
  openExisting(id) {
    const state = store.read()
    const old = state.events.find(item => item.id === id) || (id.startsWith('pending-') ? { orderId: id.slice(8), source: 'order' } : null)
    if (old?.orderId) return wx.navigateTo({ url: `/pages/orders/index?id=${old.orderId}` })
    if (old && old.serviceId) {
      getApp().globalData.editServiceId = old.serviceId
      wx.switchTab({ url: '/pages/publish/index' })
      return
    }
    if (!old) return
    const indexes = this.data.slots.map((slot, index) => slot.eventId === old.id ? index : -1).filter(index => index >= 0)
    if (!indexes.length) return wx.showToast({ title: '记录不在显示时间内', icon: 'none' })
    this.setData({ layout: 'blocks' })
    this.updateSelection(indexes[0], indexes[indexes.length - 1], old.id)
  },
  openAgenda(e) { this.openExisting(e.currentTarget.dataset.eventid) },
  updateSelection(from, to, eventId = '') {
    const selected = from >= 0 ? this.data.slots.slice(from, to + 1) : []
    const hourRows = rowsFor(this.data.slots, from, to)
    const event = eventId ? store.read().events.find(item => item.id === eventId) : null
    this.setData({ selectedFrom: from, selectedTo: to, selectedEventId: event?.id || '', hourRows, selectedLabel: selected.length ? event ? `${event.title} · ${event.start}–${event.end}` : `${selected[0].start}–${selected[selected.length - 1].end}` : '', selectionHint: !event && selected.length >= 4 })
  },
  openSlot(e) {
    const index = Number(e.currentTarget.dataset.index)
    const slot = this.data.slots[index]
    if (!slot) return
    if (slot.eventId) {
      if (slot.eventId === this.data.selectedEventId) return this.updateSelection(-1, -1)
      return this.openExisting(slot.eventId)
    }
    if (this.data.selectedEventId) return this.updateSelection(index, index)
    let { selectedFrom: from, selectedTo: to } = this.data
    if (from < 0) { from = index; to = index }
    else if (index === from && index === to) return this.updateSelection(-1, -1)
    else if (index === from) from += 1
    else if (index === to) to -= 1
    else if (index > from && index < to) return this.updateSelection(-1, -1)
    else if (index === from - 1) from = index
    else if (index === to + 1) to = index
    else return wx.showToast({ title: '请连续选择时间格', icon: 'none' })
    this.updateSelection(from, to)
  },
  longPressSlot(e) {
    const index = Number(e.currentTarget.dataset.index)
    if (this.data.slots[index]?.eventId) return
    this.dragAnchor = index
    this.updateSelection(index, index)
  },
  gridTouchMove(e) {
    this.collapseTouchMove(e)
    if (this.dragAnchor === undefined || !e.touches.length) return
    const now = Date.now()
    if (now - (this.lastDragQuery || 0) < 50) return
    this.lastDragQuery = now
    const point = e.touches[0]
    wx.createSelectorQuery().in(this).selectAll('.grid-cell').fields({ id: true, rect: true }, cells => {
      if (this.dragAnchor === undefined) return
      const cell = (cells || []).find(rect => point.clientX >= rect.left && point.clientX <= rect.right && point.clientY >= rect.top && point.clientY <= rect.bottom)
      if (!cell || !cell.id) return
      const index = Number(cell.id.replace('cell-', ''))
      const from = Math.min(index, this.dragAnchor), to = Math.max(index, this.dragAnchor)
      if (this.data.slots.slice(from, to + 1).some(slot => slot.eventId)) return
      this.updateSelection(from, to)
    }).exec()
  },
  gridTouchEnd(e) {
    this.collapseTouchEnd()
    const wasDragging = this.dragAnchor !== undefined
    this.dragAnchor = undefined
    if (!this.gridTouch || !e.changedTouches.length) return
    const deltaX = e.changedTouches[0].clientX - this.gridTouch.clientX
    const deltaY = e.changedTouches[0].clientY - this.gridTouch.clientY
    this.gridTouch = null
    if (!wasDragging && Math.abs(deltaX) > 70 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) this.setData({ paletteHidden: deltaX > 0 })
  },
  gridTouchStart(e) { this.gridTouch = e.touches[0]; this.collapseTouchStart(e) },
  applyPalette(id) {
    const state = store.read()
    const palette = state.palette.find(item => item.id === id)
    if (!palette) return
    if (this.data.selectedFrom < 0) return wx.showToast({ title: '先选择时间格', icon: 'none' })
    const parent = state.palette.find(item => item.id === palette.parentId)
    const title = parent ? `${parent.title} · ${palette.title}` : palette.title
    const type = palette.type === 'blocked' ? 'blocked' : 'reserved'
    const existing = state.events.find(item => item.id === this.data.selectedEventId)
    if (existing) {
      const updated = { ...existing, title, type, paletteId: id, parentId: parent?.id || '', source: existing.source || 'manual' }
      store.write({ ...state, events: state.events.map(item => item.id === existing.id ? updated : item) })
      this.updateSelection(-1, -1)
      this.refresh()
      return wx.showToast({ title: '标签已替换', icon: 'success' })
    }
    const selected = this.data.slots.slice(this.data.selectedFrom, this.data.selectedTo + 1)
    if (selected.some(item => item.eventId)) return wx.showToast({ title: '所选时间已有安排', icon: 'none' })
    const candidate = { id: store.uid(), date: this.data.date, start: selected[0].start, end: selected[selected.length - 1].end, title, type, paletteId: id, parentId: parent?.id || '', source: 'manual' }
    if (store.collision(state.events, candidate) || (state.orders || []).some(order => ['pending','confirmed'].includes(order.status) && require('../../utils/time').overlaps(order, candidate))) return wx.showToast({ title: '所选时间有预约或安排', icon: 'none' })
    try {
      store.write({ ...state, events: [...state.events, candidate] })
      this.updateSelection(-1, -1)
      this.refresh()
      wx.showToast({ title: '已记入时间块', icon: 'success' })
    } catch (error) { wx.showToast({ title: '记录失败，请检查存储空间', icon: 'none' }) }
  },
  choosePalette(e) { this.applyPalette(e.currentTarget.dataset.id) },
  openChildLabels(e) { wx.navigateTo({ url: `/pages/time-labels/index?parentId=${e.currentTarget.dataset.id}&pick=1` }) },
  goMoreLabels() { wx.navigateTo({ url: '/pages/time-labels/index?pick=1' }) },
  clearSelectedEvent() {
    const state = store.read()
    const event = state.events.find(item => item.id === this.data.selectedEventId)
    if (!event || event.orderId || event.serviceId) return
    store.write({ ...state, events: state.events.filter(item => item.id !== event.id) })
    if (this.undoTimer) clearTimeout(this.undoTimer)
    this.setData({ undoEvent: event })
    this.undoTimer = setTimeout(() => this.setData({ undoEvent: null }), 5000)
    this.updateSelection(-1, -1)
    this.refresh()
  },
  undoClear() {
    const event = this.data.undoEvent
    if (!event) return
    const state = store.read()
    if (store.collision(state.events, event)) return wx.showToast({ title: '原时段已有新安排', icon: 'none' })
    store.write({ ...state, events: [...state.events, event] })
    if (this.undoTimer) clearTimeout(this.undoTimer)
    this.setData({ undoEvent: null })
    this.refresh()
  },
  cycleMode() {
    store.update(state => ({ ...state, settings: { ...state.settings, mode: state.settings.mode === 4 ? 2 : (state.settings.mode || 2) + 1 } }))
    this.updateSelection(-1, -1)
    this.refresh()
  },
  cycleHeight() {
    store.update(state => ({ ...state, settings: { ...state.settings, blockHeight: ((state.settings.blockHeight || 0) + 1) % 3 } }))
    this.refresh()
  },
  togglePalette() { this.setData({ paletteHidden: !this.data.paletteHidden }) },
  goSettings() { wx.navigateTo({ url: '/pages/time-settings/index' }) },
  goStats() { wx.navigateTo({ url: '/pages/time-stats/index' }) },
  toggleFullscreen() { this.setData({ fullscreen: !this.data.fullscreen }) },
  onShareAppMessage() { return { title: '查看我开放的交流时间', path: '/pages/hall/index' } }
})
