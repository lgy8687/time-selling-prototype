const store = require('../../utils/store')
const { overlaps } = require('../../utils/time')
const labels = { pending: '待卖家确认', confirmed: '已确认', rejected: '已拒绝', cancelled: '已取消' }
Page({
  data: { orders: [], selected: null, role: 'seller', developerMode: false },
  onLoad(options) { this.targetId = options.id || ''; this.setData({ role: options.role === 'buyer' ? 'buyer' : 'seller' }) },
  onShow() { this.refresh() },
  refresh() {
    const state = store.read()
    const orders = (state.orders || []).slice().reverse().map(item => {
      const listing = state.drafts.find(entry => entry.id === item.serviceId)
      const joined = (state.orders || []).filter(entry => entry.serviceId === item.serviceId && entry.windowId === item.windowId && entry.bookingMode === '开团' && entry.status === 'confirmed').length
      const minimum = Number(listing?.minPeople || 3)
      const statusText = item.bookingMode === '开团' && item.status === 'confirmed' && joined < minimum ? `待成团（${joined}/${minimum}）` : labels[item.status] || item.status
      return { ...item, statusText }
    })
    this.setData({ orders, selected: orders.find(item => item.id === this.targetId) || null, developerMode: Boolean(state.settings.developerMode) })
  },
  open(e) { this.targetId = e.currentTarget.dataset.id; this.refresh() },
  backList() { this.targetId = ''; this.refresh() },
  openService() { if (this.data.selected) wx.navigateTo({ url: `/pages/service/index?id=${this.data.selected.serviceId}` }) },
  changeStatus(e) {
    const next = e.currentTarget.dataset.status, id = this.data.selected?.id
    if (!id || !['confirmed', 'rejected', 'cancelled'].includes(next)) return
    const state = store.read(), order = (state.orders || []).find(item => item.id === id)
    if (!order || order.status !== 'pending') return wx.showToast({ title: '这条预约已处理', icon: 'none' })
    const listing = state.drafts.find(item => item.id === order.serviceId)
    if (next === 'confirmed') {
      if (!listing || listing.status !== 'published') return wx.showToast({ title: '服务已下架，不能确认', icon: 'none' })
      const conflict = state.events.find(item => item.type !== 'open' && overlaps(item, order) && item.source !== 'order')
      if (conflict) return wx.showToast({ title: '与私人安排冲突', icon: 'none' })
      const peers = (state.orders || []).filter(item => item.id !== id && item.serviceId === order.serviceId && item.windowId === order.windowId && item.status === 'confirmed')
      const limit = listing.kind === 'errand' ? Number(listing.capacity || 1) : order.bookingMode === '开团' ? Number(listing.maxPeople || 6) : 1
      if (peers.length >= limit || listing.kind !== 'errand' && (peers.some(item => item.bookingMode === '一对一') || order.bookingMode === '一对一' && peers.length)) return wx.showToast({ title: '这个时段已满', icon: 'none' })
    }
    const updated = { ...order, status: next, updatedAt: Date.now() }
    const orders = state.orders.map(item => item.id === id ? updated : item)
    const joined = orders.filter(item => item.serviceId === order.serviceId && item.windowId === order.windowId && item.bookingMode === '开团' && item.status === 'confirmed').length
    const formed = joined >= Number(listing?.minPeople || 3)
    const events = next === 'confirmed' ? [...state.events, { id: `order-${id}`, orderId: id, serviceId: order.serviceId, source: 'order', type: 'reserved', title: `${order.buyerName} · ${order.bookingMode === '开团' ? formed ? '已成团' : '待成团' : '已确认预约'}`, date: order.date, start: order.start, end: order.end }] : state.events.slice()
    if (formed && order.bookingMode === '开团') events.forEach(event => { if (event.source === 'order' && orders.some(item => item.id === event.orderId && item.serviceId === order.serviceId && item.windowId === order.windowId && item.status === 'confirmed')) event.title = `${orders.find(item => item.id === event.orderId).buyerName} · 已成团` })
    store.write({ ...state, events, orders })
    this.refresh()
    wx.showToast({ title: next === 'confirmed' ? order.bookingMode === '开团' && !formed ? '已确认，等待成团' : '预约已确认' : '已处理', icon: 'none' })
  }
})
