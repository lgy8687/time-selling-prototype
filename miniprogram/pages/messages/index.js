const store = require('../../utils/store')
Page({
  data: { requests: [], selected: null, developerMode: false },
  onShow() { this.getTabBar().setData({ selected: 3, developerMode: Boolean(store.read().settings.developerMode) }); const state = store.read(); this.setData({ requests: state.requests, developerMode: Boolean(state.settings.developerMode) }) },
  openExample(e) { this.setData({ selected: e.currentTarget.dataset.kind }) },
  closeExample() { this.setData({ selected: null }) }
})
