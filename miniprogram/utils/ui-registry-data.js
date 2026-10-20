module.exports = {
  "version": "v0.2.0-mini",
  "templates": {},
  "states": {
    "B100": {
      "name": "五入口底部导航",
      "template": null
    },
    "B201": {
      "name": "时间表主视图",
      "template": null
    },
    "B202": {
      "name": "周日期选择",
      "template": null
    },
    "B203": {
      "name": "月日期选择",
      "template": null
    },
    "B204": {
      "name": "日时间网格",
      "template": null
    },
    "B205": {
      "name": "常用标签栏",
      "template": null
    },
    "B206": {
      "name": "添加或编辑时间面板",
      "template": null
    },
    "B209": {
      "name": "可分享时间预览面板",
      "template": null
    },
    "B210": {
      "name": "已安排时间的删除操作",
      "template": null
    },
    "B211": {
      "name": "时间编辑错误提示",
      "template": null
    },
    "B301": {
      "name": "大厅列表",
      "template": null
    },
    "B302": {
      "name": "服务详情面板",
      "template": null
    },
    "B401": {
      "name": "发布草稿",
      "template": null
    },
    "B402": {
      "name": "发布表单错误提示",
      "template": null
    },
    "B501": {
      "name": "消息入口",
      "template": null
    },
    "B601": {
      "name": "我的首页",
      "template": null
    },
    "B602": {
      "name": "修改昵称面板",
      "template": null
    },
    "B603": {
      "name": "我的功能详情容器",
      "template": null
    },
    "B605": {
      "name": "我发布的详情",
      "template": null
    },
    "B606": {
      "name": "我可卖的详情",
      "template": null
    },
    "B607": {
      "name": "其他工具详情",
      "template": null
    },
    "B212": {
      "name": "所选日期的安排列表",
      "template": null
    },
    "B213": {
      "name": "连续时间格选中状态",
      "template": null
    },
    "B701": {
      "name": "设置主界面",
      "template": null
    },
    "B702": {
      "name": "开发者编号预览",
      "template": null
    },
    "B214": {
      "name": "尚未选择时间格的提示",
      "template": null
    },
    "B215": {
      "name": "时间格全宽展示状态",
      "template": null
    }
  },
  "controls": {
    "Z100-1": {
      "file": "custom-tab-bar/index.wxml",
      "parent": "B100"
    },
    "Z201-1": {
      "file": "pages/schedule/index.wxml",
      "parent": "B201",
      "name": "时间表设置入口"
    },
    "Z201-2": {
      "file": "pages/schedule/index.wxml",
      "parent": "B201",
      "name": "回到今天"
    },
    "Z201-3": {
      "file": "pages/schedule/index.wxml",
      "parent": "B201",
      "name": "前一日期范围"
    },
    "Z201-4": {
      "file": "pages/schedule/index.wxml",
      "parent": "B201",
      "name": "后一日期范围"
    },
    "Z201-5": {
      "file": "pages/schedule/index.wxml",
      "parent": "B201",
      "name": "日时间格视图"
    },
    "Z201-6": {
      "file": "pages/schedule/index.wxml",
      "parent": "B201",
      "name": "周与列表视图"
    },
    "Z201-7": {
      "file": "pages/schedule/index.wxml",
      "parent": "B201",
      "name": "月与列表视图"
    },
    "Z202-1": {
      "file": "pages/schedule/index.wxml",
      "parent": "B202",
      "name": "选择周历日期"
    },
    "Z203-1": {
      "file": "pages/schedule/index.wxml",
      "parent": "B203",
      "name": "选择月历日期"
    },
    "Z204-1": {
      "file": "pages/schedule/index.wxml",
      "parent": "B204",
      "name": "新增时间"
    },
    "Z204-2": {
      "file": "pages/schedule/index.wxml",
      "parent": "B204",
      "name": "时间格点选或长按"
    },
    "Z205-1": {
      "file": "pages/schedule/index.wxml",
      "parent": "B205",
      "name": "编辑常用标签"
    },
    "Z205-2": {
      "file": "pages/schedule/index.wxml",
      "parent": "B205",
      "name": "把标签用于所选时间"
    },
    "Z201-8": {
      "file": "pages/schedule/index.wxml",
      "parent": "B201",
      "name": "可分享时间入口"
    },
    "Z206-1": {
      "file": "pages/schedule/index.wxml",
      "parent": "B206"
    },
    "Z206-2": {
      "file": "pages/schedule/index.wxml",
      "parent": "B206"
    },
    "Z206-3": {
      "file": "pages/schedule/index.wxml",
      "parent": "B206"
    },
    "Z206-4": {
      "file": "pages/schedule/index.wxml",
      "parent": "B206"
    },
    "Z206-5": {
      "file": "pages/schedule/index.wxml",
      "parent": "B206"
    },
    "Z206-6": {
      "file": "pages/schedule/index.wxml",
      "parent": "B206"
    },
    "Z206-7": {
      "file": "pages/schedule/index.wxml",
      "parent": "B206"
    },
    "Z206-8": {
      "file": "pages/schedule/index.wxml",
      "parent": "B206"
    },
    "Z210-1": {
      "file": "pages/schedule/index.wxml",
      "parent": "B210"
    },
    "Z206-10": {
      "file": "pages/schedule/index.wxml",
      "parent": "B206"
    },
    "Z209-1": {
      "file": "pages/schedule/index.wxml",
      "parent": "B209"
    },
    "Z401-1": {
      "file": "pages/publish/index.wxml",
      "parent": "B401"
    },
    "Z401-2": {
      "file": "pages/publish/index.wxml",
      "parent": "B401"
    },
    "Z401-3": {
      "file": "pages/publish/index.wxml",
      "parent": "B401"
    },
    "Z401-4": {
      "file": "pages/publish/index.wxml",
      "parent": "B401"
    },
    "Z401-5": {
      "file": "pages/publish/index.wxml",
      "parent": "B401"
    },
    "Z401-6": {
      "file": "pages/publish/index.wxml",
      "parent": "B401"
    },
    "Z401-7": {
      "file": "pages/publish/index.wxml",
      "parent": "B401"
    },
    "Z401-8": {
      "file": "pages/publish/index.wxml",
      "parent": "B401"
    },
    "Z401-9": {
      "file": "pages/publish/index.wxml",
      "parent": "B401"
    },
    "Z601-1": {
      "file": "pages/me/index.wxml",
      "parent": "B601"
    },
    "Z601-2": {
      "file": "pages/me/index.wxml",
      "parent": "B601"
    },
    "Z601-3": {
      "file": "pages/me/index.wxml",
      "parent": "B601",
      "name": "打开设置"
    },
    "Z601-4": {
      "file": "pages/me/index.wxml",
      "parent": "B601"
    },
    "Z601-5": {
      "file": "pages/me/index.wxml",
      "parent": "B601"
    },
    "Z601-6": {
      "file": "pages/me/index.wxml",
      "parent": "B601"
    },
    "Z601-7": {
      "file": "pages/me/index.wxml",
      "parent": "B601"
    },
    "Z601-8": {
      "file": "pages/me/index.wxml",
      "parent": "B601"
    },
    "Z601-9": {
      "file": "pages/me/index.wxml",
      "parent": "B601"
    },
    "Z601-10": {
      "file": "pages/me/index.wxml",
      "parent": "B601"
    },
    "Z601-11": {
      "file": "pages/me/index.wxml",
      "parent": "B601"
    },
    "Z602-1": {
      "file": "pages/me/index.wxml",
      "parent": "B602"
    },
    "Z602-2": {
      "file": "pages/me/index.wxml",
      "parent": "B602"
    },
    "Z602-3": {
      "file": "pages/me/index.wxml",
      "parent": "B602"
    },
    "Z603-1": {
      "file": "pages/me/index.wxml",
      "parent": "B603"
    },
    "Z605-1": {
      "file": "pages/me/index.wxml",
      "parent": "B605"
    },
    "Z606-1": {
      "file": "pages/me/index.wxml",
      "parent": "B606"
    },
    "Z301-1": {
      "file": "pages/hall/index.wxml",
      "parent": "B301"
    },
    "Z301-2": {
      "file": "pages/hall/index.wxml",
      "parent": "B301"
    },
    "Z302-1": {
      "file": "pages/hall/index.wxml",
      "parent": "B302"
    },
    "Z302-2": {
      "file": "pages/hall/index.wxml",
      "parent": "B302"
    },
    "Z202-2": {
      "file": "pages/schedule/index.wxml",
      "parent": "B202",
      "name": "周历上下滑动"
    },
    "Z203-2": {
      "file": "pages/schedule/index.wxml",
      "parent": "B203",
      "name": "月历上下滑动"
    },
    "Z204-3": {
      "file": "pages/schedule/index.wxml",
      "parent": "B204",
      "name": "时间格左右滑动"
    },
    "Z212-1": {
      "file": "pages/schedule/index.wxml",
      "parent": "B212",
      "name": "列表新增安排"
    },
    "Z212-2": {
      "file": "pages/schedule/index.wxml",
      "parent": "B212",
      "name": "打开列表安排"
    },
    "Z213-1": {
      "file": "pages/schedule/index.wxml",
      "parent": "B213",
      "name": "取消时间格选择"
    },
    "Z701-1": {
      "file": "pages/settings/index.wxml",
      "parent": "B701",
      "name": "每天开始时间"
    },
    "Z701-2": {
      "file": "pages/settings/index.wxml",
      "parent": "B701",
      "name": "每天结束时间"
    },
    "Z701-3": {
      "file": "pages/settings/index.wxml",
      "parent": "B701",
      "name": "每小时分成两格"
    },
    "Z701-4": {
      "file": "pages/settings/index.wxml",
      "parent": "B701",
      "name": "每小时分成三格"
    },
    "Z701-5": {
      "file": "pages/settings/index.wxml",
      "parent": "B701",
      "name": "每小时分成四格"
    },
    "Z701-6": {
      "file": "pages/settings/index.wxml",
      "parent": "B701",
      "name": "常用标签名称"
    },
    "Z701-7": {
      "file": "pages/settings/index.wxml",
      "parent": "B701",
      "name": "保存标签名称"
    },
    "Z701-8": {
      "file": "pages/settings/index.wxml",
      "parent": "B701",
      "name": "开发者模式开关"
    },
    "Z702-1": {
      "file": "pages/settings/index.wxml",
      "parent": "B702",
      "name": "切换编号分组"
    },
    "Z702-2": {
      "file": "pages/settings/index.wxml",
      "parent": "B702",
      "name": "复制编号"
    }
  },
  "note": "C 模板仍待跨页面交互验证；暂不错误复用。列表中的重复实例共用原型编码。",
  "retired": {
    "B207": "时间表设置面板",
    "B208": "常用标签编辑面板",
    "B604": "设置详情",
    "Z207-1": "pages/schedule/index.wxml",
    "Z207-2": "pages/schedule/index.wxml",
    "Z207-3": "pages/schedule/index.wxml",
    "Z207-4": "pages/schedule/index.wxml",
    "Z207-5": "pages/schedule/index.wxml",
    "Z207-6": "pages/schedule/index.wxml",
    "Z208-1": "pages/schedule/index.wxml",
    "Z208-2": "pages/schedule/index.wxml",
    "Z208-3": "pages/schedule/index.wxml"
  }
}
