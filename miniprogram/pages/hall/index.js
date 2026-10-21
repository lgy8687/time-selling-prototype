const samples = require('../../utils/showcase')
const store = require('../../utils/store')
Page({
  data: { categories: ['全部','技能教学','职业经验','开店经营','内容创作','生活帮办'], category: '全部', list: [], developerMode: false },
  onShow() { this.getTabBar().setData({ selected: 0, developerMode: Boolean(store.read().settings.developerMode) }); this.filter() },
  filter() {
    const state = store.read()
    const own = state.drafts.filter(d => d.status === 'published').map(d => ({ ...d, name: d.title || d.name, description: d.offer || d.description, mode: d.kind === 'errand' ? '帮人办事' : d.mode, host: `${state.profile.name} · 本机展示`, avatar: state.profile.name.slice(0,1), tone: 'mint', local: true }))
    this.setData({ list: [...own, ...samples].filter(x => this.data.category === '全部' || x.category === this.data.category), developerMode: Boolean(state.settings.developerMode) })
  },
  chooseCategory(e) { this.setData({ category: e.currentTarget.dataset.category }); this.filter() },
  openDetail(e) { wx.navigateTo({ url: `/pages/service/index?id=${e.currentTarget.dataset.id}` }) }
})
