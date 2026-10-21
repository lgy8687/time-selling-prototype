const store = require('../../utils/store')
Page({
  data: { parentId: '', parentTitle: '', pick: false, depth: 1, editing: false, rows: [], developerMode: false },
  onLoad(options) {
    this.setData({ parentId: options.parentId || '', pick: options.pick === '1', depth: Number(options.depth || 1) })
  },
  onShow() { this.refresh() },
  refresh() {
    const state = store.read()
    const parent = state.palette.find(item => item.id === this.data.parentId)
    const rows = state.palette.filter(item => item.id !== 'open' && (item.parentId || '') === this.data.parentId).map(item => ({
      ...item, hasChildren: state.palette.some(child => child.parentId === item.id)
    }))
    this.setData({ rows, parentTitle: parent?.title || '', developerMode: Boolean(state.settings.developerMode) })
  },
  chooseLabel(e) {
    const id = e.currentTarget.dataset.id
    if (this.data.editing || !this.data.pick) return this.openDetail(id)
    getApp().globalData.pendingPaletteId = id
    wx.navigateBack({ delta: this.data.depth })
  },
  togglePin(e) {
    const id = e.currentTarget.dataset.id
    store.update(state => ({ ...state, palette: state.palette.map(item => item.id === id ? { ...item, pinned: item.pinned === false } : item) }))
    this.refresh()
  },
  openChildren(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/time-labels/index?parentId=${id}&pick=${this.data.pick ? 1 : 0}&depth=${this.data.depth + 1}` })
  },
  addLabel() {
    wx.navigateTo({ url: `/pages/time-label-detail/index?parentId=${this.data.parentId}` })
  },
  toggleEdit() { this.setData({ editing: !this.data.editing }) },
  openDetail(id) { wx.navigateTo({ url: `/pages/time-label-detail/index?id=${id}` }) }
})
