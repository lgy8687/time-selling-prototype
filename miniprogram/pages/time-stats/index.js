const store = require('../../utils/store')
const { today, addDays, minutes } = require('../../utils/time')
const dateInPeriod = (date, period, now) => {
  if (period === 'day') return date === now
  if (period === 'month') return date.slice(0, 7) === now.slice(0, 7)
  const day = new Date(`${now}T12:00:00`)
  return date >= addDays(now, -((day.getDay() + 6) % 7)) && date <= addDays(now, 6 - ((day.getDay() + 6) % 7))
}
const durationText = count => `${Math.floor(count / 60)}小时${count % 60 ? `${count % 60}分钟` : ''}`
Page({
  data: { period: 'week', rows: [], count: 0, duration: '0小时', developerMode: false },
  onShow() { this.refresh() },
  choosePeriod(e) { this.setData({ period: e.currentTarget.dataset.period }); this.refresh() },
  refresh() {
    const state = store.read(), now = today(), grouped = new Map()
    const events = state.events.filter(item => item.type !== 'open' && item.source !== 'publish' && dateInPeriod(item.date, this.data.period, now))
    for (const event of events) {
      const palette = state.palette.find(item => item.id === event.paletteId)
      const parent = state.palette.find(item => item.id === (event.parentId || palette?.parentId))
      const key = event.paletteId || event.title
      const row = grouped.get(key) || { key, primary: parent?.title || palette?.title || event.title, secondary: parent ? palette?.title || '' : '', count: 0, minutes: 0 }
      row.count += 1
      row.minutes += minutes(event.end) - minutes(event.start)
      grouped.set(key, row)
    }
    this.setData({ rows: [...grouped.values()].sort((a, b) => b.minutes - a.minutes).map(row => ({ ...row, duration: durationText(row.minutes) })), count: events.length, duration: durationText(events.reduce((sum, e) => sum + minutes(e.end) - minutes(e.start), 0)), developerMode: Boolean(state.settings.developerMode) })
  }
})
