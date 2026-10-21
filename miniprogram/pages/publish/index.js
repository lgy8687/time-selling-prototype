const store = require('../../utils/store')
const { today, addDays, dateText, makeSlots, overlaps, minutes, clock } = require('../../utils/time')
const { templates, blankForm, marketCategories } = require('../../utils/service-templates')
const { viewModel } = require('../../utils/service-format')

const subcategoriesFor = name => marketCategories.find(x => x.name === name)?.subcategories || marketCategories[0].subcategories
const priceKeys = { '线上交流|一对一': 'onlineOne', '线下交流|一对一': 'offlineOne', '线上交流|开团': 'onlineGroup', '线下交流|开团': 'offlineGroup' }
const activePrices = form => (form.modes || [form.mode || '线上交流']).flatMap(mode => (form.meetings || [form.meeting || '一对一']).map(meeting => { const key = priceKeys[`${mode}|${meeting}`]; return { key, value: form.prices?.[key] || '', label: `${mode === '线上交流' ? '线上' : '线下'} · ${meeting}${meeting === '开团' ? '（每人）' : ''}` } }))
const choiceFlags = form => ({ hasOnline: form.modes.includes('线上交流'), hasOffline: form.modes.includes('线下交流'), hasOne: form.meetings.includes('一对一'), hasGroup: form.meetings.includes('开团') })
const rowsFor = (slots, from, to) => {
  const rows = []
  slots.forEach((slot, index) => {
    const hour = Math.floor(minutes(slot.start) / 60)
    if (!rows.length || rows[rows.length - 1].hour !== hour) rows.push({ hour, label: `${String(hour).padStart(2, '0')}:00`, cells: [] })
    rows[rows.length - 1].cells.push({ ...slot, index, selected: from >= 0 && index >= from && index <= to, busy: slot.type === 'reserved' || slot.type === 'blocked', flex: minutes(slot.end) - minutes(slot.start) })
  })
  return rows
}
const allFreeWindows = (form, state, editingId) => {
  const duration = Number(form.duration)
  if (!Number.isInteger(duration) || duration < 15 || duration > 480 || !form.allFrom || !form.allTo || form.allFrom > form.allTo || form.allTo > addDays(form.allFrom, 13)) return []
  const busy = state.events.filter(event => event.type !== 'open' && event.serviceId !== editingId)
  const other = state.drafts.filter(item => item.id !== editingId && item.status === 'published').flatMap(item => item.windows || [])
  const windows = []
  for (let date = form.allFrom; date <= form.allTo; date = addDays(date, 1)) {
    for (let start = state.settings.startHour * 60; start + duration <= state.settings.endHour * 60; start += duration) {
      const candidate = { date, start: clock(start), end: clock(start + duration) }
      if (new Date(`${date}T${candidate.start}:00`).getTime() <= Date.now()) continue
      if (busy.some(event => overlaps(candidate, event)) || other.some(window => overlaps(candidate, window))) continue
      windows.push({ ...candidate, id: store.uid() })
    }
  }
  return windows
}

