const { today, addDays } = require('./time')

const sampleWindow = (day, start, end, id) => ({ id, date: addDays(today(), day), start, end })

module.exports = [
  {
    id: 'demo-1', kind: 'experience', marketCategory: '知识付费', category: '职业经验', name: '网约车入行避坑交流', host: '资深司机 · 示例', avatar: '车', price: 99, duration: 60, mode: '线上交流', meeting: '一对一', description: '从平台选择、接单节奏到成本核算，先弄清楚实际工作是什么样。', tone: 'peach',
    resume: ['示例：说明实际从业的城市与年限。', '示例：说明接触过的平台与车型。', '示例：说明能交流的运营经验与真实案例。'],
    windows: [sampleWindow(4, '10:00', '11:00', 'demo-1-w1'), sampleWindow(5, '16:00', '17:00', 'demo-1-w2')]
  },
  {
    id: 'demo-2', kind: 'experience', marketCategory: '知识付费', category: '开店经营', name: '一家小店的经营复盘', host: '实体店主 · 示例', avatar: '店', price: 168, duration: 60, mode: '线上交流', meeting: '一对一', description: '聊选址、日常运营和开店前很难意识到的细节。', tone: 'mint',
    resume: ['示例：说明店铺类型和经营时间。', '示例：说明熟悉的选址与运营环节。', '示例：说明可以分享的经营复盘案例。'],
    windows: [sampleWindow(4, '14:00', '15:00', 'demo-2-w1')]
  },
  {
    id: 'demo-3', kind: 'experience', marketCategory: '知识付费', category: '内容创作', name: '从零开始做内容账号', host: '内容创作者 · 示例', avatar: '创', price: 128, duration: 45, mode: '线上交流', meeting: '一对一', description: '把定位、选题与发布节奏拆开，看看什么适合你。', tone: 'lilac',
    resume: ['示例：说明实际运营过的内容平台。', '示例：说明熟悉的选题和制作流程。', '示例：说明可展示的账号经验。'],
    windows: [sampleWindow(5, '10:00', '11:00', 'demo-3-w1')]
  },
  {
    id: 'demo-4', kind: 'experience', marketCategory: '职业技能', category: '摄影教学', name: '摄影基础一对一', host: '摄影老师 · 示例', avatar: '影', price: 120, duration: 60, mode: '线上交流', meeting: '一对一', description: '从构图到用光，按你的设备和当前水平安排交流。', tone: 'blue',
    resume: ['示例：说明学习或教学摄影的经历。', '示例：说明熟悉的摄影题材与设备。', '示例：说明曾帮助学员解决的问题。'],
    windows: [sampleWindow(6, '14:00', '15:00', 'demo-4-w1')]
  },
  {
    id: 'demo-5', kind: 'errand', marketCategory: '跑腿代办', category: '宠物照看', name: '帮忙遛狗', host: '社区服务者 · 示例', avatar: '遛', price: 35, duration: 60, mode: '约定具体时段', timeMode: 'exact', scope: '指定地点', locations: ['示例小区'], capacity: 2, description: '按约定路线带狗狗外出，结束后反馈完成情况。', tone: 'mint',
    resume: ['示例：说明照顾宠物的实际经历。', '示例：说明熟悉的犬只体型和牵引方式。', '示例：说明可覆盖的小区与服务时间。'],
    windows: [sampleWindow(6, '17:00', '18:00', 'demo-5-w1')]
  },
  {
    id: 'demo-6', kind: 'experience', marketCategory: '职业技能', category: '私教课程', name: '跆拳道基础训练', host: '技能老师 · 示例', avatar: '道', price: 120, duration: 60, mode: '线下交流', venue: '指定地点', locations: ['示例训练场地'], meeting: '一对一', description: '为入门学员安排基础动作、礼仪和体能练习。', tone: 'peach',
    resume: ['示例：说明学习和教学的真实年限。', '示例：说明适合指导的学员年龄与基础。', '示例：说明可核实的证书或培训经历。'],
    windows: [sampleWindow(7, '10:00', '11:00', 'demo-6-w1')]
  },
  {
    id: 'demo-7', kind: 'experience', marketCategory: '情绪价值', category: '线上陪聊', name: '聊聊换工作时的心情', host: '交流伙伴 · 示例', avatar: '伴', price: 60, duration: 60, mode: '线上交流', meeting: '一对一', description: '在约定时间里倾听并交流近况、兴趣和生活选择。', tone: 'lilac',
    resume: ['示例：写清楚擅长交流的话题与自身经历。'],
    windows: [sampleWindow(5, '19:00', '20:00', 'demo-7-w1')]
  }
]
