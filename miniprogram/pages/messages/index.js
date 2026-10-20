const store = require('../../utils/store')
Page({
  data: { requests: [], selected: null },
  onShow() { this.getTabBar().setData({ selected: 3 }); this.setData({ requests: store.read().requests }) },
  openExample(e) { this.setData({ selected: e.currentTarget.dataset.kind }) },
  closeExample() { this.setData({ selected: null }) }
})
