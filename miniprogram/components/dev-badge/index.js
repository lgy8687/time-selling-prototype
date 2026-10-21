Component({
  properties: { code: { type: String, value: '' } },
  methods: {
    copy() {
      const code = this.properties.code
      if (!code) return
      wx.setClipboardData({ data: code, success: () => wx.showToast({ title: `${code} 已复制`, icon: 'none' }) })
    }
  }
})
