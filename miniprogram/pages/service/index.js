const store = require('../../utils/store')
const samples = require('../../utils/showcase')
const { viewModel } = require('../../utils/service-format')
const { overlaps } = require('../../utils/time')

Page({
  data: { id: '', service: null, visibleWindows: [], developerMode: false, chooserOpen: false },
  onLoad(options) { this.serviceId = options.id || ''; this.setData({ id: this.serviceId }) },
  onShow() { this.refresh() },
  refresh() {
    const state = store.read()
    const own = state.drafts.find(item => item.id === this.serviceId)
    const item = own || samples.find(item => item.id === this.serviceId)
    if (!item) return this.setData({ service: null, developerMode: Boolean(state.settings.developerMode) })
    const service = viewModel(item, state.profile, Boolean(own))
    const visibleWindows = (service.windows || []).map(window => ({
      ...window,
      available: new Date(`${window.date}T${window.end}:00`).getTime() > Date.now() &&
        (!own || own.status === 'published' && state.events.some(event => event.serviceId === own.id && overlaps(window, event))) &&
        !state.events.some(event => event.type !== 'open' && overlaps(window, event))
    }))
    this.setData({ service, visibleWindows, developerMode: Boolean(state.settings.developerMode) })
  },
  edit() {
    getApp().globalData.editServiceId = this.data.id
    wx.switchTab({ url: '/pages/publish/index' })
  },
  openChooser() { this.setData({ chooserOpen: true }) },
  closeChooser() { this.setData({ chooserOpen: false }) },
  selectWindow(e) {
    const window = this.data.visibleWindows[Number(e.currentTarget.dataset.index)]
    if (!window || !window.available) return wx.showToast({ title: '这段时间暂不可选', icon: 'none' })
    wx.showModal({
      title: '本机体验版',
      content: '你已看到买家选择时间的页面。预约意向、成团与付款需要服务端接入后才能真正提交。',
      showCancel: false
    })
  }
})
