const { today, dateKey, addDays, fromDay, dateText, makeSlots, minutes, clock } = (() => {
  const t = require('../../utils/time')
  return { ...t, fromDay: value => { const [y,m,d] = value.split('-').map(Number); return new Date(y,m-1,d) } }
})()
const store = require('../../utils/store')
const types = { reserved: '已安排', blocked: '私人占用', open: '开放时间' }

Page({
  data: {
    date: today(), dateLabel: '', view: 'day', slots: [], week: [], month: [],
    settings: {}, palette: [], chosenPalette: 'student',
    editor: false, settingsOpen: false, paletteOpen: false, shareOpen: false,
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
    const week = Array.from({ length: 7 }, (_, i) => {
      const value = addDays(monday, i)
      return { date: value, label: ['一','二','三','四','五','六','日'][i], day: Number(value.slice(-2)), selected: value === date, count: state.events.filter(e => e.date === value).length }
    })
    const first = `${date.slice(0, 7)}-01`
    const offset = (fromDay(first).getDay() + 6) % 7
    const month = Array.from({ length: 42 }, (_, i) => {
      const value = addDays(first, i - offset)
      return { date: value, day: Number(value.slice(-2)), active: value.slice(0, 7) === date.slice(0, 7), selected: value === date, count: state.events.filter(e => e.date === value).length }
    })
    const publicSlots = state.events.filter(e => store.available(state.events, e)).sort((a,b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start)).map(e => ({ ...e, label: `${dateText(e.date)} ${e.start}–${e.end}` }))
    this.setData({ dateLabel: dateText(date), slots: makeSlots(date, state.settings.startHour, state.settings.endHour, state.settings.mode, state.events), week, month, settings: state.settings, palette: state.palette, publicSlots, eventCount: state.events.filter(e => e.date === date).length, modeLabel: state.settings.mode === 2 ? '每小时 2 格' : state.settings.mode === 3 ? '30 + 15 + 15 分钟' : '每小时 4 格' })
  },
  setView(e) { this.setData({ view: e.currentTarget.dataset.view }); this.refresh() },
  shift(e) {
    const count = Number(e.currentTarget.dataset.count)
    let date = addDays(this.data.date, count * (this.data.view === 'week' ? 7 : 1))
    if (this.data.view === 'month') {
      const old = fromDay(this.data.date)
      const target = new Date(old.getFullYear(), old.getMonth() + count + 1, 0)
      date = dateKey(new Date(target.getFullYear(), target.getMonth(), Math.min(old.getDate(), target.getDate())))
    }
    this.setData({ date }); this.refresh()
  },
  goToday() { this.setData({ date: today() }); this.refresh() },
  pickDate(e) { this.setData({ date: e.detail.value }); this.refresh() },
  chooseDate(e) { this.setData({ date: e.currentTarget.dataset.date, view: 'day' }); this.refresh() },
  choosePalette(e) { this.setData({ chosenPalette: e.currentTarget.dataset.id }) },
  openSlot(e) {
    const id = e.currentTarget.dataset.eventid
    const state = store.read()
    const old = state.events.find(item => item.id === id)
    const palette = state.palette.find(item => item.id === this.data.chosenPalette) || state.palette[0]
    const form = old ? { ...old } : { id: '', date: this.data.date, start: e.currentTarget.dataset.start, end: e.currentTarget.dataset.end, title: palette.title, type: palette.type }
    this.setData({ form, editing: Boolean(old), editor: true, error: '' })
  },
  addEvent() {
    const state = store.read()
    const palette = state.palette.find(item => item.id === this.data.chosenPalette) || state.palette[0]
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
      this.setData({ editor: false }); this.refresh(); wx.showToast({ title: '已保存', icon: 'success' })
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
  toggleSettings() { this.setData({ settingsOpen: !this.data.settingsOpen }) },
  setMode(e) { const mode = Number(e.currentTarget.dataset.mode); store.update(s => ({ ...s, settings: { ...s.settings, mode } })); this.refresh() },
  setHour(e) {
    const key = e.currentTarget.dataset.key
    const hour = Number(e.detail.value) + (key === 'endHour' ? 1 : 0)
    const next = { ...this.data.settings, [key]: hour }
    if (next.startHour >= next.endHour) return wx.showToast({ title: '结束时间要晚于开始时间', icon: 'none' })
    store.update(s => ({ ...s, settings: next })); this.refresh()
  },
  togglePalette() { this.setData({ paletteOpen: !this.data.paletteOpen }) },
  editPalette(e) { this.setData({ [`palette.${e.currentTarget.dataset.index}.title`]: e.detail.value }) },
  savePalette() {
    const palette = this.data.palette.map(p => ({ ...p, title: p.title.trim() || types[p.type] }))
    store.update(s => ({ ...s, palette }))
    this.setData({ paletteOpen: false }); this.refresh(); wx.showToast({ title: '名称已保存', icon: 'success' })
  },
  toggleShare() { this.setData({ shareOpen: !this.data.shareOpen }); this.refresh() },
  onShareAppMessage() { return { title: '查看我开放的交流时间', path: '/pages/hall/index' } }
})
