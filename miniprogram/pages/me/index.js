const store = require('../../utils/store')
const { viewModel } = require('../../utils/service-format')
Page({
  data: { profile: {}, editing: false, nameInput: '', draftCount: 0, eventCount: 0, openCount: 0, orderCount: 0, buyCount: 0, listings: [], section: '', version: 'v0.8.1-mini', developerMode: false },
  onShow() { this.getTabBar().setData({ selected: 4, developerMode: Boolean(store.read().settings.developerMode) }); this.refresh() },
  refresh() { const s = store.read(); this.setData({ profile: s.profile, avatarInitial: s.profile.name.slice(0, 1), nameInput: s.profile.name, draftCount: s.drafts.length, listings: s.drafts.map(item => viewModel(item, s.profile, true)).reverse(), eventCount: s.events.filter(e => e.type !== 'open').length, openCount: s.drafts.filter(item => item.status === 'published').reduce((sum, item) => sum + (item.windows || []).length, 0), orderCount: (s.orders || []).filter(item => item.status === 'confirmed').length, buyCount: (s.orders || []).length, developerMode: Boolean(s.settings.developerMode) }) },
  edit() { this.setData({ editing: true }) },
  closeEdit() { this.setData({ editing: false }) },
  inputName(e) { this.setData({ nameInput: e.detail.value }) },
  saveName() {
    const name = this.data.nameInput.trim()
    if (!name) return wx.showToast({ title: '请输入昵称', icon: 'none' })
    try { store.update(s => ({ ...s, profile: { ...s.profile, name } })); this.setData({ editing: false }); this.refresh(); wx.showToast({ title: '已保存', icon: 'success' }) }
    catch (error) { wx.showToast({ title: '保存失败，请稍后重试', icon: 'none' }) }
  },
  chooseAvatar() {
    wx.chooseMedia({ count: 1, mediaType: ['image'], sizeType: ['compressed'], sourceType: ['album','camera'], success: result => {
      const file = result.tempFiles[0]
      if (!file || file.size > 5 * 1024 * 1024) return wx.showToast({ title: '请选择小于 5 MB 的图片', icon: 'none' })
      wx.saveFile({ tempFilePath: file.tempFilePath, success: saved => { store.update(s => ({ ...s, profile: { ...s.profile, avatar: saved.savedFilePath } })); this.refresh() }, fail: () => wx.showToast({ title: '图片保存失败', icon: 'none' }) })
    } })
  },
  openSection(e) { const section = e.currentTarget.dataset.section; if (section === '我发布的') return wx.navigateTo({ url: '/pages/my-listings/index' }); if (section === '我卖出的') return wx.navigateTo({ url: '/pages/orders/index?role=seller' }); if (section === '我买到的') return wx.navigateTo({ url: '/pages/orders/index?role=buyer' }); this.setData({ section }) },
  goSettings() { wx.navigateTo({ url: '/pages/settings/index' }) },
  closeSection() { this.setData({ section: '' }) },
  openListing(e) { wx.navigateTo({ url: `/pages/service/index?id=${e.currentTarget.dataset.id}` }) },
  goSchedule() { wx.switchTab({ url: '/pages/schedule/index' }) },
  goStats() { wx.navigateTo({ url: '/pages/time-stats/index' }) },
  goPublish() { this.setData({ section: '' }); getApp().globalData.openPublishHome = true; wx.switchTab({ url: '/pages/publish/index' }) }
})
