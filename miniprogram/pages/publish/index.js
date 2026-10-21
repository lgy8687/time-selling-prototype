const store = require('../../utils/store')
const { dateText } = require('../../utils/time')
Page({
  data: { form: { name: '', category: '职业经验', description: '', price: '', duration: '60', mode: '线上交流' }, categories: ['技能教学','职业经验','开店经营','内容创作','专业咨询'], categoryIndex: 1, openSlots: [], drafts: [], error: '', developerMode: false },
  onShow() { this.getTabBar().setData({ selected: 2, developerMode: Boolean(store.read().settings.developerMode) }); this.refresh() },
  refresh() { const s = store.read(); this.setData({ openSlots: s.events.filter(e => store.available(s.events,e)).map(e => ({ ...e, label: `${dateText(e.date)} ${e.start}–${e.end}` })), drafts: s.drafts, developerMode: Boolean(s.settings.developerMode) }) },
  field(e) { this.setData({ [`form.${e.currentTarget.dataset.field}`]: e.detail.value, error: '' }) },
  category(e) { this.setData({ categoryIndex: Number(e.detail.value), 'form.category': this.data.categories[Number(e.detail.value)] }) },
  save() {
    const form = this.data.form
    if (!form.name.trim()) return this.setData({ error: '请填写服务名称。' })
    if (!form.description.trim()) return this.setData({ error: '请说明你能分享什么。' })
    const price = Number(form.price)
    if (!Number.isFinite(price) || price < 0 || price > 99999 || form.price === '') return this.setData({ error: '请输入 0 到 99999 元之间的价格。' })
    const duration = Number(form.duration)
    if (!Number.isInteger(duration) || duration < 15 || duration > 480) return this.setData({ error: '时长请输入 15 到 480 分钟。' })
    const item = { ...form, name: form.name.trim(), description: form.description.trim(), price, duration, id: store.uid(), status: 'local' }
    try { store.update(s => ({ ...s, drafts: [...s.drafts, item] })); this.setData({ form: { name: '', category: '职业经验', description: '', price: '', duration: '60', mode: '线上交流' }, error: '' }); this.refresh(); wx.showToast({ title: '已存为本机草稿', icon: 'success' }) }
    catch (error) { this.setData({ error: '保存失败，请检查手机存储空间后重试。' }) }
  },
  goSchedule() { wx.switchTab({ url: '/pages/schedule/index' }) },
  remove(e) { const id = e.currentTarget.dataset.id; wx.showModal({ title: '删除这份草稿？', success: r => { if (r.confirm) { store.update(s => ({ ...s, drafts: s.drafts.filter(d => d.id !== id) })); this.refresh() } } }) }
})
