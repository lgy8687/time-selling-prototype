const { dateText } = require('./time')
const typeLabel = item => item.kind === 'errand' ? '帮人办事' : '经验分享'
const timeLabel = item => item.timeMode === 'flexible' ? '限期内完成' : '约定具体时段'
const windowLabel = item => (item.windows || []).map(w => `${dateText(w.date)} ${w.start}—${w.end}`)
const audienceLabel = item => item.kind === 'errand'
  ? `每时段最多 ${item.capacity || 1} 单`
  : item.meeting === '开团' ? `${item.minPeople || 3} 人成团 · 最多 ${item.maxPeople || 6} 人` : '一对一'
const venueLabel = item => {
  if (item.kind === 'errand') return item.scope === '全城' ? `${item.city || '未填写城市'} · 全城` : (item.locations || []).join('、') || '地点待填写'
  if (item.mode === '线上交流') return '线上交流'
  return item.venue === '指定地点' ? (item.locations || []).join('、') || '指定地点' : item.venue || '双方协商'
}
const viewModel = (item, profile, owner = false) => ({
  ...item,
  title: item.title || item.name || '未命名服务',
  offer: item.offer || item.description || '',
  resume: (item.resume || []).filter(Boolean),
  windowLabels: windowLabel(item),
  kindLabel: typeLabel(item), timeModeLabel: timeLabel(item), audienceLabel: audienceLabel(item), venueLabel: venueLabel(item),
  host: owner ? profile.name : item.host || '演示发布者',
  avatar: owner ? profile.name.slice(0, 1) : item.avatar || '服',
  owner,
  localOnly: owner,
  statusLabel: item.status === 'published' ? '本机展示' : item.status === 'draft' || item.status === 'local' ? '本机草稿' : '示例内容'
})
module.exports = { viewModel }
