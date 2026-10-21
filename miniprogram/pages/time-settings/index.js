const store = require('../../utils/store')
Page({
  data: { settings: {}, palette: [], roots: [], rootIndex: 0, newTitle: '', newKind: 'primary', developerMode: false, hoursStart: Array.from({ length: 24 }, (_, i) => i), hoursEnd: Array.from({ length: 24 }, (_, i) => i + 1) },
  onShow() { this.refresh() },
  refresh() {
    const state = store.read()
    const palette = state.palette.filter(item => item.id !== 'open')
    this.setData({ settings: state.settings, palette, roots: palette.filter(item => !item.parentId).map(item => item.title), developerMode: Boolean(state.settings.developerMode) })
  },
  setHour(e) {
    const key = e.currentTarget.dataset.key
    const hour = Number(e.detail.value) + (key === 'endHour' ? 1 : 0)
    const next = { ...this.data.settings, [key]: hour }
    if (next.startHour >= next.endHour) return wx.showToast({ title: '结束时间须晚于开始', icon: 'none' })
    store.update(state => ({ ...state, settings: next }))
    this.refresh()
  },
  setMode(e) {
    const mode = Number(e.currentTarget.dataset.mode)
    store.update(state => ({ ...state, settings: { ...state.settings, mode } }))
    this.refresh()
  },
  editPalette(e) { this.setData({ [`palette.${e.currentTarget.dataset.index}.title`]: e.detail.value }) },
  savePalette() {
    const state = store.read()
    const edits = new Map(this.data.palette.map(item => [item.id, item]))
    store.write({ ...state, palette: state.palette.map(item => ({ ...item, title: edits.get(item.id)?.title.trim() || item.title })) })
    this.refresh()
    wx.showToast({ title: '标签已保存', icon: 'success' })
  },
  newTitle(e) { this.setData({ newTitle: e.detail.value }) },
  newKind(e) { this.setData({ newKind: e.currentTarget.dataset.kind }) },
  selectRoot(e) { this.setData({ rootIndex: Number(e.detail.value) }) },
  addPalette() {
    const title = this.data.newTitle.trim()
    if (!title) return wx.showToast({ title: '先填写标签名称', icon: 'none' })
    const state = store.read()
    const roots = state.palette.filter(item => item.id !== 'open' && !item.parentId)
    const parent = this.data.newKind === 'child' ? roots[this.data.rootIndex] : null
    if (this.data.newKind === 'child' && !parent) return wx.showToast({ title: '先添加一级标签', icon: 'none' })
    if (state.palette.some(item => item.title === title && (item.parentId || '') === (parent?.id || ''))) return wx.showToast({ title: '同级标签已存在', icon: 'none' })
    const item = { id: store.uid(), title, type: 'reserved', color: parent?.color || 'mint', parentId: parent?.id || '' }
    store.write({ ...state, palette: [...state.palette, item] })
    this.setData({ newTitle: '' })
    this.refresh()
    wx.showToast({ title: '标签已添加', icon: 'success' })
  },
  goStats() { wx.navigateTo({ url: '/pages/time-stats/index' }) }
})
