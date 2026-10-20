const pad = n => String(n).padStart(2, '0')
const dayKey = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const today = () => dayKey(new Date())
const fromDay = value => { const [y, m, d] = value.split('-').map(Number); return new Date(y, m - 1, d) }
const addDays = (value, count) => { const day = fromDay(value); day.setDate(day.getDate() + count); return dayKey(day) }
const minutes = value => { const [h, m] = value.split(':').map(Number); return h * 60 + m }
const clock = value => `${pad(Math.floor(value / 60))}:${pad(value % 60)}`
const segments = mode => mode === 3 ? [30, 15, 15] : mode === 4 ? [15, 15, 15, 15] : [30, 30]
const overlaps = (a, b) => a.date === b.date && minutes(a.start) < minutes(b.end) && minutes(b.start) < minutes(a.end)
const dateText = value => { const day = fromDay(value); return `${day.getMonth() + 1}月${day.getDate()}日 · ${['周日','周一','周二','周三','周四','周五','周六'][day.getDay()]}` }
const makeSlots = (date, startHour, endHour, mode, events) => {
  const result = []
  for (let hour = startHour; hour < endHour; hour++) {
    let minute = hour * 60
    segments(mode).forEach((length, part) => {
      const start = clock(minute)
      const end = clock(minute + length)
      const overlapping = events.filter(e => e.date === date && minutes(e.start) < minute + length && minutes(e.end) > minute)
      const busy = overlapping.find(e => e.type !== 'open')
      const event = busy || overlapping[0]
      const begins = event && (minutes(event.start) >= minute || part === 0 && minutes(event.start) < minute)
      result.push({ id: `${date}-${start}`, start, end, hour: part === 0 ? `${pad(hour)}:00` : '', type: event ? event.type : '', title: begins ? event.title : '', eventId: event ? event.id : '', isStart: Boolean(begins), blockedOpen: Boolean(busy && overlapping.some(e => e.type === 'open')) })
      minute += length
    })
  }
  return result
}
module.exports = { today, dayKey, addDays, minutes, clock, segments, overlaps, dateText, makeSlots }
