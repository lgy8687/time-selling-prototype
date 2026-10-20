# 时间售卖 · 产品框架原型

在线访问：<https://lgy8687.github.io/time-selling-prototype/>  
当前版本：**v0.3.0**

微信小程序本地演示版 `v0.1.0-mini` 位于 [`miniprogram/`](miniprogram/README.md)。可导入微信开发者工具，先体验原生时间表、五个入口和本机草稿；网页原型与小程序演示版分别保存数据。

移动端采用五个入口：**大厅、时间表、发布、消息、我的**，发布位于中间。“我的”按个人资料、广告横幅与活动数据、我的交易、常用工具四区组织；昵称和头像可在本机修改。时间表仍支持周 / 日 / 月视图，新增已安排、私人占用和开放时段，模拟客户提交预约意向，确认后更新同一份时间表。

## 可操作范围

| 功能 | 当前状态 |
| --- | --- |
| 大厅 | 可搜索、筛选并查看示例服务详情；尚无真实卖家和交易 |
| 发布 | 可填写服务信息、预览并保存本机草稿；尚不能公开上架 |
| 消息 | 有会话结构与示例内容；尚无真实收发 |
| 我的 | 同一账户的买入 / 卖出入口、个人资料编辑、客服帮助说明和常用工具；买入暂无真实订单，卖出可看本机预约意向 |
| 时间表 | 可添加、修改、删除时间安排；检查同一人的时间冲突；主动开放时段；模拟预约意向和确认 |

浏览器记录保存在 localStorage 中。v0.1.0 的时间安排与预约意向会自动读取并保存到新版数据格式；原记录不会被删除。旧版源文件保留在 [`archive/time-management-v0.1.0.html`](archive/time-management-v0.1.0.html)。

## 开源借鉴

- **实际使用：** [React](https://github.com/facebook/react) 负责组件与状态；[FullCalendar](https://github.com/fullcalendar/fullcalendar) 负责日历周 / 日 / 月视图和时间拖选；[Lucide](https://github.com/lucide-icons/lucide) 提供图标。日历交互直接建立在 FullCalendar 上，避免自己重写日历引擎。
- **业务规则参考：** [Cal.diy](https://github.com/calcom/cal.diy) 的个人可用时间与预约冲突计算；[Mercur](https://github.com/mercurjs/mercur) 的独立个人卖家、发布与市场分层；[RSC-Labs Medusa Booking System](https://github.com/RSC-Labs/medusa-booking-system) 的预约资源和时段分配模型。当前没有把这些项目的后端代码拼接进原型。
- **保留判断：** [框架与开源借鉴说明](架构与开源借鉴.md) 记录为什么先做一个人的时间轴、为什么公开大厅需要独立交易层，以及哪些问题必须在真实开发时处理。

## 本地运行

需要 Node.js 22。执行 `npm ci`、`npm run dev`。打包执行 `npm run build`，产物进入 `docs/`。GitHub Pages 从 `main/docs` 发布，因此每次更新源码后需重新构建并提交 `docs/` 产物。

## 原型边界

这是公开可访问的演示界面，**没有真实账户、跨设备数据同步、支付、真实消息或服务端防重**。不同设备打开同一个网址，看到的是各自浏览器的本机记录。请勿在演示表单里填写真实客户的联系方式或敏感资料。页面底部显示当前版本，交互编码见 [交互编码.md](交互编码.md)。
