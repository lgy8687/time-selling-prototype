const templates = [
  {
    id: 'ridehail', name: '网约车经验分享', kind: 'experience', marketCategory: '知识付费', category: '职业经验', title: '网约车入行经验交流',
    offer: '帮助准备入行的人梳理平台选择、接单节奏、成本核算和日常工作中容易忽略的问题。可根据你的城市和车型，交流实际遇到的困惑。',
    resume: [
      '网约车从业【填写年限】年，主要在【填写城市】运营。',
      '熟悉【填写平台或车型】的接单流程与日常成本。',
      '积累了【填写具体经历】方面的经验，可结合真实案例交流。'
    ], price: '99', duration: '60'
  },
  {
    id: 'dogwalk', name: '遛狗服务', kind: 'errand', marketCategory: '跑腿代办', category: '宠物照看', title: '帮忙遛狗',
    offer: '按约定时段带狗狗外出活动，遵照主人提供的牵引、路线和注意事项；结束后反馈实际完成情况。',
    resume: [
      '有【填写年限】的遛狗或照顾宠物经历。',
      '熟悉【填写犬只体型或性格】的牵引与外出注意事项。',
      '可说明【填写可核实的相关经历或服务区域】。'
    ], price: '35', duration: '60'
  },
  {
    id: 'taekwondo', name: '跆拳道培训', kind: 'experience', marketCategory: '职业技能', category: '私教课程', title: '跆拳道基础训练',
    offer: '面向入门学员安排基础动作、礼仪和体能练习；根据学员年龄与基础调整训练内容和节奏。',
    resume: [
      '有【填写年限】的跆拳道学习或教学经历。',
      '曾带领【填写适合的年龄或基础】学员进行基础训练。',
      '持有【如有则填写可核实的证书或培训经历；没有请改写】。'
    ], price: '120', duration: '60'
  },
  {
    id: 'companion', name: '陪聊交流', kind: 'experience', marketCategory: '情绪价值', category: '线上陪聊', title: '一小时轻松交流',
    offer: '在约定时间内倾听和交流日常话题。请在发布前写清楚可聊的主题、交流边界与方式。',
    resume: ['【填写自己愿意分享的经历或擅长的话题】'], price: '60', duration: '60'
  }
]

const marketCategories = [
  { name: '知识付费', kind: 'experience', icon: '知', description: '职业经验、开店心得、专业咨询', subcategories: ['职业经验', '开店经营', '内容创作', '专业咨询'] },
  { name: '跑腿代办', kind: 'errand', icon: '办', description: '遛狗、代取、同城生活帮办', subcategories: ['宠物照看', '同城跑腿', '家务代办', '其他代办'] },
  { name: '职业技能', kind: 'experience', icon: '技', description: '私教、家教、钢琴、绘画、书写', subcategories: ['私教课程', '学科家教', '钢琴与音乐', '绘画教学', '书写教学', '摄影教学', '其他技能'] },
  { name: '情绪价值', kind: 'experience', icon: '伴', description: '陪聊、一起用餐、一起观影', subcategories: ['线上陪聊', '线下陪伴', '一起用餐', '一起观影'] }
]
const blankForm = (kind, marketCategory = kind === 'errand' ? '跑腿代办' : '知识付费') => ({
  kind, marketCategory, title: '', category: marketCategories.find(x => x.name === marketCategory)?.subcategories[0] || '职业经验', offer: '', resume: [''],
  mode: '线上交流', modes: ['线上交流'], venue: '公共场所', meeting: '一对一', meetings: ['一对一'], prices: { onlineOne: '', offlineOne: '', onlineGroup: '', offlineGroup: '' }, minPeople: '3', maxPeople: '6',
  locations: [], scope: '指定地点', city: '', timeMode: 'exact', windows: [], capacity: '1',
  price: '', priceUnit: kind === 'experience' ? '按次' : '按次', duration: '60'
})

module.exports = { templates, blankForm, marketCategories }
