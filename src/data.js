export const APP_VERSION = "v0.3.0";
export const STORAGE_KEY = "time-sale-prototype-v2";
const LEGACY_KEY = "time-sale-prototype-v1";

export const categories = [
  "全部",
  "技能教学",
  "职业经验",
  "开店经营",
  "内容创作",
  "专业咨询",
];

export const showcase = [
  {
    id: "demo-1",
    category: "职业经验",
    name: "网约车入行避坑交流",
    host: "资深司机 · 示例",
    avatar: "车",
    color: "peach",
    price: 99,
    duration: 60,
    mode: "线上交流",
    description: "从平台选择、接单节奏到成本核算，先弄清楚实际工作是什么样。",
    tags: ["真实经历", "新手入行"],
  },
  {
    id: "demo-2",
    category: "开店经营",
    name: "一家小店的经营复盘",
    host: "实体店主 · 示例",
    avatar: "店",
    color: "mint",
    price: 168,
    duration: 60,
    mode: "线上交流",
    description: "聊选址、日常运营和那些开店前很难意识到的细节。",
    tags: ["经营复盘", "一对一"],
  },
  {
    id: "demo-3",
    category: "内容创作",
    name: "从零开始做内容账号",
    host: "内容创作者 · 示例",
    avatar: "创",
    color: "lilac",
    price: 128,
    duration: 45,
    mode: "线上交流",
    description: "把定位、选题与发布节奏拆开，看看什么适合你。",
    tags: ["账号起步", "经验分享"],
  },
  {
    id: "demo-4",
    category: "技能教学",
    name: "摄影基础一对一",
    host: "摄影老师 · 示例",
    avatar: "影",
    color: "blue",
    price: 120,
    duration: 60,
    mode: "线上 / 线下",
    description: "从构图到用光，按你的设备和当前水平安排交流。",
    tags: ["摄影", "可预约"],
  },
];

export const sampleThreads = [
  {
    id: "sample-1",
    name: "预约沟通示例",
    avatar: "约",
    subtitle: "这里展示客户和时间提供者的沟通过程",
    time: "示例",
    messages: [
      { from: "other", text: "你好，我想了解周六下午有没有时间交流。" },
      {
        from: "me",
        text: "你可以先在我的开放时间里选择一段，我确认后再约定交流方式。",
      },
    ],
  },
  {
    id: "sample-2",
    name: "订单通知示例",
    avatar: "通",
    subtitle: "预约确认、改期和取消会集中到这里",
    time: "示例",
    messages: [
      {
        from: "system",
        text: "当真实交易和通知功能接入后，这里会展示与你有关的进展。",
      },
    ],
  },
];

export const pad = (n) => String(n).padStart(2, "0");
export const dateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
export const parseDay = (value) => {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const addDays = (value, count) => {
  const day = parseDay(value);
  day.setDate(day.getDate() + count);
  return dateKey(day);
};
export const weekStart = (date = new Date()) => {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  day.setDate(day.getDate() - ((day.getDay() + 6) % 7));
  return dateKey(day);
};
export const uid = () =>
  globalThis.crypto?.randomUUID?.() ||
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const dateLabel = (value) => {
  const day = parseDay(value);
  return `${day.getMonth() + 1}月${day.getDate()}日 · ${["周日", "周一", "周二", "周三", "周四", "周五", "周六"][day.getDay()]}`;
};
export const timeLabel = (event) =>
  `${dateLabel(event.date)} ${event.start}–${event.end}`;
export const overlaps = (a, b) =>
  a.date === b.date && a.start < b.end && b.start < a.end;
export const eventStart = (event) =>
  new Date(`${event.date}T${event.start}:00`).getTime();
export const isFuture = (event) => eventStart(event) > Date.now();
export const isBusy = (events, event) =>
  events.some(
    (item) =>
      item.id !== event.id && item.type !== "open" && overlaps(item, event),
  );
export const isOpenAvailable = (events, event) =>
  event.type === "open" && isFuture(event) && !isBusy(events, event);

function demoState() {
  const monday = weekStart();
  return {
    profile: { name: "演示账户", avatar: null },
    events: [
      {
        id: uid(),
        type: "reserved",
        title: "已安排 · 摄影交流",
        date: addDays(monday, 1),
        start: "10:00",
        end: "11:00",
      },
      {
        id: uid(),
        type: "blocked",
        title: "私人安排",
        date: addDays(monday, 3),
        start: "14:00",
        end: "15:00",
      },
      {
        id: uid(),
        type: "open",
        title: "开放交流时间",
        date: addDays(monday, 5),
        start: "14:00",
        end: "15:00",
      },
      {
        id: uid(),
        type: "open",
        title: "开放交流时间",
        date: addDays(monday, 5),
        start: "15:00",
        end: "16:00",
      },
    ],
    requests: [],
    drafts: [],
  };
}

export function loadState() {
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (current && Array.isArray(current.events))
      return {
        profile: { name: "演示账户", avatar: null, ...current.profile },
        events: current.events,
        requests: current.requests || [],
        drafts: current.drafts || [],
      };
    const old = JSON.parse(localStorage.getItem(LEGACY_KEY));
    if (old && Array.isArray(old.events))
      return {
        profile: { name: "演示账户", avatar: null },
        events: old.events,
        requests: old.requests || [],
        drafts: [],
      };
  } catch {
    /* Ignore damaged prototype data and show sample content. */
  }
  return demoState();
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
