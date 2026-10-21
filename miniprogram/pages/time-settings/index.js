const store = require('../../utils/store')
Page({
  data: {
    settings: {}, developerMode: false,
    hoursStart: Array.from({ length: 24 }, (_, i) => i),
    hoursEnd: Array.from({ length: 24 }, (_, i) => i + 1)
  },
  onShow() {
    const state = store.read()
    this.setData({ settings: { blockFontSize: 1, labelLevel: 1, ...state.settings }, developerMode: Boolean(state.settings.developerMode) })
  },
  setHour(e) {
    const key = e.currentTarget.dataset.key
    const hour = Number(e.detail.value) + (key === 'endHour' ? 1 : 0)
    const next = { ...this.data.settings, [key]: hour }
    if (next.startHour >= next.endHour) return wx.showToast({ title: '结束时间须晚于开始', icon: 'none' })
    store.update(state => ({ ...state, settings: next }))
    this.setData({ settings: next })
  },
  setMode(e) { this.setSetting('mode', Number(e.currentTarget.dataset.mode)) },
  setLabelLevel(e) { this.setSetting('labelLevel', Number(e.currentTarget.dataset.level)) },
  setFontSize(e) { this.setSetting('blockFontSize', Number(e.currentTarget.dataset.size)) },
  setSetting(key, value) {
    const next = { ...this.data.settings, [key]: value }
    store.update(state => ({ ...state, settings: next }))
    this.setData({ settings: next })
  },
  goLabels() { wx.navigateTo({ url: '/pages/time-labels/index' }) },
  goStats() { wx.navigateTo({ url: '/pages/time-stats/index' }) }
})
