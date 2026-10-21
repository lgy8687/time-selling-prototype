const { dateText } = require('./time')
const typeLabel = item => item.marketCategory || (item.kind === 'errand' ? '跑腿代办' : '知识付费')
const timeLabel = item => item.timeMode === 'flexible' ? '限期内完成' : '约定具体时段'
const windowLabel = item => (item.windows || []).map(w => `${dateText(w.date)} ${w.start}—${w.end}`)
const audienceLabel = item => item.kind === 'errand'
  ? `每时段最多 ${item.capacity || 1} 单`
  : (item.meetings || [item.meeting || '一对一']).includes('开团') ? `${item.minPeople || 3} 人成团 · 最多 ${item.maxPeople || 6} 人` : '一对一'
const venueLabel = item => {
  if (item.kind === 'errand') return item.scope === '全城' ? `${item.city || '未填写城市'} · 全城` : (item.locations || []).join('、') || '地点待填写'
  if (!(item.modes || [item.mode || '线上交流']).includes('线下交流')) return '线上交流'
  return item.venue === '指定地点' ? (item.locations || []).join('、') || '指定地点' : item.venue || '双方协商'
}
const pricingLines = item => {
  if (!item.prices || item.kind === 'errand') return []
  return (item.modes || [item.mode || '线上交流']).flatMap(mode => (item.meetings || [item.meeting || '一对一']).map(meeting => {
    const key = `${mode === '线上交流' ? 'online' : 'offline'}${meeting === '开团' ? 'Group' : 'One'}`
    return { label: `${mode === '线上交流' ? '线上' : '线下'} · ${meeting}${meeting === '开团' ? '（每人）' : ''}`, price: item.prices[key] }
  })).filter(line => line.price !== '' && line.price != null)
}
const viewModel = (item, profile, owner = false) => ({
  ...item,
  title: item.title || item.name || '未命名服务',
  offer: item.offer || item.description || '',
  resume: (item.resume || []).filter(Boolean),
  windowLabels: windowLabel(item),
  kindLabel: typeLabel(item), timeModeLabel: timeLabel(item), audienceLabel: audienceLabel(item), venueLabel: venueLabel(item), pricingLines: pricingLines(item), modeLabel: (item.modes || [item.mode || '线上交流']).join('＋'), hasGroup: (item.meetings || [item.meeting || '一对一']).includes('开团'),
  host: owner ? profile.name : item.host || '演示发布者',
  avatar: owner ? profile.name.slice(0, 1) : item.avatar || '服',
  owner,
  localOnly: owner,
  statusLabel: item.status === 'published' ? '本机展示' : item.status === 'draft' || item.status === 'local' ? '本机草稿' : '示例内容'
})
module.exports = { viewModel }
