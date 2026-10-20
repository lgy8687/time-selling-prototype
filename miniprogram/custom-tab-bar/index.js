Component({
  data: {
    selected: 0,
    list: [
      { path: '/pages/hall/index', text: '大厅', icon: '⌂' },
      { path: '/pages/schedule/index', text: '时间表', icon: '▦' },
      { path: '/pages/publish/index', text: '发布', icon: '+' },
      { path: '/pages/messages/index', text: '消息', icon: '○' },
      { path: '/pages/me/index', text: '我的', icon: '♙' }
    ]
  },
  methods: {
    switchTab(e) {
      const index = Number(e.currentTarget.dataset.index)
      wx.switchTab({ url: this.data.list[index].path })
    }
  }
})
