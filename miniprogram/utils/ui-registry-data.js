module.exports = {
  "version": "v0.5.0-mini",
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
      "name": "当前周收合状态",
      "template": null
    },
    "B203": {
      "name": "连续收放月历",
      "template": null
    },
    "B204": {
      "name": "日历下方时间块排列",
      "template": null
    },
    "B205": {
      "name": "常用标签栏",
      "template": null
    },
    "B206": {
      "name": "编辑时间面板",
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
      "template": null,
      "repeatable": true
    },
    "B301": {
      "name": "大厅列表",
      "template": null
    },
    "B401": {
      "name": "发布入口与类型选择",
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
      "name": "我的发布列表面板",
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
      "name": "日历下方安排排列",
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
    },
    "B216": {
      "name": "添加时间块面板",
      "template": null
    },
    "B218": {
      "name": "添加面板时间块和标签",
      "template": null
    },
    "B219": {
      "name": "可分享时间入口",
      "template": null
    },
    "B303": {
      "name": "大厅分类",
      "template": null
    },
    "B304": {
      "name": "大厅服务卡片",
      "template": null,
      "repeatable": true
    },
    "B403": {
      "name": "经验分享或帮人办事发布表单",
      "template": null
    },
    "B404": {
      "name": "发布页时间与价格区",
      "template": null
    },
    "B405": {
      "name": "发布页我的发布列表",
      "template": null
    },
    "B502": {
      "name": "预约沟通入口",
      "template": null
    },
    "B503": {
      "name": "订单通知入口",
      "template": null
    },
    "B608": {
      "name": "我的头像与资料",
      "template": null
    },
    "B609": {
      "name": "我的交易",
      "template": null
    },
    "B610": {
      "name": "我的工具",
      "template": null
    },
    "B703": {
      "name": "时间表设置",
      "template": null
    },
    "B704": {
      "name": "常用标签设置",
      "template": null
    },
    "B705": {
      "name": "开发者模式设置",
      "template": null
    },
    "B900": {
      "name": "可复制的开发者编号",
      "template": null,
      "repeatable": true
    },
    "B220": {
      "name": "月份与排列切换",
      "template": null
    },
    "B221": {
      "name": "新增常用标签面板",
      "template": null
    },
    "B406": {
      "name": "发布类型选择卡片",
      "template": null
    },
    "B407": {
      "name": "服务内容或履历模板选择面板",
      "template": null
    },
    "B408": {
      "name": "保存自定义模板命名面板",
      "template": null
    },
    "B409": {
      "name": "发布页时间块选择面板",
      "template": null
    },
    "B412": {
      "name": "单条履历编辑行",
      "template": null,
      "repeatable": true
    },
    "B413": {
      "name": "线下场地选择状态",
      "template": null
    },
    "B414": {
      "name": "开团人数设置状态",
      "template": null
    },
    "B415": {
      "name": "多地点指定状态",
      "template": null
    },
    "B307": {
      "name": "买卖双方共用服务详情页",
      "template": null
    },
    "B308": {
      "name": "服务详情履历列表",
      "template": null
    },
    "B309": {
      "name": "发布者详情管理操作",
      "template": null
    },
    "B310": {
      "name": "买家时间选择预览面板",
      "template": null
    },
    "B311": {
      "name": "服务不存在状态",
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
    },
    "Z216-1": {
      "file": "pages/schedule/index.wxml",
      "parent": "B216",
      "name": "关闭添加时间"
    },
    "Z216-2": {
      "file": "pages/schedule/index.wxml",
      "parent": "B216",
      "name": "选择已安排"
    },
    "Z216-3": {
      "file": "pages/schedule/index.wxml",
      "parent": "B216",
      "name": "选择私人占用"
    },
    "Z216-4": {
      "file": "pages/schedule/index.wxml",
      "parent": "B216",
      "name": "选择开放时间"
    },
    "Z216-5": {
      "file": "pages/schedule/index.wxml",
      "parent": "B216",
      "name": "选择日期"
    },
    "Z216-6": {
      "file": "pages/schedule/index.wxml",
      "parent": "B216",
      "name": "保存添加时间"
    },
    "Z218-1": {
      "file": "pages/schedule/index.wxml",
      "parent": "B218",
      "name": "选择或取消时间块"
    },
    "Z218-2": {
      "file": "pages/schedule/index.wxml",
      "parent": "B218",
      "name": "选择常用标签"
    },
    "Z900-1": {
      "file": "components/dev-badge/index.wxml",
      "parent": "B900",
      "name": "复制界面编号"
    },
    "Z203-2": {
      "file": "pages/schedule/index.wxml",
      "parent": "B203",
      "name": "左右滑动切换月份"
    },
    "Z219-1": {
      "file": "pages/schedule/index.wxml",
      "parent": "B219",
      "name": "查看可分享时间"
    },
    "Z220-1": {
      "file": "pages/schedule/index.wxml",
      "parent": "B220",
      "name": "点击月份回到当前月"
    },
    "Z220-2": {
      "file": "pages/schedule/index.wxml",
      "parent": "B220",
      "name": "日历下方显示安排"
    },
    "Z220-3": {
      "file": "pages/schedule/index.wxml",
      "parent": "B220",
      "name": "日历下方显示时间块"
    },
    "Z218-3": {
      "file": "pages/schedule/index.wxml",
      "parent": "B218",
      "name": "打开新增标签"
    },
    "Z221-1": {
      "file": "pages/schedule/index.wxml",
      "parent": "B221",
      "name": "输入标签名称"
    },
    "Z221-2": {
      "file": "pages/schedule/index.wxml",
      "parent": "B221",
      "name": "保存新增标签"
    },
    "Z221-3": {
      "file": "pages/schedule/index.wxml",
      "parent": "B221",
      "name": "取消新增标签"
    },
    "Z405-1": {
      "file": "pages/publish/index.wxml",
      "parent": "B405",
      "name": "打开我发布的服务详情"
    },
    "Z405-2": {
      "file": "pages/publish/index.wxml",
      "parent": "B405",
      "name": "编辑已保存的服务"
    },
    "Z406-1": {
      "file": "pages/publish/index.wxml",
      "parent": "B406",
      "name": "选择经验分享"
    },
    "Z406-2": {
      "file": "pages/publish/index.wxml",
      "parent": "B406",
      "name": "选择帮人办事"
    },
    "Z403-1": {
      "file": "pages/publish/index.wxml",
      "parent": "B403",
      "name": "返回发布类型选择"
    },
    "Z403-2": {
      "file": "pages/publish/index.wxml",
      "parent": "B403",
      "name": "填写服务名称"
    },
    "Z403-3": {
      "file": "pages/publish/index.wxml",
      "parent": "B403",
      "name": "选择经验分享类别"
    },
    "Z403-4": {
      "file": "pages/publish/index.wxml",
      "parent": "B403",
      "name": "选择服务内容模板"
    },
    "Z403-5": {
      "file": "pages/publish/index.wxml",
      "parent": "B403",
      "name": "填写我能提供什么"
    },
    "Z403-6": {
      "file": "pages/publish/index.wxml",
      "parent": "B403",
      "name": "选择履历模板"
    },
    "Z403-7": {
      "file": "pages/publish/index.wxml",
      "parent": "B403",
      "name": "增加履历"
    },
    "Z403-8": {
      "file": "pages/publish/index.wxml",
      "parent": "B403",
      "name": "选择线上交流"
    },
    "Z403-9": {
      "file": "pages/publish/index.wxml",
      "parent": "B403",
      "name": "选择线下交流"
    },
    "Z403-10": {
      "file": "pages/publish/index.wxml",
      "parent": "B403",
      "name": "选择一对一"
    },
    "Z403-11": {
      "file": "pages/publish/index.wxml",
      "parent": "B403",
      "name": "选择开团"
    },
    "Z403-12": {
      "file": "pages/publish/index.wxml",
      "parent": "B403",
      "name": "选择指定地点范围"
    },
    "Z403-13": {
      "file": "pages/publish/index.wxml",
      "parent": "B403",
      "name": "选择全城范围"
    },
    "Z403-14": {
      "file": "pages/publish/index.wxml",
      "parent": "B403",
      "name": "填写服务城市"
    },
    "Z403-15": {
      "file": "pages/publish/index.wxml",
      "parent": "B403",
      "name": "打开保存模板命名"
    },
    "Z403-16": {
      "file": "pages/publish/index.wxml",
      "parent": "B403",
      "name": "保存本机草稿"
    },
    "Z403-17": {
      "file": "pages/publish/index.wxml",
      "parent": "B403",
      "name": "本机发布并查看"
    },
    "Z403-18": {
      "file": "pages/publish/index.wxml",
      "parent": "B403",
      "name": "选用整套模板"
    },
    "Z404-1": {
      "file": "pages/publish/index.wxml",
      "parent": "B404",
      "name": "选择约定具体时段"
    },
    "Z404-2": {
      "file": "pages/publish/index.wxml",
      "parent": "B404",
      "name": "选择限期内完成"
    },
    "Z404-3": {
      "file": "pages/publish/index.wxml",
      "parent": "B404",
      "name": "移除已选时间"
    },
    "Z404-4": {
      "file": "pages/publish/index.wxml",
      "parent": "B404",
      "name": "打开发布页时间块"
    },
    "Z404-5": {
      "file": "pages/publish/index.wxml",
      "parent": "B404",
      "name": "填写每时段接单上限"
    },
    "Z404-6": {
      "file": "pages/publish/index.wxml",
      "parent": "B404",
      "name": "填写价格"
    },
    "Z404-7": {
      "file": "pages/publish/index.wxml",
      "parent": "B404",
      "name": "填写参考时长"
    },
    "Z404-8": {
      "file": "pages/publish/index.wxml",
      "parent": "B404",
      "name": "选择按次收费"
    },
    "Z404-9": {
      "file": "pages/publish/index.wxml",
      "parent": "B404",
      "name": "选择按小时收费"
    },
    "Z407-1": {
      "file": "pages/publish/index.wxml",
      "parent": "B407",
      "name": "关闭模板选择"
    },
    "Z407-2": {
      "file": "pages/publish/index.wxml",
      "parent": "B407",
      "name": "应用所选模板"
    },
    "Z408-1": {
      "file": "pages/publish/index.wxml",
      "parent": "B408",
      "name": "关闭模板命名"
    },
    "Z408-2": {
      "file": "pages/publish/index.wxml",
      "parent": "B408",
      "name": "填写模板名称"
    },
    "Z408-3": {
      "file": "pages/publish/index.wxml",
      "parent": "B408",
      "name": "保存自定义模板"
    },
    "Z409-1": {
      "file": "pages/publish/index.wxml",
      "parent": "B409",
      "name": "关闭时间块选择"
    },
    "Z409-2": {
      "file": "pages/publish/index.wxml",
      "parent": "B409",
      "name": "选择服务日期"
    },
    "Z409-3": {
      "file": "pages/publish/index.wxml",
      "parent": "B409",
      "name": "点选或长按时间块"
    },
    "Z409-4": {
      "file": "pages/publish/index.wxml",
      "parent": "B409",
      "name": "将选中时间加入发布"
    },
    "Z412-1": {
      "file": "pages/publish/index.wxml",
      "parent": "B412",
      "name": "编辑单条履历"
    },
    "Z412-2": {
      "file": "pages/publish/index.wxml",
      "parent": "B412",
      "name": "删除单条履历"
    },
    "Z413-1": {
      "file": "pages/publish/index.wxml",
      "parent": "B413",
      "name": "选择公共场所"
    },
    "Z414-1": {
      "file": "pages/publish/index.wxml",
      "parent": "B414",
      "name": "填写最低成团人数"
    },
    "Z414-2": {
      "file": "pages/publish/index.wxml",
      "parent": "B414",
      "name": "填写最多人数"
    },
    "Z415-1": {
      "file": "pages/publish/index.wxml",
      "parent": "B415",
      "name": "移除指定地点"
    },
    "Z415-2": {
      "file": "pages/publish/index.wxml",
      "parent": "B415",
      "name": "输入地点或小区"
    },
    "Z415-3": {
      "file": "pages/publish/index.wxml",
      "parent": "B415",
      "name": "增加指定地点"
    },
    "Z307-1": {
      "file": "pages/service/index.wxml",
      "parent": "B307",
      "name": "买家打开选时间面板"
    },
    "Z309-1": {
      "file": "pages/service/index.wxml",
      "parent": "B309",
      "name": "编辑自己的发布"
    },
    "Z309-2": {
      "file": "pages/service/index.wxml",
      "parent": "B309",
      "name": "预览买家选时间"
    },
    "Z310-1": {
      "file": "pages/service/index.wxml",
      "parent": "B310",
      "name": "关闭买家选时间面板"
    },
    "Z310-2": {
      "file": "pages/service/index.wxml",
      "parent": "B310",
      "name": "选择买家可选时段"
    },
    "Z605-2": {
      "file": "pages/me/index.wxml",
      "parent": "B605",
      "name": "打开我发布的共用详情页"
    },
    "Z405-3": {
      "file": "pages/publish/index.wxml",
      "parent": "B405",
      "name": "删除本机发布或草稿"
    },
    "Z413-2": {
      "file": "pages/publish/index.wxml",
      "parent": "B413",
      "name": "选择我提供场地"
    },
    "Z413-3": {
      "file": "pages/publish/index.wxml",
      "parent": "B413",
      "name": "选择双方协商"
    },
    "Z413-4": {
      "file": "pages/publish/index.wxml",
      "parent": "B413",
      "name": "选择指定地点"
    }
  },
  "note": "B 为可见界面状态，Z 为操作；发布分经验分享与帮人办事，B307 为买卖双方共用详情。开发者模式可点编号复制。",
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
    "Z208-3": "pages/schedule/index.wxml",
    "Z202-2": "pages/schedule/index.wxml",
    "Z213-1": "pages/schedule/index.wxml",
    "Z201-2": "pages/schedule/index.wxml",
    "Z201-3": "pages/schedule/index.wxml",
    "Z201-4": "pages/schedule/index.wxml",
    "Z201-5": "pages/schedule/index.wxml",
    "Z201-6": "pages/schedule/index.wxml",
    "Z201-7": "pages/schedule/index.wxml",
    "Z201-8": "pages/schedule/index.wxml",
    "Z201-9": "pages/schedule/index.wxml",
    "Z202-1": "pages/schedule/index.wxml",
    "B302": "原大厅服务详情弹层，改为 B307 共用详情页",
    "Z401-1": "pages/publish/index.wxml",
    "Z401-2": "pages/publish/index.wxml",
    "Z401-3": "pages/publish/index.wxml",
    "Z401-4": "pages/publish/index.wxml",
    "Z401-5": "pages/publish/index.wxml",
    "Z401-6": "pages/publish/index.wxml",
    "Z401-7": "pages/publish/index.wxml",
    "Z401-8": "pages/publish/index.wxml",
    "Z401-9": "pages/publish/index.wxml",
    "Z302-1": "pages/hall/index.wxml",
    "Z302-2": "pages/hall/index.wxml"
  }
}
