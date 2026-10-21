const { today, addDays, overlaps, minutes } = require('./time')
const KEY = 'time-selling-mini-v1'
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const todayExamples = day => [
  { id: uid(), date: day, start: '09:00', end: '10:00', type: 'reserved', title: '小林 · 摄影课' },
  { id: uid(), date: day, start: '11:00', end: '11:30', type: 'blocked', title: '私人安排' }
]
const initial = () => {
  const day = today()
  return {
    profile: { name: '演示账户', avatar: '' },
    demoSeedVersion: 2,
    settings: { startHour: 8, endHour: 22, mode: 2, developerMode: false },
    palette: [
      { id: 'yoga', title: '瑜伽课', type: 'reserved', color: 'mint', parentId: '' },
      { id: 'yoga-student', title: '学员小王', type: 'reserved', color: 'mint', parentId: 'yoga' },
      { id: 'student', title: '学生名字', type: 'reserved', color: 'blue', parentId: '' },
      { id: 'group', title: '小组名字', type: 'reserved', color: 'mint', parentId: '' },
      { id: 'private', title: '私人安排', type: 'blocked', color: 'gray', parentId: '' }
    ],
    events: [
      ...todayExamples(day),
      { id: uid(), date: addDays(day, 1), start: '10:00', end: '11:00', type: 'reserved', title: '学生 · 示例' },
      { id: uid(), date: addDays(day, 2), start: '14:00', end: '15:00', type: 'blocked', title: '私人安排' }
    ],
    drafts: [],
    requests: [],
    orders: []
  }
}
const read = () => {
  try {
    const state = wx.getStorageSync(KEY)
    if (state && Array.isArray(state.events) && state.settings && Array.isArray(state.palette)) {
      const originalDemo = !state.demoSeedVersion && state.profile?.name === '演示账户' && !state.profile.avatar && state.events.length === 3 && !state.drafts?.length && !state.requests?.length &&
        ['学生 · 示例', '私人安排', '开放交流时间'].every(title => state.events.some(event => event.title === title))
      if (originalDemo) {
        const day = today()
        const upgraded = { ...state, demoSeedVersion: 2, events: state.events.some(event => event.date === day) ? state.events : [...todayExamples(day), ...state.events] }
        wx.setStorageSync(KEY, upgraded)
        return upgraded
      }
      if (!Array.isArray(state.orders) || !state.palette.some(item => item.parentId)) {
        const palette = state.palette.some(item => item.parentId) ? state.palette : [
          ...state.palette,
          { id: uid(), title: '瑜伽课', type: 'reserved', color: 'mint', parentId: '' },
          { id: uid(), title: '学员小王', type: 'reserved', color: 'mint', parentId: '' }
        ]
        if (!state.palette.some(item => item.parentId)) palette[palette.length - 1].parentId = palette[palette.length - 2].id
        const upgraded = { ...state, palette, orders: state.orders || [] }
        wx.setStorageSync(KEY, upgraded)
        return upgraded
      }
      return state
    }
  } catch (error) { /* Fall back to the demo state. */ }
  const seed = initial()
  try { wx.setStorageSync(KEY, seed) } catch (error) { /* The UI can still show sample content. */ }
  return seed
}
const write = state => { wx.setStorageSync(KEY, state); return state }
const update = transform => write(transform(read()))
const collision = (events, candidate) => events.find(e => e.id !== candidate.id && overlaps(e, candidate) && (candidate.type === 'open' || e.type !== 'open'))
const available = (events, slot) => slot.type === 'open' && new Date(`${slot.date}T${slot.start}:00`).getTime() > Date.now() && !events.some(e => e.id !== slot.id && e.type !== 'open' && overlaps(e, slot))
const validTime = item => item.date && /^\d{2}:\d{2}$/.test(item.start) && /^\d{2}:\d{2}$/.test(item.end) && minutes(item.start) < minutes(item.end)
module.exports = { read, write, update, uid, collision, available, validTime }
