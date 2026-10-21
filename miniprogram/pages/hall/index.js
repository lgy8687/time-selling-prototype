const samples = require('../../utils/showcase')
const store = require('../../utils/store')
Page({
  data: { categories: ['全部','知识付费','跑腿代办','职业技能','情绪价值'], category: '全部', list: [], developerMode: false, version: 'v0.8.0-mini' },
  onShow() { this.getTabBar().setData({ selected: 0, developerMode: Boolean(store.read().settings.developerMode) }); this.filter() },
  filter() {
    const state = store.read()
    const group = item => item.marketCategory || (item.kind === 'errand' || item.category === '生活帮办' ? '跑腿代办' : item.category === '技能教学' ? '职业技能' : '知识付费')
    const own = state.drafts.filter(d => d.status === 'published').map(d => ({ ...d, name: d.title || d.name, description: d.offer || d.description, mode: d.kind === 'errand' ? '跑腿代办' : (d.modes || [d.mode || '线上交流']).join('＋'), host: `${state.profile.name} · 本机展示`, avatar: state.profile.name.slice(0,1), tone: 'mint', local: true }))
    this.setData({ list: [...own, ...samples].filter(x => this.data.category === '全部' || group(x) === this.data.category), developerMode: Boolean(state.settings.developerMode) })
  },
  chooseCategory(e) { this.setData({ category: e.currentTarget.dataset.category }); this.filter() },
  openDetail(e) { wx.navigateTo({ url: `/pages/service/index?id=${e.currentTarget.dataset.id}` }) }
})