Page({
  data: {
    kind: '', stage: 'start', form: blankForm('experience'), editingId: '', developerMode: false, error: '',
    marketCategories, subcategories: subcategoriesFor('知识付费'), categoryIndex: 0, priceRows: [], hasOnline: true, hasOffline: false, hasOne: true, hasGroup: false, templates, ownTemplates: [], templatePanel: '', templateNameOpen: false, templateName: '',
    requestForm: { title: '', category: '知识付费', subcategory: '职业经验', detail: '', budget: '', date: today() }, requests: [], requestCategoryIndex: 0, requestSubcategoryIndex: 0, requestSubcategories: subcategoriesFor('知识付费'),
    locationInput: '', timePicker: false, timeChoice: false, pickerDate: today(), todayKey: today(), pickerRows: [], pickerSlots: [], pickerFrom: -1, pickerTo: -1,
    rangeStart: -1, rangeEnd: -1, pickerSummary: '', listings: []
  },
  onLoad(options) {
    if (options.kind === 'experience' || options.kind === 'errand') this.startCategory({ currentTarget: { dataset: { category: options.kind === 'errand' ? '跑腿代办' : '知识付费' } } })
  },
  onShow() {
    const state = store.read()
    this.getTabBar().setData({ selected: 2, developerMode: Boolean(state.settings.developerMode) })
    const editId = getApp().globalData.editServiceId
    if (editId) {
      getApp().globalData.editServiceId = ''
      const item = state.drafts.find(x => x.id === editId)
      if (item) this.loadItem(item)
    }
    this.refresh()
    if (getApp().globalData.openPublishHome && !editId) { this.showPublishHome(); getApp().globalData.openPublishHome = false }
  },
  refresh() {
    const state = store.read()
    this.setData({
      developerMode: Boolean(state.settings.developerMode),
      listings: state.drafts.map(item => viewModel(item, state.profile, true)).reverse(), requests: (state.requests || []).slice().reverse(),
      ownTemplates: state.serviceTemplates || []
    })
  },
  start(e) {
    this.setData({ stage: e.currentTarget.dataset.stage, kind: '', error: '' })
    wx.pageScrollTo({ scrollTop: 0, duration: 0 })
  },
  startCategory(e) {
    const marketCategory = e.currentTarget.dataset.category
    const choice = marketCategories.find(x => x.name === marketCategory)
    if (!choice) return
    const form = blankForm(choice.kind, marketCategory)
    this.setData({ stage: 'form', kind: choice.kind, form, editingId: '', error: '', subcategories: choice.subcategories, categoryIndex: 0, priceRows: activePrices(form), ...choiceFlags(form) })
    wx.pageScrollTo({ scrollTop: 0, duration: 0 })
  },
  back() { this.setData({ stage: this.data.editingId ? 'start' : 'sell', kind: '', editingId: '', error: '' }); wx.pageScrollTo({ scrollTop: 0, duration: 0 }) },
  backStart() { this.showPublishHome() },
  loadItem(item) {
    const kind = item.kind || 'experience'
    const marketCategory = item.marketCategory || (kind === 'errand' ? '跑腿代办' : item.category === '技能教学' ? '职业技能' : '知识付费')
    const form = {
      ...blankForm(kind, marketCategory), ...item,
      title: item.title || item.name || '', offer: item.offer || item.description || '',
      resume: Array.isArray(item.resume) && item.resume.length ? [...item.resume] : [''],
      locations: Array.isArray(item.locations) ? item.locations : [],
      windows: Array.isArray(item.windows) ? item.windows : [],
      modes: item.modes || (item.mode === '线上＋线下' ? ['线上交流', '线下交流'] : [item.mode || '线上交流']), meetings: item.meetings || [item.meeting || '一对一'],
      prices: item.prices || { onlineOne: item.price || '', offlineOne: item.price || '', onlineGroup: item.price || '', offlineGroup: item.price || '' }
    }
    form.marketCategory = marketCategory
    const subcategories = subcategoriesFor(form.marketCategory)
    if (!subcategories.includes(form.category)) form.category = kind === 'errand' ? '其他代办' : marketCategory === '职业技能' ? '私教课程' : subcategories[0]
    this.setData({ stage: 'form', kind, form, editingId: item.id, error: '', subcategories, categoryIndex: Math.max(0, subcategories.indexOf(form.category)), priceRows: activePrices(form), ...choiceFlags(form) })
    wx.pageScrollTo({ scrollTop: 0, duration: 0 })
  },
  editFromList(e) {
    const item = store.read().drafts.find(x => x.id === e.currentTarget.dataset.id)
    if (item) this.loadItem(item)
  },
  previewFromList(e) { wx.navigateTo({ url: `/pages/service/index?id=${e.currentTarget.dataset.id}` }) },
  removeFromList(e) {
    const id = e.currentTarget.dataset.id
    if ((store.read().orders || []).some(order => order.serviceId === id && ['pending', 'confirmed'].includes(order.status))) return wx.showToast({ title: '有预约记录，请先下架或处理预约', icon: 'none' })
    wx.showModal({ title: '删除这条发布？', content: '这条本机发布会删除。', success: result => {
      if (!result.confirm) return
      try {
        store.update(state => ({ ...state, drafts: state.drafts.filter(item => item.id !== id), events: state.events.filter(event => event.serviceId !== id || event.source === 'order') }))
        this.refresh()
      } catch (error) { wx.showToast({ title: '删除失败', icon: 'none' }) }
    } })
  },
  field(e) { this.setData({ [`form.${e.currentTarget.dataset.field}`]: e.detail.value, error: '' }) },
  category(e) { const i = Number(e.detail.value); this.setData({ categoryIndex: i, 'form.category': this.data.subcategories[i] }) },
  choose(e) { this.setData({ [`form.${e.currentTarget.dataset.field}`]: e.currentTarget.dataset.value, error: '' }) },
  showPublishHome() { this.setData({ stage: 'start', kind: '', error: '' }); wx.pageScrollTo({ scrollTop: 0, duration: 0 }) },
  chooseMode(e) {
    const value = e.currentTarget.dataset.value
    const modes = value === '线上＋线下' ? ['线上交流', '线下交流'] : [value]
    const form = { ...this.data.form, modes, mode: value }
    this.setData({ form, priceRows: activePrices(form), ...choiceFlags(form), error: '' })
  },
  toggleChoice(e) {
    const field = e.currentTarget.dataset.field, value = e.currentTarget.dataset.value
    const current = this.data.form[field] || []
    const next = current.includes(value) ? current.filter(x => x !== value) : [...current, value]
    if (!next.length) return wx.showToast({ title: '至少选择一项', icon: 'none' })
    const form = { ...this.data.form, [field]: next }
    this.setData({ form, priceRows: activePrices(form), ...choiceFlags(form), error: '' })
  },
  priceField(e) {
    const key = e.currentTarget.dataset.key, value = e.detail.value
    this.setData({ [`form.prices.${key}`]: value, priceRows: this.data.priceRows.map(row => row.key === key ? { ...row, value } : row), error: '' })
  },
  resumeInput(e) { this.setData({ [`form.resume[${e.currentTarget.dataset.index}]`]: e.detail.value, error: '' }) },
  addResume() { this.setData({ 'form.resume': [...this.data.form.resume, ''] }) },
  removeResume(e) {
    this.setData({ 'form.resume': this.data.form.resume.filter((_, i) => i !== Number(e.currentTarget.dataset.index)) })
  },
  locationInput(e) { this.setData({ locationInput: e.detail.value }) },
  addLocation() {
    const value = this.data.locationInput.trim()
    if (!value) return wx.showToast({ title: '先输入地点或小区', icon: 'none' })
    if (this.data.form.locations.includes(value)) return wx.showToast({ title: '地点已添加', icon: 'none' })
    this.setData({ 'form.locations': [...this.data.form.locations, value], locationInput: '' })
  },
  removeLocation(e) { this.setData({ 'form.locations': this.data.form.locations.filter((_, i) => i !== Number(e.currentTarget.dataset.index)) }) },
  openTemplates(e) { this.setData({ templatePanel: e.currentTarget.dataset.target }) },
  closeTemplates() { this.setData({ templatePanel: '' }) },
  applyTemplate(e) {
    const template = [...templates, ...this.data.ownTemplates].find(x => x.id === e.currentTarget.dataset.id)
    if (!template) return
    const target = this.data.templatePanel
    const patch = {}
    if (target === 'offer' || target === 'whole') patch['form.offer'] = template.offer
    if (target === 'resume' || target === 'whole') patch['form.resume'] = [...template.resume]
    if (target === 'whole') {
      patch['form.title'] = template.title
      if (template.marketCategory === this.data.form.marketCategory) patch['form.category'] = template.category
      patch['form.price'] = template.price || ''
      patch['form.prices'] = { onlineOne: template.price || '', offlineOne: template.price || '', onlineGroup: template.price || '', offlineGroup: template.price || '' }
      patch['form.duration'] = template.duration || '60'
      patch.categoryIndex = Math.max(0, this.data.subcategories.indexOf(template.category))
    }
    patch.templatePanel = ''
    this.setData(patch)
    if (target === 'whole') this.setData({ priceRows: activePrices(this.data.form) })
    wx.showToast({ title: '模板已填入，可继续修改', icon: 'none' })
  },
  openSaveTemplate() { this.setData({ templateNameOpen: true, templateName: '' }) },
  closeSaveTemplate() { this.setData({ templateNameOpen: false }) },
  templateNameInput(e) { this.setData({ templateName: e.detail.value }) },
  saveTemplate() {
    const name = this.data.templateName.trim()
    if (!name) return wx.showToast({ title: '请填写模板名称', icon: 'none' })
    const form = this.data.form
    if (!form.offer.trim()) return wx.showToast({ title: '先填写服务内容', icon: 'none' })
    const template = { id: store.uid(), name, kind: form.kind, marketCategory: form.marketCategory, title: form.title, category: form.category, offer: form.offer, resume: form.resume.filter(x => x.trim()), price: form.price, duration: form.duration }
    try {
      store.update(state => ({ ...state, serviceTemplates: [...(state.serviceTemplates || []), template] }))
      this.setData({ templateNameOpen: false, templateName: '' })
      this.refresh()
      wx.showToast({ title: '模板已保存', icon: 'success' })
    } catch (error) { wx.showToast({ title: '模板保存失败', icon: 'none' }) }
  },
  openTimeChoice() { this.setData({ timeChoice: true }) },
  closeTimeChoice() { this.setData({ timeChoice: false }) },
  chooseAllFree() { this.setData({ timeChoice: false, 'form.availabilityMode': 'all', 'form.allFrom': this.data.form.allFrom || today(), 'form.allTo': this.data.form.allTo || addDays(today(), 6), error: '' }) },
  chooseSelectedTime() { this.setData({ timeChoice: false, 'form.availabilityMode': 'selected', error: '' }); this.openTimePicker() },
  openTimePicker() {
    const date = this.data.form.windows[0]?.date || today()
    this.setData({ timePicker: true, pickerDate: date, pickerFrom: -1, pickerTo: -1, rangeStart: -1, rangeEnd: -1, pickerSummary: '' })
    this.refreshPicker(date, -1, -1)
  },
  closeTimePicker() { this.clearHold(); this.setData({ timePicker: false }) },
  pickerDateChange(e) {
    const date = e.detail.value
    this.setData({ pickerDate: date, rangeStart: -1, rangeEnd: -1 })
    this.refreshPicker(date, -1, -1)
  },
  refreshPicker(date, from, to) {
    const state = store.read()
    const slots = makeSlots(date, state.settings.startHour, state.settings.endHour, state.settings.mode, state.events.filter(x => x.serviceId !== this.data.editingId))
    const summary = from >= 0 ? `${dateText(date)} ${slots[from].start}—${slots[to].end}` : ''
    this.setData({ pickerSlots: slots, pickerRows: rowsFor(slots, from, to), pickerFrom: from, pickerTo: to, pickerSummary: summary })
  },
  selectPickerCell(e) {
    if (this.heldCell) { this.heldCell = false; return }
    const index = Number(e.currentTarget.dataset.index)
    const slots = this.data.pickerSlots
    if (slots[index]?.type === 'reserved' || slots[index]?.type === 'blocked') return wx.showToast({ title: '这段时间已占用', icon: 'none' })
    let { pickerFrom: from, pickerTo: to } = this.data
    if (from < 0) { from = index; to = index }
    else if (from === to && index === from) { from = -1; to = -1 }
    else if (index === from) from += 1
    else if (index === to) to -= 1
    else if (index === from - 1) from = index
    else if (index === to + 1) to = index
    else return wx.showToast({ title: '请连续选格；长按可定起止', icon: 'none' })
    this.setData({ rangeStart: -1, rangeEnd: -1 })
    this.refreshPicker(this.data.pickerDate, from, to)
  },
  holdStart(e) {
    const index = Number(e.currentTarget.dataset.index)
    this.clearHold()
    this.heldCell = false
    this.holdTimer = setTimeout(() => this.markRange(index), 2000)
  },
  holdEnd() { this.clearHold() },
  clearHold() { if (this.holdTimer) clearTimeout(this.holdTimer); this.holdTimer = null },
  markRange(index) {
    const slots = this.data.pickerSlots
    if (!slots[index] || ['reserved', 'blocked'].includes(slots[index].type)) return wx.showToast({ title: '已占用时间不能选', icon: 'none' })
    this.heldCell = true
    if (this.data.rangeStart < 0 || this.data.rangeEnd >= 0) {
      this.setData({ rangeStart: index, rangeEnd: -1 })
      this.refreshPicker(this.data.pickerDate, index, index)
      wx.vibrateShort({ type: 'light' })
      return
    }
    const from = Math.min(this.data.rangeStart, index), to = Math.max(this.data.rangeStart, index)
    if (slots.slice(from, to + 1).some(x => x.type === 'reserved' || x.type === 'blocked')) return wx.showToast({ title: '区间内有已占用时间', icon: 'none' })
    this.setData({ rangeStart: from, rangeEnd: to })
    this.refreshPicker(this.data.pickerDate, from, to)
    wx.vibrateShort({ type: 'light' })
  },
  addWindow() {
    const { pickerFrom: from, pickerTo: to, pickerDate: date, pickerSlots: slots } = this.data
    if (from < 0) return wx.showToast({ title: '先选择时间块', icon: 'none' })
    const window = { id: store.uid(), date, start: slots[from].start, end: slots[to].end }
    if (new Date(`${date}T${window.start}:00`).getTime() <= Date.now()) return wx.showToast({ title: '请选择未来的时间', icon: 'none' })
    if (this.data.form.windows.some(w => overlaps(w, window))) return wx.showToast({ title: '已添加重叠的时间', icon: 'none' })
    this.setData({ 'form.windows': [...this.data.form.windows, window], timePicker: false, error: '' })
  },
  removeWindow(e) { this.setData({ 'form.windows': this.data.form.windows.filter((_, i) => i !== Number(e.currentTarget.dataset.index)) }) },
  saveDraft() { this.save('draft') },
  publish() { this.save('published') },
  save(status) {
    const form = this.data.form
    const state = store.read()
    if (form.availabilityMode === 'all' && (form.allFrom > form.allTo || form.allTo > addDays(form.allFrom, 13))) return this.setData({ error: '全部空闲时间最多选择连续 14 天，请检查日期。' })
    const previous = state.drafts.find(item => item.id === this.data.editingId)
    const rawWindows = form.availabilityMode === 'all' ? allFreeWindows(form, state, this.data.editingId) : form.windows
    const effectiveWindows = rawWindows.map(window => ({ ...window, id: (previous?.windows || []).find(old => old.date === window.date && old.start === window.start && old.end === window.end)?.id || window.id }))
    if ((state.orders || []).some(order => order.serviceId === this.data.editingId && ['pending', 'confirmed'].includes(order.status) && !effectiveWindows.some(window => window.id === order.windowId))) return this.setData({ error: '已有预约的时间不能从发布中删除；请先处理预约。' })
    const title = form.title.trim()
    const offer = form.offer.trim()
    if (!title) return this.setData({ error: '请填写服务名称。' })
    if (status === 'published') {
      if (!offer) return this.setData({ error: '请填写“我能提供什么”。' })
      if (form.resume.some(x => /【|】/.test(x))) return this.setData({ error: '请把履历模板里的待填写内容改成自己的真实经历。' })
      if (!effectiveWindows.length) return this.setData({ error: '所选范围没有可售时间，请调整日期或时间表。' })
      if (effectiveWindows.some(w => new Date(`${w.date}T${w.end}:00`).getTime() <= Date.now())) return this.setData({ error: '可服务时间已过期，请重新选择未来的时间。' })
      if ((form.kind === 'errand' && form.scope === '指定地点' || form.kind === 'experience' && form.modes.includes('线下交流') && form.venue === '指定地点') && !form.locations.length) return this.setData({ error: '请添加至少一个服务地点。' })
      if (form.kind === 'errand' && form.scope === '全城' && !form.city.trim()) return this.setData({ error: '请填写实际服务的城市。' })
    }
    const chargeRows = form.kind === 'experience' ? activePrices(form) : []
    const charges = chargeRows.map(row => Number(form.prices?.[row.key]))
    const price = form.kind === 'experience' ? Math.min(...charges) : Number(form.price)
    if (status === 'published' && form.kind === 'experience' && chargeRows.some(row => form.prices?.[row.key] === '' || !Number.isFinite(Number(form.prices?.[row.key])) || Number(form.prices?.[row.key]) < 0 || Number(form.prices?.[row.key]) > 99999)) return this.setData({ error: '请填写每种已选方式的价格（0—99999 元）。' })
    if (status === 'published' && form.kind === 'errand' && (!Number.isFinite(price) || price < 0 || price > 99999 || form.price === '')) return this.setData({ error: '价格请填 0—99999 元。' })
    const duration = Number(form.duration)
    if (status === 'published' && (!Number.isInteger(duration) || duration < 15 || duration > 480)) return this.setData({ error: '时长请填 15—480 分钟。' })
    const capacity = Number(form.capacity), minPeople = Number(form.minPeople), maxPeople = Number(form.maxPeople)
    if (status === 'published' && form.kind === 'errand' && (!Number.isInteger(capacity) || capacity < 1 || capacity > 99)) return this.setData({ error: '每时段接单上限请填 1—99。' })
    if (status === 'published' && form.kind === 'experience' && form.meetings.includes('开团') && (!Number.isInteger(minPeople) || !Number.isInteger(maxPeople) || minPeople < 3 || maxPeople < minPeople)) return this.setData({ error: '开团人数至少 3 人，最多人数不能低于成团人数。' })
    const id = this.data.editingId || store.uid()
    if (status === 'published') {
      const busy = state.events.filter(e => e.type !== 'open' && e.serviceId !== id)
      if (effectiveWindows.some(w => busy.some(e => overlaps(w, e)))) return this.setData({ error: '所选时间与现有安排冲突，请重新选择。' })
      const other = state.drafts.filter(x => x.id !== id && x.status === 'published')
      if (effectiveWindows.some(w => other.some(x => (x.windows || []).some(ow => overlaps(w, ow))))) return this.setData({ error: '所选时间已有另一项本机发布，请重新选择。' })
    }
    const item = {
      ...form, id, title, offer, resume: form.resume.map(x => x.trim()).filter(Boolean),
      locations: [...form.locations], windows: [...effectiveWindows],
      price: status === 'published' ? price : form.price, duration: status === 'published' ? duration : form.duration,
      status, updatedAt: Date.now()
    }
    try {
      const events = state.events.filter(e => e.serviceId !== id || e.source === 'order')
      // Listing windows live on the service. A free time block is not itself a calendar event.
      store.write({ ...state, events, drafts: [...state.drafts.filter(x => x.id !== id), item] })
      this.setData({ stage: 'start', kind: '', editingId: '', error: '' })
      this.refresh()
      wx.navigateTo({ url: `/pages/service/index?id=${id}` })
    } catch (error) { this.setData({ error: '保存失败，请检查手机存储空间后重试。' }) }
  },
  requestField(e) { this.setData({ [`requestForm.${e.currentTarget.dataset.field}`]: e.detail.value, error: '' }) },
  requestCategory(e) {
    const choice = marketCategories[Number(e.detail.value)]
    this.setData({ requestCategoryIndex: Number(e.detail.value), requestSubcategoryIndex: 0, requestSubcategories: choice.subcategories, 'requestForm.category': choice.name, 'requestForm.subcategory': choice.subcategories[0] })
  },
  requestSubcategory(e) {
    const value = Number(e.detail.value)
    this.setData({ requestSubcategoryIndex: value, 'requestForm.subcategory': subcategoriesFor(this.data.requestForm.category)[value] })
  },
  saveRequest() {
    const form = this.data.requestForm
    if (!form.title.trim() || !form.detail.trim()) return this.setData({ error: '请填写求购标题和具体需求。' })
    const budget = Number(form.budget)
    if (form.budget !== '' && (!Number.isFinite(budget) || budget < 0 || budget > 99999)) return this.setData({ error: '预算请填 0—99999 元，或留空。' })
    try {
      store.update(state => ({ ...state, requests: [...(state.requests || []), { ...form, id: store.uid(), status: 'local', createdAt: Date.now() }] }))
      this.setData({ stage: 'start', error: '', requestCategoryIndex: 0, requestSubcategoryIndex: 0, requestSubcategories: subcategoriesFor('知识付费'), requestForm: { title: '', category: '知识付费', subcategory: '职业经验', detail: '', budget: '', date: today() } })
      this.refresh()
      wx.showToast({ title: '求购已存本机', icon: 'success' })
      wx.pageScrollTo({ scrollTop: 0, duration: 0 })
    } catch (error) { this.setData({ error: '保存失败，请检查手机存储空间。' }) }
  }
})
