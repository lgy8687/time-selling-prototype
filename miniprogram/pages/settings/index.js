const store = require('../../utils/store')
const registry = require('../../utils/ui-registry-data')
const pageGroups = [
  { label: '时间表', prefix: ['B2', 'Z2'] },
  { label: '大厅', prefix: ['B3', 'Z3'] },
  { label: '发布', prefix: ['B4', 'Z4'] },
  { label: '消息', prefix: ['B5', 'Z5'] },
  { label: '我的', prefix: ['B6', 'Z6'] },
  { label: '设置', prefix: ['B7', 'Z7'] },
  { label: '导航', prefix: ['B1', 'Z1'] }
]
const allCodes = [
  ...Object.entries(registry.states).map(([code, item]) => ({ code, name: item.name })),
  ...Object.entries(registry.controls).map(([code, item]) => ({ code, name: item.name || item.file.split('/').slice(-2).join('/') }))
]

Page({
  data: {
    settings: {}, palette: [], version: 'v0.3.0-mini',
    hoursStart: Array.from({ length: 24 }, (_, i) => i),
    hoursEnd: Array.from({ length: 24 }, (_, i) => i + 1),
    pageGroups: pageGroups.map(item => item.label), selectedGroup: 0, codes: []
  },
  onShow() { this.refresh() },
  refresh() {
    const state = store.read()
    const settings = { developerMode: false, ...state.settings }
    this.setData({ settings, palette: state.palette, codes: this.codesFor(this.data.selectedGroup) })
  },
  codesFor(index) {
    const prefixes = pageGroups[index].prefix
    return allCodes.filter(item => prefixes.some(prefix => item.code.startsWith(prefix)))
  },
  setHour(e) {
    const key = e.currentTarget.dataset.key
    const hour = Number(e.detail.value) + (key === 'endHour' ? 1 : 0)
    const next = { ...this.data.settings, [key]: hour }
    if (next.startHour >= next.endHour) return wx.showToast({ title: '结束时间要晚于开始时间', icon: 'none' })
    store.update(state => ({ ...state, settings: next }))
    this.refresh()
  },
  setMode(e) {
    const mode = Number(e.currentTarget.dataset.mode)
    store.update(state => ({ ...state, settings: { ...state.settings, mode } }))
    this.refresh()
  },
  editPalette(e) { this.setData({ [`palette.${e.currentTarget.dataset.index}.title`]: e.detail.value }) },
  savePalette() {
    const old = store.read()
    const palette = this.data.palette.map((item, index) => ({ ...item, title: item.title.trim() || old.palette[index].title }))
    store.write({ ...old, palette })
    this.refresh()
    wx.showToast({ title: '标签已保存', icon: 'success' })
  },
  toggleDeveloper(e) {
    const developerMode = e.detail.value
    store.update(state => ({ ...state, settings: { ...state.settings, developerMode } }))
    this.refresh()
  },
  selectGroup(e) {
    const selectedGroup = Number(e.detail.value)
    this.setData({ selectedGroup, codes: this.codesFor(selectedGroup) })
  },
  copyCode(e) {
    wx.setClipboardData({ data: e.currentTarget.dataset.code, success: () => wx.showToast({ title: '编号已复制', icon: 'none' }) })
  }
})
