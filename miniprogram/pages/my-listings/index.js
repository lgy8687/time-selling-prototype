const store = require('../../utils/store')
const { viewModel } = require('../../utils/service-format')
Page({
  data: { listings: [], developerMode: false },
  onShow() { const state = store.read(); this.setData({ listings: state.drafts.map(item => viewModel(item, state.profile, true)).reverse(), developerMode: Boolean(state.settings.developerMode) }) },
  back() { wx.navigateBack() },
  openListing(e) { wx.navigateTo({ url: `/pages/service/index?id=${e.currentTarget.dataset.id}` }) },
  goPublish() { getApp().globalData.openPublishChooser = true; wx.switchTab({ url: '/pages/publish/index' }) }
})
