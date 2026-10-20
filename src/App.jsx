import React, { Suspense, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  FolderOpen,
  CalendarDays,
  Check,
  ChevronDown,
  Compass,
  FileText,
  HelpCircle,
  Inbox,
  Layers3,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  UserRound,
  Wallet,
  X,
} from "lucide-react";
import {
  APP_VERSION,
  categories,
  loadState,
  saveState,
  sampleThreads,
  showcase,
  uid,
  timeLabel,
} from "./data.js";
import { UI_REGISTRY } from "./uiRegistry.js";

const Schedule = React.lazy(() => import("./Schedule.jsx"));

const mainNav = [
  { id: "hall", label: "大厅", icon: Compass, note: "发现值得交流的人" },
  { id: "publish", label: "发布", icon: Plus, note: "整理你愿意分享的经验" },
  { id: "messages", label: "消息", icon: MessageCircle, note: "预约与沟通" },
  { id: "me", label: "我的", icon: UserRound, note: "买到的、卖出的与时间" },
];

const myNav = [
  {
    id: "overview",
    label: "我的首页",
    icon: Layers3,
    group: "账户",
    code: "Z07-1",
  },
  {
    id: "bought",
    label: "我买到的",
    icon: ShoppingBag,
    group: "交易",
    code: "Z07-3",
  },
  { id: "sold", label: "我卖出的", icon: Inbox, group: "交易", code: "Z07-8" },
  {
    id: "published",
    label: "我的发布",
    icon: Tag,
    group: "管理",
    code: "Z07-4",
  },
  {
    id: "schedule",
    label: "我的时间表",
    icon: CalendarDays,
    group: "管理",
    code: "Z07-2",
  },
  {
    id: "materials",
    label: "交流资料",
    icon: FolderOpen,
    group: "管理",
    code: "Z07-5",
  },
];

function App() {
  const [data, setData] = useState(loadState);
  const [page, setPage] = useState("hall");
  const [myTab, setMyTab] = useState("overview");
  const [toast, setToast] = useState("");
  const [editDraft, setEditDraft] = useState(null);
  const [devMode, setDevMode] = useState(false);

  useEffect(() => saveState(data), [data]);
  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(""), 3400);
    return () => clearTimeout(timeout);
  }, [toast]);

  function navigate(next, tab = null) {
    setPage(next);
    if (tab) setMyTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveDraft(draft) {
    setData((current) => ({
      ...current,
      drafts: [draft, ...current.drafts.filter((item) => item.id !== draft.id)],
    }));
    setEditDraft(null);
    setToast("草稿已保存到“我的 → 我的发布”");
  }

  const pageNames = {
    hall: "时间售卖大厅",
    publish: "发布我的时间",
    messages: "消息中心",
    me: myNav.find((item) => item.id === myTab)?.label || "我的",
  };

  return (
    <div className="app-shell" data-b="B00">
      <aside className="sidebar">
        <button
          className="brand"
          type="button"
          onClick={() => navigate("hall")}
          data-z="Z00-1"
        >
          <span className="brand-mark">时</span>
          <span>
            <strong>时间售卖</strong>
            <small>TIME · VALUE · PEOPLE</small>
          </span>
        </button>
        <div className="side-caption">探索</div>
        <nav className="side-nav" aria-label="主要导航">
          {mainNav.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`side-link ${page === item.id ? "active" : ""}`}
              onClick={() => navigate(item.id)}
              data-z={`Z00-${index + 2}`}
            >
              <item.icon size={19} />
              <span>
                <strong>{item.label}</strong>
                <small>{item.note}</small>
              </span>
              {page === item.id && <span className="active-pip" />}
            </button>
          ))}
        </nav>
        <div className="side-bottom">
          <div className="side-idea">
            <Sparkles size={17} />
            <span>先管理好自己的时间，再决定哪一段值得分享。</span>
          </div>
          <button
            type="button"
            className="side-account"
            onClick={() => navigate("me", "overview")}
            data-z="Z00-6"
          >
            <span className="mini-avatar">我</span>
            <span>
              <strong>演示账户</strong>
              <small>可买，也可分享</small>
            </span>
            <ChevronDown size={15} />
          </button>
          <div className="version-line">
            <span>{APP_VERSION} · 产品框架原型</span>
            <button
              type="button"
              onClick={() => setDevMode((value) => !value)}
              data-z="Z00-7"
            >
              {devMode ? "关闭定位" : "开发定位"}
            </button>
          </div>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <div className="topbar-left">
            <span className="eyebrow">TIME SELLING / PROTOTYPE</span>
            <span className="crumb">{pageNames[page]}</span>
          </div>
          <div className="topbar-right">
            <span className="demo-pill">
              <span /> 当前为演示模式
            </span>
            <button
              type="button"
              className="icon-button"
              aria-label="消息"
              onClick={() => navigate("messages")}
              data-z="Z00-8"
            >
              <Bell size={19} />
            </button>
            <button
              type="button"
              className="top-avatar"
              aria-label="我的"
              onClick={() => navigate("me", "overview")}
              data-z="Z00-9"
            >
              我
            </button>
          </div>
        </header>
        <main className="content">
          {page === "hall" && (
            <MarketPage onNavigate={navigate} onToast={setToast} />
          )}
          {page === "publish" && (
            <PublishPage
              onSave={saveDraft}
              editDraft={editDraft}
              clearEdit={() => setEditDraft(null)}
              onNavigate={navigate}
            />
          )}
          {page === "messages" && <MessagesPage onNavigate={navigate} />}
          {page === "me" && (
            <MyPage
              data={data}
              setData={setData}
              tab={myTab}
              setTab={setMyTab}
              onNavigate={navigate}
              onEditDraft={(draft) => {
                setEditDraft(draft);
                navigate("publish");
              }}
              onToast={setToast}
            />
          )}
        </main>
      </div>

      <nav className="mobile-nav" aria-label="移动端主导航">
        {mainNav.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={page === item.id ? "active" : ""}
            onClick={() => navigate(item.id)}
            data-z={`Z00-${index + 10}`}
          >
            <item.icon size={21} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      {toast && (
        <div className="toast" role="status" data-b="B16">
          <Check size={17} />
          {toast}
        </div>
      )}
      {devMode && <DevInspector onClose={() => setDevMode(false)} />}
    </div>
  );
}

