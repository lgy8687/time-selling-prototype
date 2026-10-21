const { today, dayKey, addDays, fromDay, dateText, makeSlots, minutes } = (() => {
  const t = require('../../utils/time')
  return { ...t, fromDay: value => { const [y,m,d] = value.split('-').map(Number); return new Date(y,m-1,d) } }
})()
const store = require('../../utils/store')
const types = { reserved: '已安排', blocked: '私人占用', open: '开放时间' }
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
    date: today(), dateLabel: '', monthLabel: '', layout: 'agenda', collapseProgress: 0, calendarHeightRpx: 516, monthOffsetRpx: 0,
    slots: [], hourRows: [], week: [], month: [], agenda: [], weekdays: ['一','二','三','四','五','六','日'], paletteHidden: false,
    settings: {}, palette: [], selectedFrom: -1, selectedTo: -1, selectedLabel: '', selectionHint: false,
    editor: false, shareOpen: false, developerMode: false, editorSlots: [], editorRows: [], editorFrom: -1, editorTo: -1, editorRange: '', newLabelOpen: false, newLabelName: '',
    form: {}, editing: false, error: '', publicSlots: [],
    hoursStart: Array.from({ length: 24 }, (_, i) => i),
    hoursEnd: Array.from({ length: 24 }, (_, i) => i + 1)
  },
  onShow() {
    this.getTabBar().setData({ selected: 1, developerMode: Boolean(store.read().settings.developerMode) })
    this.refresh()
  },
  refresh() {
    const state = store.read()
    const { date } = this.data
    const day = fromDay(date)
    const dayOfWeek = (day.getDay() + 6) % 7
    const monday = addDays(date, -dayOfWeek)
    const eventsFor = value => state.events.filter(e => e.date === value).sort((a, b) => a.start.localeCompare(b.start))
    const dateCell = value => {
      const events = eventsFor(value)
      return { date: value, day: Number(value.slice(-2)), selected: value === date, count: events.length, chips: events.slice(0, 1).map(e => ({ id: e.id, title: e.title, type: e.type })), extra: Math.max(0, events.length - 1) }
    }
    const week = Array.from({ length: 7 }, (_, i) => {
      const value = addDays(monday, i)
      return { ...dateCell(value), label: ['一','二','三','四','五','六','日'][i] }
    })
    const first = `${date.slice(0, 7)}-01`
    const offset = (fromDay(first).getDay() + 6) % 7
    const month = Array.from({ length: 42 }, (_, i) => {
      const value = addDays(first, i - offset)
      return { ...dateCell(value), active: value.slice(0, 7) === date.slice(0, 7) }
    })
    const slots = makeSlots(date, state.settings.startHour, state.settings.endHour, state.settings.mode, state.events)
    const hourRows = rowsFor(slots, this.data.selectedFrom, this.data.selectedTo)
    const agenda = eventsFor(date).map(e => ({ ...e, range: `${e.start}–${e.end}`, typeLabel: types[e.type] }))
    const publicSlots = state.events.filter(e => store.available(state.events, e)).sort((a,b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start)).map(e => ({ ...e, label: `${dateText(e.date)} ${e.start}–${e.end}` }))
    const selected = this.data.selectedFrom >= 0 ? slots.slice(this.data.selectedFrom, this.data.selectedTo + 1) : []
    this.setData({ dateLabel: dateText(date), monthLabel: `${day.getMonth() + 1}月`, slots, hourRows, week, month, agenda, settings: state.settings, developerMode: Boolean(state.settings.developerMode), palette: state.palette, publicSlots, eventCount: agenda.length, selectedLabel: selected.length ? `${selected[0].start}–${selected[selected.length - 1].end} · ${selected.length} 格` : '', modeLabel: state.settings.mode === 2 ? '30 + 30 分钟' : state.settings.mode === 3 ? '30 + 15 + 15 分钟' : '15 + 15 + 15 + 15 分钟' })
    this.updateCalendarGeometry(this.data.collapseProgress)
  },
  setLayout(e) {
    this.setData({ layout: e.currentTarget.dataset.layout, selectedFrom: -1, selectedTo: -1, selectionHint: false })
    this.setData({ scheduleScrollTop: 0 })
    this.updateCalendarGeometry(0)
    this.refresh()
  },
  updateCalendarGeometry(progress) {
    const date = this.data.date
    const first = `${date.slice(0, 7)}-01`
    const offset = (fromDay(first).getDay() + 6) % 7
    const selectedWeek = Math.floor((offset + Number(date.slice(-2)) - 1) / 7)
    const p = Math.max(0, Math.min(1, progress))
    this.setData({ collapseProgress: p, calendarHeightRpx: Math.round(516 - 430 * p), monthOffsetRpx: Math.round(selectedWeek * 86 * p) })
  },
  onAgendaScroll(e) {
    const width = wx.getWindowInfo ? wx.getWindowInfo().windowWidth : wx.getSystemInfoSync().windowWidth
    const distance = 430 * width / 750
    const progress = Math.round(Math.max(0, Math.min(1, (e.detail.scrollTop || 0) / distance)) * 100) / 100
    if (Math.abs(progress - this.data.collapseProgress) >= 0.01) this.updateCalendarGeometry(progress)
  },
  changeDate(date) { this.setData({ date, selectedFrom: -1, selectedTo: -1, selectionHint: false }); this.refresh() },
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
  goToday() { this.setData({ scheduleScrollTop: 0 }); this.updateCalendarGeometry(0); this.changeDate(today()) },
  pickDate(e) { this.changeDate(e.detail.value) },
  chooseDate(e) { this.changeDate(e.currentTarget.dataset.date) },
  openExisting(id) {
    const state = store.read()
    const old = state.events.find(item => item.id === id)
    if (old && old.serviceId) {
      getApp().globalData.editServiceId = old.serviceId
      wx.switchTab({ url: '/pages/publish/index' })
      return
    }
    if (old) this.setData({ form: { ...old }, editing: true, editor: true, error: '' })
  },
  openAgenda(e) { this.openExisting(e.currentTarget.dataset.eventid) },
  updateSelection(from, to) {
    const selected = from >= 0 ? this.data.slots.slice(from, to + 1) : []
    const hourRows = rowsFor(this.data.slots, from, to)
    this.setData({ selectedFrom: from, selectedTo: to, hourRows, selectedLabel: selected.length ? `${selected[0].start}–${selected[selected.length - 1].end} · ${selected.length} 格` : '', selectionHint: selected.length >= 4 })
  },
  openSlot(e) {
    const index = Number(e.currentTarget.dataset.index)
    const slot = this.data.slots[index]
    if (!slot) return
    if (slot.eventId) return this.openExisting(slot.eventId)
    let { selectedFrom: from, selectedTo: to } = this.data
    if (from < 0) { from = index; to = index }
    else if (index === from && index === to) return this.updateSelection(-1, -1)
    else if (index === from) from += 1
    else if (index === to) to -= 1
    else if (index > from && index < to) return wx.showToast({ title: '请从选区两端取消', icon: 'none' })
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
    const wasDragging = this.dragAnchor !== undefined
    this.dragAnchor = undefined
    if (!this.gridTouch || !e.changedTouches.length) return
    const deltaX = e.changedTouches[0].clientX - this.gridTouch.clientX
    const deltaY = e.changedTouches[0].clientY - this.gridTouch.clientY
    this.gridTouch = null
    if (!wasDragging && Math.abs(deltaX) > 70 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) this.setData({ paletteHidden: deltaX > 0 })
  },
  gridTouchStart(e) { this.gridTouch = e.touches[0] },
  clearSelection() { this.updateSelection(-1, -1) },
  editorSelection(from, to) {
    const selected = from >= 0 ? this.data.editorSlots.slice(from, to + 1) : []
    this.setData({ editorFrom: from, editorTo: to, editorRows: rowsFor(this.data.editorSlots, from, to), editorRange: selected.length ? `${selected[0].start}–${selected[selected.length - 1].end}` : '' })
  },
  openAdd(palette, from = -1, to = -1) {
    const state = store.read()
    const slots = makeSlots(this.data.date, state.settings.startHour, state.settings.endHour, state.settings.mode, state.events)
    const chosen = from >= 0 ? slots.slice(from, to + 1) : []
    const safeFrom = chosen.length && chosen.every(slot => !slot.eventId) ? from : -1
    const safeTo = safeFrom >= 0 ? to : -1
    this.setData({ form: { id: '', date: this.data.date, start: '', end: '', title: palette.title, type: palette.type }, editing: false, editor: true, error: '', newLabelOpen: false, newLabelName: '', editorSlots: slots, editorRows: rowsFor(slots, safeFrom, safeTo), editorFrom: safeFrom, editorTo: safeTo, editorRange: safeFrom >= 0 ? `${slots[safeFrom].start}–${slots[safeTo].end}` : '' })
  },
  selectEditorSlot(e) {
    const index = Number(e.currentTarget.dataset.index)
    const slot = this.data.editorSlots[index]
    if (!slot || slot.eventId) return wx.showToast({ title: '这段时间已有安排', icon: 'none' })
    let { editorFrom: from, editorTo: to } = this.data
    if (from < 0) { from = index; to = index }
    else if (index === from && index === to) return this.editorSelection(-1, -1)
    else if (index === from) from += 1
    else if (index === to) to -= 1
    else if (index > from && index < to) return wx.showToast({ title: '请从选区两端取消', icon: 'none' })
    else if (index === from - 1) from = index
    else if (index === to + 1) to = index
    else return wx.showToast({ title: '请连续选择时间格', icon: 'none' })
    this.editorSelection(from, to)
  },
  selectEditorPalette(e) {
    const palette = this.data.palette.find(item => item.id === e.currentTarget.dataset.id)
    if (palette) this.setData({ 'form.title': palette.title, 'form.type': palette.type })
  },
  openNewLabel() { this.setData({ newLabelOpen: true, newLabelName: '' }) },
  inputNewLabel(e) { this.setData({ newLabelName: e.detail.value }) },
  cancelNewLabel() { this.setData({ newLabelOpen: false, newLabelName: '' }) },
  saveNewLabel() {
    const title = this.data.newLabelName.trim()
    if (!title) return wx.showToast({ title: '先输入标签名称', icon: 'none' })
    if (this.data.palette.some(item => item.title === title)) return wx.showToast({ title: '这个标签已存在', icon: 'none' })
    const type = this.data.form.type
    const color = type === 'reserved' ? 'blue' : type === 'blocked' ? 'gray' : 'yellow'
    const label = { id: store.uid(), title, type, color }
    try {
      store.update(state => ({ ...state, palette: [...state.palette, label] }))
      this.setData({ palette: [...this.data.palette, label], 'form.title': title, newLabelOpen: false, newLabelName: '' })
      wx.showToast({ title: '标签已添加', icon: 'success' })
    } catch (error) { wx.showToast({ title: '标签保存失败', icon: 'none' }) }
  },
  editorPickDate(e) {
    const date = e.detail.value
    const state = store.read()
    const slots = makeSlots(date, state.settings.startHour, state.settings.endHour, state.settings.mode, state.events)
    this.setData({ 'form.date': date, editorSlots: slots, editorRows: rowsFor(slots, -1, -1), editorFrom: -1, editorTo: -1, editorRange: '', error: '' })
  },
  choosePalette(e) {
    const palette = this.data.palette.find(item => item.id === e.currentTarget.dataset.id)
    if (!palette) return
    if (this.data.selectedFrom < 0) return wx.showToast({ title: '请先选择时间格', icon: 'none' })
    const selected = this.data.slots.slice(this.data.selectedFrom, this.data.selectedTo + 1)
    if (selected.some(item => item.eventId)) return wx.showToast({ title: '所选时间已有安排', icon: 'none' })
    this.openAdd(palette, this.data.selectedFrom, this.data.selectedTo)
  },
  addEvent() {
    const state = store.read()
    this.openAdd(state.palette[0], this.data.layout === 'blocks' ? this.data.selectedFrom : -1, this.data.layout === 'blocks' ? this.data.selectedTo : -1)
  },
  editField(e) { this.setData({ [`form.${e.currentTarget.dataset.field}`]: e.detail.value, error: '' }) },
  chooseType(e) {
    const type = e.currentTarget.dataset.type
    const palette = this.data.palette.find(item => item.type === type)
    this.setData({ 'form.type': type, 'form.title': this.data.editing ? this.data.form.title : (palette ? palette.title : types[type]), error: '' })
  },
  closeEditor() { this.setData({ editor: false, error: '' }) },
  saveEvent() {
    const form = { ...this.data.form, title: (this.data.form.title || '').trim() || types[this.data.form.type] }
    if (!this.data.editing) {
      if (this.data.editorFrom < 0) return this.setData({ error: '请先在时间块中选择连续时段。' })
      form.start = this.data.editorSlots[this.data.editorFrom].start
      form.end = this.data.editorSlots[this.data.editorTo].end
    }
    if (!store.validTime(form)) return this.setData({ error: '请检查日期和起止时间。' })
    const state = store.read()
    const conflict = store.collision(state.events, form)
    if (conflict) return this.setData({ error: `与“${conflict.title}”冲突，请调整时间。` })
    const item = { ...form, id: form.id || store.uid() }
    try {
      store.write({ ...state, events: form.id ? state.events.map(e => e.id === form.id ? item : e) : [...state.events, item] })
      this.setData({ editor: false, selectedFrom: -1, selectedTo: -1, selectionHint: false }); this.refresh(); wx.showToast({ title: '已保存', icon: 'success' })
    } catch (error) { this.setData({ error: '保存失败，请检查手机存储空间后重试。' }) }
  },
  deleteEvent() {
    const id = this.data.form.id
    if (!id) return
    wx.showModal({ title: '删除这段时间？', content: '删除后不会出现在时间表和开放时间中。', success: result => {
      if (!result.confirm) return
      const state = store.read()
      store.write({ ...state, events: state.events.filter(e => e.id !== id) })
      this.setData({ editor: false }); this.refresh(); wx.showToast({ title: '已删除', icon: 'success' })
    } })
  },
  goSettings() { wx.navigateTo({ url: '/pages/settings/index' }) },
  toggleShare() { this.setData({ shareOpen: !this.data.shareOpen }); this.refresh() },
  onShareAppMessage() { return { title: '查看我开放的交流时间', path: '/pages/hall/index' } }
})
