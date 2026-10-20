const samples = require('../../utils/showcase')
const store = require('../../utils/store')
Page({
  data: { categories: ['全部','技能教学','职业经验','开店经营','内容创作'], category: '全部', list: [], detail: null },
  onShow() { this.getTabBar().setData({ selected: 0 }); this.filter() },
  filter() {
    const state = store.read()
    const own = state.drafts.filter(d => d.status === 'local').map(d => ({ ...d, host: `${state.profile.name} · 本机草稿`, avatar: state.profile.name.slice(0,1), tone: 'mint', local: true }))
    this.setData({ list: [...own, ...samples].filter(x => this.data.category === '全部' || x.category === this.data.category) })
  },
  chooseCategory(e) { this.setData({ category: e.currentTarget.dataset.category }); this.filter() },
  openDetail(e) { this.setData({ detail: this.data.list.find(x => x.id === e.currentTarget.dataset.id) }) },
  closeDetail() { this.setData({ detail: null }) },
  goSchedule() { this.setData({ detail: null }); wx.switchTab({ url: '/pages/schedule/index' }) }
})