function MarketPage({ onNavigate, onToast }) {
  const [category, setCategory] = useState("全部");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const results = useMemo(
    () =>
      showcase.filter(
        (item) =>
          (category === "全部" || category === item.category) &&
          (!query.trim() ||
            `${item.name} ${item.host} ${item.category} ${item.tags.join(" ")}`
              .toLowerCase()
              .includes(query.trim().toLowerCase())),
      ),
    [category, query],
  );

  return (
    <div data-b="B01" className="page-stack">
      <section className="market-hero">
        <div className="hero-copy">
          <span className="hero-label">
            <Sparkles size={15} /> 让你的时间，遇见需要它的人
          </span>
          <h1>
            有人愿意分享经验，
            <br />
            <em>有人正在寻找答案。</em>
          </h1>
          <p>从一小时交流开始，让技能、经验与真实经历成为值得预约的服务。</p>
          <div className="hero-actions">
            <button
              type="button"
              className="button button-light"
              onClick={() =>
                document
                  .getElementById("discover")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              data-z="Z01-1"
            >
              探索时间服务 <ArrowRight size={17} />
            </button>
            <button
              type="button"
              className="button button-outline-light"
              onClick={() => onNavigate("publish")}
              data-z="Z01-2"
            >
              我想发布
            </button>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="hero-time-card">
            <span>一段值得分享的时间</span>
            <strong>
              14:00 <i>—</i> 15:00
            </strong>
            <div>
              <span className="hero-dot" /> 等待一次有价值的相遇
            </div>
          </div>
          <div className="floating-note">
            <span>✦</span> 每个人都有独特的经历
          </div>
        </div>
      </section>

      <section id="discover" className="discovery">
        <div className="section-head">
          <div>
            <span className="section-kicker">DISCOVER</span>
            <h2>发现你想交流的人</h2>
            <p>先选需求，再看适合的人和时间。</p>
          </div>
          <span className="soft-label">精选场景 · 示例内容</span>
        </div>
        <div className="search-row">
          <div className="search-field">
            <Search size={19} />
            <input
              aria-label="搜索服务"
              placeholder="试试搜索“网约车”“开店”“摄影”"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              data-z="Z01-3"
            />
          </div>
          <button
            type="button"
            className="filter-button"
            onClick={() => {
              setQuery("");
              setCategory("全部");
              onToast("已清除筛选条件");
            }}
            data-z="Z01-4"
          >
            <Settings2 size={18} /> 重置筛选
          </button>
        </div>
        <div className="category-row">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? "selected" : ""}
              onClick={() => setCategory(item)}
              data-z="Z01-5"
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="offer-section">
        <div className="section-head compact">
          <div>
            <h2>值得一聊的时间</h2>
            <p>以下是产品展示用的示例服务，尚未开放真实交易。</p>
          </div>
          <span className="result-count">{results.length} 个示例</span>
        </div>
        {results.length ? (
          <div className="offer-grid">
            {results.map((item) => (
              <OfferCard
                key={item.id}
                offer={item}
                onOpen={() => setSelected(item)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-search">
            <Search size={27} />
            <h3>还没有匹配的示例</h3>
            <p>换个关键词或类别看看。</p>
          </div>
        )}
      </section>

      <section className="how-band">
        <div>
          <span className="section-kicker">HOW IT WORKS</span>
          <h2>从空闲时间，到一次真实交流</h2>
        </div>
        <div className="how-steps">
          <div>
            <span>01</span>
            <strong>管理时间</strong>
            <p>先把已有安排放进同一份时间表。</p>
          </div>
          <div>
            <span>02</span>
            <strong>自主开放</strong>
            <p>只选择愿意分享的时段与服务。</p>
          </div>
          <div>
            <span>03</span>
            <strong>确认预约</strong>
            <p>先沟通需求，再决定是否确认。</p>
          </div>
        </div>
      </section>

      {selected && (
        <div
          className="overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
          data-b="B02"
        >
          <div className="detail-modal">
            <button
              className="modal-close"
              type="button"
              onClick={() => setSelected(null)}
              aria-label="关闭详情"
              data-z="Z02-1"
            >
              <X size={20} />
            </button>
            <span className="pill pale">{selected.category} · 演示服务</span>
            <h2>{selected.name}</h2>
            <p className="detail-description">{selected.description}</p>
            <div className="detail-host">
              <span className={`offer-avatar ${selected.color}`}>
                {selected.avatar}
              </span>
              <div>
                <strong>{selected.host}</strong>
                <small>时间提供者</small>
              </div>
            </div>
            <div className="detail-grid">
              <div>
                <CalendarDays size={19} />
                <span>单次时长</span>
                <strong>{selected.duration} 分钟</strong>
              </div>
              <div>
                <MapPin size={19} />
                <span>交流方式</span>
                <strong>{selected.mode}</strong>
              </div>
              <div>
                <Wallet size={19} />
                <span>参考价格</span>
                <strong>¥{selected.price} / 次</strong>
              </div>
            </div>
            <div className="detail-bottom">
              <p>真实挂牌、付款和跨设备预约将在后续版本接入。</p>
              <button
                className="button button-primary"
                type="button"
                onClick={() => {
                  setSelected(null);
                  onNavigate("me", "schedule");
                }}
                data-z="Z02-2"
              >
                体验预约时间流程 <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OfferCard({ offer, onOpen }) {
  return (
    <article className="offer-card">
      <div className={`offer-visual ${offer.color}`}>
        <span className="visual-symbol">{offer.avatar}</span>
        <span className="offer-category">{offer.category}</span>
      </div>
      <div className="offer-body">
        <div className="offer-host">
          <span className={`offer-avatar ${offer.color}`}>{offer.avatar}</span>
          <span>{offer.host}</span>
          <ShieldCheck size={15} />
        </div>
        <h3>{offer.name}</h3>
        <p>{offer.description}</p>
        <div className="tags">
          {offer.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="offer-footer">
          <span>
            <strong>¥{offer.price}</strong> / {offer.duration} 分钟
          </span>
          <button type="button" onClick={onOpen} data-z="Z01-6">
            查看详情 <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

function PublishPage({ onSave, editDraft, clearEdit, onNavigate }) {
  const emptyForm = {
    title: "",
    category: "职业经验",
    description: "",
    price: "",
    duration: "60",
    mode: "线上交流",
  };
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (editDraft)
      setForm({
        title: editDraft.title,
        category: editDraft.category,
        description: editDraft.description,
        price: String(editDraft.price),
        duration: String(editDraft.duration),
        mode: editDraft.mode,
      });
    else setForm(emptyForm);
  }, [editDraft]);
  const patch = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setNotice("");
  };
  function save() {
    if (!form.title.trim()) {
      setNotice("请先填写你准备分享什么。");
      return;
    }
    const draft = {
      ...form,
      id: editDraft?.id || uid(),
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price) || 0,
      duration: Number(form.duration),
      status: "draft",
      updatedAt: Date.now(),
    };
    onSave(draft);
    setForm(emptyForm);
    onNavigate("me", "published");
  }

  return (
    <div data-b="B03" className="page-stack">
      <div className="page-heading">
        <span className="section-kicker">SHARE YOUR TIME</span>
        <h1>把你擅长的，整理成一段可分享的时间。</h1>
        <p>
          先写下服务内容，保存为草稿。真正公开发布前，还需要身份、规则和交易能力。
        </p>
      </div>
      <div className="publish-layout">
        <div className="form-card">
          <div className="step-head">
            <span>01</span>
            <div>
              <h2>服务内容</h2>
              <p>讲清楚别人能从这段时间获得什么。</p>
            </div>
          </div>
          <div className="form-grid">
            <label className="form-field full">
              <span>
                服务标题 <b>*</b>
              </span>
              <input
                value={form.title}
                onChange={(event) => patch("title", event.target.value)}
                maxLength={50}
                placeholder="例如：网约车新手入行经验交流"
                data-z="Z03-1"
              />
            </label>
            <label className="form-field">
              <span>类别</span>
              <select
                value={form.category}
                onChange={(event) => patch("category", event.target.value)}
                data-z="Z03-2"
              >
                {categories
                  .filter((item) => item !== "全部")
                  .map((item) => (
                    <option key={item}>{item}</option>
                  ))}
              </select>
            </label>
            <label className="form-field">
              <span>交流方式</span>
              <select
                value={form.mode}
                onChange={(event) => patch("mode", event.target.value)}
                data-z="Z03-3"
              >
                <option>线上交流</option>
                <option>线下见面</option>
                <option>线上 / 线下</option>
              </select>
            </label>
            <label className="form-field full">
              <span>服务介绍</span>
              <textarea
                value={form.description}
                onChange={(event) => patch("description", event.target.value)}
                rows={5}
                maxLength={500}
                placeholder="说说适合谁、你能分享什么，以及交流前需要对方准备什么。"
                data-z="Z03-4"
              />
            </label>
          </div>
          <div className="form-divider" />
          <div className="step-head">
            <span>02</span>
            <div>
              <h2>时间与价格</h2>
              <p>这是服务条件；可预约时段从“我的时间表”单独开放。</p>
            </div>
          </div>
          <div className="form-grid">
            <label className="form-field">
              <span>单次时长</span>
              <select
                value={form.duration}
                onChange={(event) => patch("duration", event.target.value)}
                data-z="Z03-5"
              >
                <option value="30">30 分钟</option>
                <option value="45">45 分钟</option>
                <option value="60">60 分钟</option>
                <option value="90">90 分钟</option>
                <option value="120">120 分钟</option>
              </select>
            </label>
            <label className="form-field">
              <span>参考价格（元）</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                max="99999"
                value={form.price}
                onChange={(event) => patch("price", event.target.value)}
                placeholder="例如：99"
                data-z="Z03-6"
              />
            </label>
          </div>
          {notice && (
            <p className="form-error" role="alert">
              {notice}
            </p>
          )}
          <div className="form-actions">
            <button
              type="button"
              className="button button-quiet"
              onClick={() => setPreview(true)}
              data-z="Z03-7"
            >
              预览服务卡片
            </button>
            <button
              type="button"
              className="button button-primary"
              onClick={save}
              data-z="Z03-8"
            >
              保存草稿 <ArrowRight size={17} />
            </button>
          </div>
        </div>
        <aside className="publish-aside">
          <div className="guidance-card">
            <span className="guidance-icon">
              <FileText size={23} />
            </span>
            <h3>好的发布从明确边界开始</h3>
            <p>
              说明服务适合谁、一次多久、通过什么方式交流。价格和内容可以保存后继续修改。
            </p>
            <ul>
              <li>
                <Check size={15} /> 服务和时间分开维护
              </li>
              <li>
                <Check size={15} /> 只开放你愿意售卖的时段
              </li>
              <li>
                <Check size={15} /> 发布前再核对展示信息
              </li>
            </ul>
          </div>
          <div className="aside-note">
            <HelpCircle size={18} />
            <span>
              当前只保存本机草稿。公开上架与真实交易会在后续阶段接入。
            </span>
          </div>
        </aside>
      </div>
      {preview && (
        <div
          className="overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPreview(false);
          }}
          data-b="B04"
        >
          <div className="detail-modal">
            <button
              className="modal-close"
              type="button"
              onClick={() => setPreview(false)}
              aria-label="关闭预览"
              data-z="Z04-1"
            >
              <X size={20} />
            </button>
            <span className="pill pale">发布预览 · 尚未上架</span>
            <h2>{form.title || "你的服务标题会显示在这里"}</h2>
            <p className="detail-description">
              {form.description ||
                "填写服务介绍后，客户可以先了解这段时间适合交流什么。"}
            </p>
            <div className="detail-grid">
              <div>
                <Tag size={18} />
                <span>类别</span>
                <strong>{form.category}</strong>
              </div>
              <div>
                <CalendarDays size={18} />
                <span>时长</span>
                <strong>{form.duration} 分钟</strong>
              </div>
              <div>
                <Wallet size={18} />
                <span>参考价格</span>
                <strong>¥{form.price || "—"}</strong>
              </div>
            </div>
            <p className="detail-hint">
              可售时间需在“我的时间表”里主动开放，保存草稿不会自动公开时间。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function MessagesPage({ onNavigate }) {
  const [activeId, setActiveId] = useState(sampleThreads[0].id);
  const active = sampleThreads.find((item) => item.id === activeId);
  return (
    <div data-b="B05" className="page-stack">
      <div className="page-heading">
        <span className="section-kicker">CONVERSATIONS</span>
        <h1>沟通，发生在预约前后。</h1>
        <p>
          需求、确认与改期都会在这里汇合。当前展示沟通结构，暂未接入真实用户。
        </p>
      </div>
      <div className="message-shell">
        <div className="thread-list">
          <div className="thread-heading">
            <h2>消息</h2>
            <span className="count-badge">示例 2</span>
          </div>
          {sampleThreads.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`thread-item ${activeId === item.id ? "active" : ""}`}
              onClick={() => setActiveId(item.id)}
              data-z="Z05-1"
            >
              <span className="thread-avatar">{item.avatar}</span>
              <span className="thread-copy">
                <strong>{item.name}</strong>
                <small>{item.subtitle}</small>
              </span>
              <time>{item.time}</time>
            </button>
          ))}
        </div>
        <div className="conversation" data-b="B06">
          <div className="conversation-head">
            <span className="thread-avatar">{active.avatar}</span>
            <div>
              <strong>{active.name}</strong>
              <small>演示对话 · 真实消息尚未开放</small>
            </div>
            <span className="pill pale">示例</span>
          </div>
          <div className="conversation-body">
            <div className="conversation-day">产品交流示例</div>
            {active.messages.map((message, index) => (
              <div key={index} className={`bubble ${message.from}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="conversation-compose">
            <div className="compose-disabled">
              <MessageCircle size={18} />
              <span>账户和真实消息接入后，可在这里回复。</span>
            </div>
            <button
              type="button"
              className="button button-quiet"
              onClick={() => onNavigate("me", "schedule")}
              data-z="Z06-1"
            >
              先管理可约时间 <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MyPage({
  data,
  setData,
  tab,
  setTab,
  onNavigate,
  onEditDraft,
  onToast,
}) {
  const confirmed = data.events.filter(
    (item) => item.type === "reserved",
  ).length;
  const open = data.events.filter((item) => item.type === "open").length;
  const pending = data.requests.filter(
    (item) => item.status === "pending",
  ).length;
  const recentRequests = [...data.requests]
    .sort((a, b) => (b.created || 0) - (a.created || 0))
    .slice(0, 3);
  return (
    <div className="page-stack my-page" data-b="B07">
      <div className="my-banner">
        <div className="my-banner-avatar">我</div>
        <div>
          <span className="my-kicker">个人中心 · 演示账户</span>
          <h1>你可以寻找服务，也可以分享自己的时间。</h1>
          <p>同一个账户，管理买到的、卖出的、发布内容和时间安排。</p>
        </div>
        <span className="my-banner-shape" aria-hidden="true">
          ◌
        </span>
      </div>
      <div
        className={`my-layout ${tab === "schedule" ? "schedule-focus" : ""}`}
      >
        <nav className="my-menu" aria-label="我的功能">
          {myNav.map((item, index) => (
            <React.Fragment key={item.id}>
              {(index === 0 || myNav[index - 1].group !== item.group) && (
                <span className="my-menu-group">{item.group}</span>
              )}
              <button
                type="button"
                className={tab === item.id ? "active" : ""}
                onClick={() => setTab(item.id)}
                data-z={item.code}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                <ArrowRight size={15} />
              </button>
            </React.Fragment>
          ))}
        </nav>
        <div className="my-content">
          {tab === "overview" && (
            <div data-b="B23">
              <div className="section-head compact">
                <div>
                  <span className="section-kicker">MY ACCOUNT</span>
                  <h2>我的交易</h2>
                  <p>每个人都可以同时是买家和卖家，按交易方向查看记录。</p>
                </div>
              </div>
              <div className="trade-grid">
                <section className="trade-card trade-buy">
                  <span className="trade-icon">
                    <ShoppingBag size={22} />
                  </span>
                  <span className="trade-kicker">作为买家</span>
                  <h3>我买到的</h3>
                  <p>查看购买记录、预约进度和对方交付的资料。</p>
                  <div className="trade-facts">
                    <span>
                      <strong>0</strong> 笔购买订单
                    </span>
                    <span>交易尚未开放</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTab("bought")}
                    data-z="Z23-1"
                  >
                    查看买入记录 <ArrowRight size={16} />
                  </button>
                </section>
                <section className="trade-card trade-sell">
                  <span className="trade-icon">
                    <Tag size={22} />
                  </span>
                  <span className="trade-kicker">作为卖家</span>
                  <h3>我卖出的</h3>
                  <p>处理预约意向，查看卖出订单和服务状态。</p>
                  <div className="trade-facts">
                    <span>
                      <strong>{pending}</strong> 条待处理意向
                    </span>
                    <span>{data.drafts.length} 份发布草稿</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTab("sold")}
                    data-z="Z23-2"
                  >
                    查看卖出记录 <ArrowRight size={16} />
                  </button>
                </section>
              </div>
              <div className="section-head compact my-tools-head">
                <div>
                  <h2>我的工具</h2>
                  <p>时间表属于个人账户，买卖两侧都可以从这里查看安排。</p>
                </div>
              </div>
              <div className="shortcut-grid">
                <button
                  type="button"
                  onClick={() => setTab("schedule")}
                  data-z="Z07-6"
                >
                  <span className="shortcut-icon green">
                    <CalendarDays size={22} />
                  </span>
                  <strong>管理时间表</strong>
                  <small>
                    {confirmed} 段已安排 · {open} 段主动开放
                  </small>
                  <ArrowRight size={19} />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("publish")}
                  data-z="Z07-7"
                >
                  <span className="shortcut-icon amber">
                    <Plus size={22} />
                  </span>
                  <strong>管理我的发布</strong>
                  <small>整理服务内容，保存草稿</small>
                  <ArrowRight size={19} />
                </button>
              </div>
              <div className="overview-note">
                <ShieldCheck size={19} />
                <p>
                  买入和卖出共用一个账户；你开放的时间与已有安排共用同一份时间表。当前交易记录只展示真实可用的原型数据，支付和跨设备预约仍待接入。
                </p>
              </div>
            </div>
          )}
          {tab === "schedule" && (
            <div data-b="B08">
              <Suspense
                fallback={<div className="loading-panel">正在打开时间表…</div>}
              >
                <Schedule data={data} setData={setData} onToast={onToast} />
              </Suspense>
            </div>
          )}
          {tab === "bought" && (
            <div data-b="B13">
              <SectionTitle
                kicker="AS A BUYER"
                title="我买到的"
                subtitle="按买家身份查看预约、订单和服务资料。"
              />
              <div className="order-summary">
                <span>
                  待确认 <strong>0</strong>
                </span>
                <span>
                  进行中 <strong>0</strong>
                </span>
                <span>
                  已完成 <strong>0</strong>
                </span>
              </div>
              <EmptyState
                icon={ShoppingBag}
                title="还没有买入订单"
                description="大厅目前展示示例服务，暂不能真实下单。将来购买或预约他人的时间后，进度和交易资料会从这里进入。"
                action="去大厅发现服务"
                onAction={() => onNavigate("hall")}
                code="Z13-1"
              />
            </div>
          )}
          {tab === "sold" && (
            <div data-b="B24">
              <SectionTitle
                kicker="AS A SELLER"
                title="我卖出的"
                subtitle="预约意向、已确认安排和成交订单分别记录，避免把咨询当作收入。"
              />
              <div className="order-summary">
                <span>
                  待处理意向 <strong>{pending}</strong>
                </span>
                <span>
                  已确认安排{" "}
                  <strong>
                    {
                      data.requests.filter(
                        (item) => item.status === "confirmed",
                      ).length
                    }
                  </strong>
                </span>
                <span>
                  成交订单 <strong>0</strong>
                </span>
              </div>
              {recentRequests.length ? (
                <div className="seller-requests">
                  <div className="seller-requests-head">
                    <h3>最近的预约意向</h3>
                    <small>本机演示记录 · 尚非订单</small>
                  </div>
                  {recentRequests.map((request) => {
                    const slot = data.events.find(
                      (item) => item.id === request.slotId,
                    );
                    return (
                      <div className="seller-request" key={request.id}>
                        <span className="request-avatar">
                          {request.name?.slice(0, 1) || "约"}
                        </span>
                        <div>
                          <strong>{request.name || "预约者"}</strong>
                          <small>
                            {slot ? timeLabel(slot) : "原时段已撤回"}
                          </small>
                        </div>
                        <span
                          className={`status-pill ${request.status === "rejected" ? "warning" : ""}`}
                        >
                          {request.status === "pending"
                            ? "待确认"
                            : request.status === "confirmed"
                              ? "已确认安排"
                              : "未接受"}
                        </span>
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    className="button button-quiet"
                    onClick={() => setTab("schedule")}
                    data-z="Z24-1"
                  >
                    去时间表处理 <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <EmptyState
                  icon={Inbox}
                  title="还没有卖出记录"
                  description="你可以先发布服务草稿，再从时间表主动开放可约时段。客户提交的意向会先由你确认；真实成交要等交易功能接入。"
                  action="管理我的发布"
                  onAction={() => setTab("published")}
                  code="Z24-1"
                />
              )}
            </div>
          )}
          {tab === "published" && (
            <div data-b={data.drafts.length ? "B21" : "B14"}>
              <SectionTitle
                kicker="MY SERVICES"
                title="我的发布"
                subtitle="先整理草稿，再连接可售时间和公开交易。"
              />
              {data.drafts.length ? (
                <div className="draft-list">
                  {data.drafts.map((draft) => (
                    <div className="draft-card" key={draft.id}>
                      <span className="draft-symbol">
                        <FileText size={21} />
                      </span>
                      <div>
                        <div className="draft-title">
                          <strong>{draft.title}</strong>
                          <span className="pill pale">草稿</span>
                        </div>
                        <p>
                          {draft.category} · {draft.duration} 分钟 ·{" "}
                          {draft.mode}
                        </p>
                        <small>本机保存 · 尚未公开上架</small>
                      </div>
                      <button
                        type="button"
                        className="button button-quiet"
                        onClick={() => onEditDraft(draft)}
                        data-z="Z21-1"
                      >
                        继续编辑 <ArrowRight size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={FileText}
                  title="还没有发布草稿"
                  description="你可以先把经验、课程或服务写成一张草稿卡片；保存不会立即公开。"
                  action="创建服务草稿"
                  onAction={() => onNavigate("publish")}
                  code="Z14-1"
                />
              )}
            </div>
          )}
          {tab === "materials" && (
            <div data-b="B15">
              <SectionTitle
                kicker="MATERIALS"
                title="交流资料"
                subtitle="以后可查看买到的资料，也可管理自己准备分享的内容。"
              />
              <div className="materials-banner">
                <span>
                  <FolderOpen size={23} />
                </span>
                <div>
                  <h3>每种服务，都有适合自己的资料</h3>
                  <p>
                    它也可以是服务说明、经验清单、路线建议、经营复盘或交易后交付的文件；具体内容由服务本身决定。
                  </p>
                </div>
              </div>
              <EmptyState
                icon={FolderOpen}
                title="还没有交流资料"
                description="目前可以在发布草稿中说明交流内容。买入资料、上传管理和订单交付将在真实交易功能接入后开放。"
                action="去写服务草稿"
                onAction={() => onNavigate("publish")}
                code="Z15-1"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ kicker, title, subtitle }) {
  return (
    <div className="section-head compact">
      <div>
        <span className="section-kicker">{kicker}</span>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  onAction,
  code,
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon size={28} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      <button
        type="button"
        className="button button-primary"
        onClick={onAction}
        data-z={code}
      >
        {action}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

function DevInspector({ onClose }) {
  const [snapshot, setSnapshot] = useState({ codes: [], issues: [] });
  useEffect(() => {
    const update = () => {
      const visible = (element) =>
        element.getClientRects().length > 0 &&
        getComputedStyle(element).visibility !== "hidden";
      const nodes = [...document.querySelectorAll("[data-b],[data-z]")]
        .filter(visible)
        .filter((element) => !element.closest("#dev-inspector"));
      const codes = nodes.map(
        (element) => element.dataset.b || element.dataset.z,
      );
      const issues = [];
      for (const code of codes)
        if (!UI_REGISTRY[code]) issues.push(`未登记：${code}`);
      for (const element of nodes.filter((item) => item.dataset.z)) {
        const parent = element.dataset.z.match(/^Z(\d+)-/);
        if (!parent || !element.closest(`[data-b="B${parent[1]}"]`))
          issues.push(`父级不符：${element.dataset.z}`);
      }
      for (const element of [
        ...document.querySelectorAll("button,input,select,textarea"),
      ].filter(visible))
        if (
          !element.closest("[data-z]") &&
          !element.closest("#dev-inspector") &&
          !element.closest(".fc")
        )
          issues.push(
            `未定位控件：${element.textContent?.trim().slice(0, 12) || element.tagName}`,
          );
      for (const element of [
        ...document.querySelectorAll("main > [data-b], .overlay, .toast"),
      ].filter(visible))
        if (!element.dataset.b) issues.push("可见状态未登记 B");
      const bCodes = nodes
        .filter((element) => element.dataset.b)
        .map((element) => element.dataset.b);
      for (const code of bCodes)
        if (bCodes.filter((value) => value === code).length > 1)
          issues.push(`重复 B：${code}`);
      setSnapshot({ codes: [...new Set(codes)], issues: [...new Set(issues)] });
    };
    update();
    const observer = new MutationObserver((records) => {
      if (records.every((record) => record.target.closest?.("#dev-inspector")))
        return;
      update();
    });
    observer.observe(document.getElementById("root"), {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-b", "data-z", "class"],
    });
    return () => observer.disconnect();
  }, []);
  return (
    <aside id="dev-inspector" className="dev-inspector" data-b="B17">
      <div className="dev-head">
        <strong>开发定位</strong>
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭开发定位"
          data-z="Z17-1"
        >
          <X size={15} />
        </button>
      </div>
      <p>当前可见对象，点击编码复制。</p>
      <div className="dev-code-list">
        {snapshot.codes.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => navigator.clipboard?.writeText(code)}
            data-z="Z17-2"
          >
            <b>{code}</b>
            <span>{UI_REGISTRY[code] || "未登记"}</span>
          </button>
        ))}
      </div>
      <div className={`dev-status ${snapshot.issues.length ? "bad" : ""}`}>
        {snapshot.issues.length
          ? snapshot.issues.slice(0, 4).join("；")
          : "可见编码与控件已登记"}
      </div>
    </aside>
  );
}

export default App;
