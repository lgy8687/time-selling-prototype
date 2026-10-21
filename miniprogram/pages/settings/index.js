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
    settings: {}, version: 'v0.8.1-mini',
    pageGroups: pageGroups.map(item => item.label), selectedGroup: 0, codes: []
  },
  onShow() { this.refresh() },
  refresh() {
    const state = store.read()
    const settings = { developerMode: false, ...state.settings }
    this.setData({ settings, codes: this.codesFor(this.data.selectedGroup) })
  },
  codesFor(index) {
    const prefixes = pageGroups[index].prefix
    return allCodes.filter(item => prefixes.some(prefix => item.code.startsWith(prefix)))
  },
  goTimeSettings() { wx.navigateTo({ url: '/pages/time-settings/index' }) },
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
