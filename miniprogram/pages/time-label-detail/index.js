const store = require('../../utils/store')
Page({
  data: { id: '', parentId: '', title: '', color: 'mint', developerMode: false, colors: ['mint', 'blue', 'yellow', 'gray'] },
  onLoad(options) {
    const state = store.read()
    const old = state.palette.find(item => item.id === options.id)
    const parent = state.palette.find(item => item.id === (options.parentId || old?.parentId))
    this.setData({
      id: old?.id || '', parentId: old?.parentId || options.parentId || '',
      title: old?.title || '', color: old?.color || parent?.color || 'mint',
      developerMode: Boolean(state.settings.developerMode)
    })
  },
  editTitle(e) { this.setData({ title: e.detail.value }) },
  chooseColor(e) { this.setData({ color: e.currentTarget.dataset.color }) },
  save() {
    const title = this.data.title.trim()
    if (!title) return wx.showToast({ title: '请填写标签名称', icon: 'none' })
    const state = store.read()
    if (state.palette.some(item => item.id !== this.data.id && (item.parentId || '') === this.data.parentId && item.title === title)) return wx.showToast({ title: '同级标签已存在', icon: 'none' })
    const old = state.palette.find(item => item.id === this.data.id)
    const item = old
      ? { ...old, title, color: this.data.color }
      : { id: store.uid(), title, color: this.data.color, type: 'reserved', parentId: this.data.parentId, pinned: true }
    const palette = old ? state.palette.map(label => label.id === item.id ? item : label) : [...state.palette, item]
    const events = state.events.map(event => {
      if (!event.paletteId && !event.parentId) return event
      const label = palette.find(entry => entry.id === event.paletteId)
      const parent = palette.find(entry => entry.id === label?.parentId)
      if (!label) return event
      return { ...event, title: parent ? `${parent.title} · ${label.title}` : label.title }
    })
    store.write({ ...state, palette, events })
    wx.navigateBack()
  }
})
