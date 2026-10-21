const templates = [
  {
    id: 'ridehail', name: '网约车经验分享', kind: 'experience', category: '职业经验', title: '网约车入行经验交流',
    offer: '帮助准备入行的人梳理平台选择、接单节奏、成本核算和日常工作中容易忽略的问题。可根据你的城市和车型，交流实际遇到的困惑。',
    resume: [
      '网约车从业【填写年限】年，主要在【填写城市】运营。',
      '熟悉【填写平台或车型】的接单流程与日常成本。',
      '积累了【填写具体经历】方面的经验，可结合真实案例交流。'
    ], price: '99', duration: '60'
  },
  {
    id: 'dogwalk', name: '遛狗服务', kind: 'errand', category: '生活帮办', title: '帮忙遛狗',
    offer: '按约定时段带狗狗外出活动，遵照主人提供的牵引、路线和注意事项；结束后反馈实际完成情况。',
    resume: [
      '有【填写年限】的遛狗或照顾宠物经历。',
      '熟悉【填写犬只体型或性格】的牵引与外出注意事项。',
      '可说明【填写可核实的相关经历或服务区域】。'
    ], price: '35', duration: '60'
  },
  {
    id: 'taekwondo', name: '跆拳道培训', kind: 'experience', category: '技能教学', title: '跆拳道基础训练',
    offer: '面向入门学员安排基础动作、礼仪和体能练习；根据学员年龄与基础调整训练内容和节奏。',
    resume: [
      '有【填写年限】的跆拳道学习或教学经历。',
      '曾带领【填写适合的年龄或基础】学员进行基础训练。',
      '持有【如有则填写可核实的证书或培训经历；没有请改写】。'
    ], price: '120', duration: '60'
  }
]

const blankForm = kind => ({
  kind, title: '', category: kind === 'experience' ? '职业经验' : '生活帮办', offer: '', resume: ['', '', ''],
  mode: '线上交流', venue: '公共场所', meeting: '一对一', minPeople: '3', maxPeople: '6',
  locations: [], scope: '指定地点', city: '', timeMode: 'exact', windows: [], capacity: '1',
  price: '', priceUnit: kind === 'experience' ? '按次' : '按次', duration: '60'
})

module.exports = { templates, blankForm }
