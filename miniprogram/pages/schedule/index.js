const { today, dayKey, addDays, fromDay, dateText, makeSlots, minutes, clock } = (() => {
  const t = require('../../utils/time')
  return { ...t, fromDay: value => { const [y,m,d] = value.split('-').map(Number); return new Date(y,m-1,d) } }
})()
const store = require('../../utils/store')
const types = { reserved: '已安排', blocked: '私人占用', open: '开放时间' }

Page({
  data: {
    date: today(), dateLabel: '', view: 'month', slots: [], hourRows: [], week: [], month: [], agenda: [], weekdays: ['一','二','三','四','五','六','日'], paletteHidden: false,
    settings: {}, palette: [], selectedFrom: -1, selectedTo: -1, selectedLabel: '', selectionHint: false,
    editor: false, shareOpen: false, developerMode: false,
    form: {}, editing: false, error: '', publicSlots: [],
    hoursStart: Array.from({ length: 24 }, (_, i) => i),
    hoursEnd: Array.from({ length: 24 }, (_, i) => i + 1)
  },
  onShow() {
    this.getTabBar().setData({ selected: 1 })
    this.refresh()
  },
  refresh() {
    const state = store.read()
    const { date, view } = this.data
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
    const hourRows = []
    slots.forEach((slot, index) => {
      const hour = Math.floor(minutes(slot.start) / 60)
      if (index === 0 || hourRows[hourRows.length - 1].hourNumber !== hour) hourRows.push({ hourNumber: hour, label: `${String(hour).padStart(2, '0')}:00`, cells: [] })
      const length = minutes(slot.end) - minutes(slot.start)
      hourRows[hourRows.length - 1].cells.push({ ...slot, index, flex: length, selected: index >= this.data.selectedFrom && index <= this.data.selectedTo })
    })
    const agenda = eventsFor(date).map(e => ({ ...e, range: `${e.start}–${e.end}`, typeLabel: types[e.type] }))
    const publicSlots = state.events.filter(e => store.available(state.events, e)).sort((a,b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start)).map(e => ({ ...e, label: `${dateText(e.date)} ${e.start}–${e.end}` }))
    const selected = this.data.selectedFrom >= 0 ? slots.slice(this.data.selectedFrom, this.data.selectedTo + 1) : []
    this.setData({ dateLabel: dateText(date), slots, hourRows, week, month, agenda, settings: state.settings, developerMode: Boolean(state.settings.developerMode), palette: state.palette, publicSlots, eventCount: agenda.length, selectedLabel: selected.length ? `${selected[0].start}–${selected[selected.length - 1].end} · ${selected.length} 格` : '', modeLabel: state.settings.mode === 2 ? '30 + 30 分钟' : state.settings.mode === 3 ? '30 + 15 + 15 分钟' : '15 + 15 + 15 + 15 分钟' })
  },
  setView(e) { this.setData({ view: e.currentTarget.dataset.view, selectedFrom: -1, selectedTo: -1, selectionHint: false }); this.refresh() },
  changeDate(date) { this.setData({ date, selectedFrom: -1, selectedTo: -1, selectionHint: false }); this.refresh() },
  shift(e) {
    const count = Number(e.currentTarget.dataset.count)
    let date = addDays(this.data.date, count * (this.data.view === 'week' ? 7 : 1))
    if (this.data.view === 'month') {
      const old = fromDay(this.data.date)
      const target = new Date(old.getFullYear(), old.getMonth() + count + 1, 0)
      date = dayKey(new Date(target.getFullYear(), target.getMonth(), Math.min(old.getDate(), target.getDate())))
    }
    this.changeDate(date)
  },
  goToday() { this.changeDate(today()) },
  pickDate(e) { this.changeDate(e.detail.value) },
  chooseDate(e) { this.changeDate(e.currentTarget.dataset.date) },
  calendarTouchStart(e) { this.calendarTouch = e.touches[0] },
  calendarTouchEnd(e) {
    if (!this.calendarTouch || !e.changedTouches.length) return
    const delta = e.changedTouches[0].clientY - this.calendarTouch.clientY
    this.calendarTouch = null
    if (Math.abs(delta) < 60 || this.data.view === 'day') return
    if (delta < 0 && this.data.view === 'month') this.setData({ view: 'week' })
    if (delta > 0 && this.data.view === 'week') this.setData({ view: 'month' })
  },
  openExisting(id) {
    const state = store.read()
    const old = state.events.find(item => item.id === id)
    if (old) this.setData({ form: { ...old }, editing: true, editor: true, error: '' })
  },
  openAgenda(e) { this.openExisting(e.currentTarget.dataset.eventid) },
  updateSelection(from, to) {
    const selected = from >= 0 ? this.data.slots.slice(from, to + 1) : []
    const hourRows = this.data.hourRows.map(row => ({ ...row, cells: row.cells.map(cell => ({ ...cell, selected: cell.index >= from && cell.index <= to && from >= 0 })) }))
    this.setData({ selectedFrom: from, selectedTo: to, hourRows, selectedLabel: selected.length ? `${selected[0].start}–${selected[selected.length - 1].end} · ${selected.length} 格` : '', selectionHint: selected.length >= 4 })
  },
  openSlot(e) {
    const index = Number(e.currentTarget.dataset.index)
    const slot = this.data.slots[index]
    if (!slot) return
    if (slot.eventId) return this.openExisting(slot.eventId)
    let { selectedFrom: from, selectedTo: to } = this.data
    if (from < 0 || index >= from && index <= to) { from = index; to = index }
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
  choosePalette(e) {
    const palette = this.data.palette.find(item => item.id === e.currentTarget.dataset.id)
    if (!palette) return
    if (this.data.selectedFrom < 0) return wx.showToast({ title: '请先选择时间格', icon: 'none' })
    const selected = this.data.slots.slice(this.data.selectedFrom, this.data.selectedTo + 1)
    if (selected.some(item => item.eventId)) return wx.showToast({ title: '所选时间已有安排', icon: 'none' })
    this.setData({ form: { id: '', date: this.data.date, start: selected[0].start, end: selected[selected.length - 1].end, title: palette.title, type: palette.type }, editing: false, editor: true, error: '' })
  },
  addEvent() {
    const state = store.read()
    const palette = state.palette[0]
    const start = clock(state.settings.startHour * 60)
    this.setData({ form: { id: '', date: this.data.date, start, end: clock(minutes(start) + 60), title: palette.title, type: palette.type }, editing: false, editor: true, error: '' })
  },
  editField(e) { this.setData({ [`form.${e.currentTarget.dataset.field}`]: e.detail.value, error: '' }) },
  chooseType(e) { this.setData({ 'form.type': e.currentTarget.dataset.type, error: '' }) },
  closeEditor() { this.setData({ editor: false, error: '' }) },
  saveEvent() {
    const form = { ...this.data.form, title: (this.data.form.title || '').trim() || types[this.data.form.type] }
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
