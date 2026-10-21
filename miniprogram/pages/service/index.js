const store = require('../../utils/store')
const samples = require('../../utils/showcase')
const { viewModel } = require('../../utils/service-format')
const { overlaps } = require('../../utils/time')

Page({
  data: { id: '', service: null, visibleWindows: [], developerMode: false, chooserOpen: false, requestOpen: false, chosenIndex: -1, buyerName: '', buyerNote: '', bookingMode: '一对一' },
  onLoad(options) { this.serviceId = options.id || ''; this.setData({ id: this.serviceId }) },
  onShow() { this.refresh() },
  refresh() {
    const state = store.read()
    const own = state.drafts.find(item => item.id === this.serviceId)
    const item = own || samples.find(item => item.id === this.serviceId)
    if (!item) return this.setData({ service: null, developerMode: Boolean(state.settings.developerMode) })
    const service = viewModel(item, state.profile, Boolean(own))
    const visibleWindows = (service.windows || []).map(window => {
      const bookings = (state.orders || []).filter(order => order.serviceId === service.id && order.windowId === window.id && ['pending','confirmed'].includes(order.status))
      const limit = service.kind === 'errand' ? Number(service.capacity || 1) : service.hasGroup ? Number(service.maxPeople || 6) : 1
      return { ...window, count: bookings.length,
      available: new Date(`${window.date}T${window.end}:00`).getTime() > Date.now() &&
        (!own || own.status === 'published') &&
        !state.events.some(event => event.type !== 'open' && event.source !== 'order' && overlaps(window, event)) &&
        (service.kind === 'errand' || !bookings.some(order => order.bookingMode === '一对一')) && bookings.length < limit }
    })
    this.setData({ service, visibleWindows, developerMode: Boolean(state.settings.developerMode) })
  },
  edit() {
    getApp().globalData.editServiceId = this.data.id
    wx.switchTab({ url: '/pages/publish/index' })
  },
  openChooser() { this.setData({ chooserOpen: true }) },
  closeChooser() { this.setData({ chooserOpen: false }) },
  selectWindow(e) {
    const index = Number(e.currentTarget.dataset.index)
    const window = this.data.visibleWindows[index]
    if (!window || !window.available) return wx.showToast({ title: '这段时间暂不可选', icon: 'none' })
    if (!this.data.service.owner) return wx.showToast({ title: '示例服务仅供查看', icon: 'none' })
    this.setData({ chooserOpen: false, requestOpen: true, chosenIndex: index, buyerName: '', buyerNote: '', bookingMode: serviceHasGroupOnly(this.data.service) ? '开团' : '一对一' })
  },
  requestField(e) { this.setData({ [e.currentTarget.dataset.field]: e.detail.value }) },
  chooseBookingMode(e) { this.setData({ bookingMode: e.currentTarget.dataset.mode }) },
  closeRequest() { this.setData({ requestOpen: false }) },
  submitRequest() {
    const buyerName = this.data.buyerName.trim(), window = this.data.visibleWindows[this.data.chosenIndex]
    if (!buyerName) return wx.showToast({ title: '填写体验买家称呼', icon: 'none' })
    if (!window?.available) return wx.showToast({ title: '时间已不可选', icon: 'none' })
    const state = store.read()
    const item = state.drafts.find(x => x.id === this.data.id)
    if (!item || item.status !== 'published') return wx.showToast({ title: '这条服务已下架', icon: 'none' })
    const count = (state.orders || []).filter(order => order.serviceId === item.id && order.windowId === window.id && ['pending','confirmed'].includes(order.status)).length
    if (item.kind !== 'errand' && count && this.data.bookingMode === '一对一') return wx.showToast({ title: '此时段已有预约，请选择开团', icon: 'none' })
    const limit = item.kind === 'errand' ? Number(item.capacity || 1) : this.data.bookingMode === '开团' ? Number(item.maxPeople || 6) : 1
    if (count >= limit) return wx.showToast({ title: '这个时段已满', icon: 'none' })
    const order = { id: store.uid(), serviceId: item.id, serviceTitle: item.title, windowId: window.id, date: window.date, start: window.start, end: window.end, buyerName, buyerNote: this.data.buyerNote.trim(), bookingMode: this.data.bookingMode, status: 'pending', createdAt: Date.now() }
    store.write({ ...state, orders: [...(state.orders || []), order] })
    this.setData({ requestOpen: false })
    this.refresh()
    wx.showModal({ title: '演示预约请求已提交', content: '现在可在「我的交易 → 我卖出的」由卖家确认。当前仅保存在这台设备。', showCancel: false })
  },
  unlist() {
    wx.showModal({ title: '下架这项服务？', content: '未成交时段将停止展示；已确认的订单仍保留。', success: result => {
      if (!result.confirm) return
      store.update(state => ({ ...state, drafts: state.drafts.map(item => item.id === this.data.id ? { ...item, status: 'unlisted' } : item) }))
      this.refresh()
    } })
  }
})

function serviceHasGroupOnly(service) { return Boolean(service?.hasGroup && !(service.meetings || []).includes('一对一')) }
