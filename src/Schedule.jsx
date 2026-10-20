import React, { useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import zhCnLocale from "@fullcalendar/core/locales/zh-cn";
import {
  ArrowRight,
  CalendarCheck2,
  CalendarClock,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  LockKeyhole,
  Plus,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import {
  addDays,
  dateKey,
  dateLabel,
  eventStart,
  isFuture,
  isOpenAvailable,
  overlaps,
  pad,
  timeLabel,
  uid,
} from "./data.js";

const typeNames = { reserved: "已安排", blocked: "私人占用", open: "开放时间" };
const blank = () => ({
  type: "reserved",
  title: "",
  date: dateKey(new Date()),
  start: "10:00",
  end: "11:00",
  repeat: false,
});

export default function Schedule({ data, setData, onToast }) {
  const calendarRef = useRef(null);
  const dataRef = useRef(data);
  dataRef.current = data;
  const [view, setView] = useState(() =>
    window.innerWidth < 760 ? "timeGridDay" : "timeGridWeek",
  );
  const [calendarTitle, setCalendarTitle] = useState("");
  const [dialog, setDialog] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [customer, setCustomer] = useState({ name: "", contact: "", need: "" });
  const [error, setError] = useState("");

  const openSlots = useMemo(
    () =>
      data.events
        .filter((item) => item.type === "open")
        .sort((a, b) => eventStart(a) - eventStart(b)),
    [data.events],
  );
  const availableSlots = useMemo(
    () => openSlots.filter((item) => isOpenAvailable(data.events, item)),
    [data.events, openSlots],
  );
  const requests = useMemo(
    () =>
      data.requests
        .filter((item) => item.status === "pending")
        .sort((a, b) => b.created - a.created),
    [data.requests],
  );
  const calendarEvents = useMemo(
    () =>
      data.events.map((item) => ({
        id: item.id,
        title: item.title,
        start: `${item.date}T${item.start}`,
        end: `${item.date}T${item.end}`,
        classNames: [
          `fc-${item.type}`,
          item.type === "open" && !isOpenAvailable(data.events, item)
            ? "fc-unavailable"
            : "",
        ],
      })),
    [data.events],
  );

  function openNew(pref = {}) {
    setDialog({ id: null, form: { ...blank(), ...pref } });
    setError("");
  }
  function openEdit(id) {
    const item = data.events.find((value) => value.id === id);
    if (item) {
      setDialog({ id, form: { ...item, repeat: false } });
      setError("");
    }
  }
  function changeForm(key, value) {
    setDialog((current) => ({
      ...current,
      form: { ...current.form, [key]: value },
    }));
    setError("");
  }
  function calendarAction(action) {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    if (action === "today") api.today();
    else api[action]();
  }
  function changeView(next) {
    calendarRef.current?.getApi().changeView(next);
    setView(next);
  }

  function saveEvent() {
    const form = dialog.form;
    if (!form.date || !form.start || !form.end || form.start >= form.end) {
      setError("请检查日期和起止时间。");
      return;
    }
    const title = form.title.trim() || typeNames[form.type];
    const base = {
      id: dialog.id || uid(),
      type: form.type,
      title,
      date: form.date,
      start: form.start,
      end: form.end,
    };
    const copies =
      form.repeat && !dialog.id
        ? Array.from({ length: 4 }, (_, index) => ({
            ...base,
            id: index ? uid() : base.id,
            date: addDays(base.date, index * 7),
          }))
        : [base];
    for (const item of copies) {
      const collision = data.events.find(
        (other) =>
          other.id !== item.id &&
          overlaps(item, other) &&
          (item.type === "open" || other.type !== "open"),
      );
      if (collision) {
        setError(
          `${dateLabel(item.date)} ${item.start}–${item.end} 与“${collision.title}”冲突，请换一个时间。`,
        );
        return;
      }
    }
    setData((current) => ({
      ...current,
      events: dialog.id
        ? current.events.map((item) => (item.id === dialog.id ? base : item))
        : [...current.events, ...copies],
    }));
    setDialog(null);
    onToast(
      dialog.id
        ? "安排已更新"
        : form.type === "open"
          ? "开放时间已加入课表"
          : "安排已加入课表",
    );
  }

  function deleteEvent() {
    if (!dialog?.id) return;
    setData((current) => ({
      ...current,
      events: current.events.filter((item) => item.id !== dialog.id),
    }));
    setDialog(null);
    onToast("这段时间已删除");
  }

  function resolveRequest(id, accepted) {
    const current = dataRef.current;
    const request = current.requests.find(
      (item) => item.id === id && item.status === "pending",
    );
    if (!request) return;
    if (!accepted) {
      const next = {
        ...current,
        requests: current.requests.map((item) =>
          item.id === id ? { ...item, status: "rejected" } : item,
        ),
      };
      dataRef.current = next;
      setData(next);
      onToast("已标记为不接受");
      return;
    }
    const slot = current.events.find((item) => item.id === request.slotId);
    if (!slot || !isOpenAvailable(current.events, slot)) {
      onToast("当前时段已不可约，请先检查课表");
      return;
    }
    const booked = {
      id: uid(),
      type: "reserved",
      title: `${slot.title} · ${request.name}`,
      date: slot.date,
      start: slot.start,
      end: slot.end,
    };
    const next = {
      ...current,
      events: [...current.events, booked],
      requests: current.requests.map((item) =>
        item.id === id ? { ...item, status: "confirmed" } : item,
      ),
    };
    dataRef.current = next;
    setData(next);
    onToast("已确认安排，同一时段不再向客户展示");
  }

  function sendRequest(event) {
    event.preventDefault();
    const slot = data.events.find((item) => item.id === selectedSlot);
    if (!slot || !isOpenAvailable(data.events, slot)) {
      setError("请先选择仍可预约的时间。");
      return;
    }
    if (!customer.name.trim() || !customer.contact.trim()) {
      setError("请填写称呼和联系方式。");
      return;
    }
    const request = {
      id: uid(),
      slotId: slot.id,
      name: customer.name.trim(),
      contact: customer.contact.trim(),
      need: customer.need.trim(),
      status: "pending",
      created: Date.now(),
    };
    setData((current) => ({
      ...current,
      requests: [...current.requests, request],
    }));
    setSelectedSlot("");
    setCustomer({ name: "", contact: "", need: "" });
    setError("");
    setShareOpen(false);
    onToast("预约意向已提交，等待提供者确认");
  }

  return (
    <div className="schedule-page" data-b="B09">
      <div className="schedule-head">
        <div>
          <span className="section-kicker">MY CALENDAR</span>
          <h2>
            我的课表 <span>/ 时间表</span>
          </h2>
          <p>课程、咨询和私人安排都使用同一份时间轴。</p>
        </div>
        <div className="schedule-head-actions">
          <button
            className="button button-quiet"
            type="button"
            onClick={() => {
              setShareOpen(true);
              setError("");
            }}
            data-z="Z09-1"
          >
            <Eye size={17} /> 客户预览
          </button>
          <button
            className="button button-primary"
            type="button"
            onClick={() => openNew()}
            data-z="Z09-2"
          >
            <Plus size={17} /> 新增安排
          </button>
        </div>
      </div>
      <div className="schedule-metrics">
        <div>
          <span className="metric-symbol reserved">
            <CalendarCheck2 size={20} />
          </span>
          <strong>
            {data.events.filter((item) => item.type === "reserved").length}
          </strong>
          <small>已安排</small>
        </div>
        <div>
          <span className="metric-symbol blocked">
            <LockKeyhole size={20} />
          </span>
          <strong>
            {data.events.filter((item) => item.type === "blocked").length}
          </strong>
          <small>私人占用</small>
        </div>
        <div>
          <span className="metric-symbol open">
            <Share2 size={20} />
          </span>
          <strong>{availableSlots.length}</strong>
          <small>当前可约</small>
        </div>
        <div>
          <span className="metric-symbol pending">
            <CalendarClock size={20} />
          </span>
          <strong>{requests.length}</strong>
          <small>待确认意向</small>
        </div>
      </div>
      <div className="schedule-layout">
        <div className="calendar-card">
          <div className="calendar-toolbar">
            <div className="calendar-title-row">
              <h3>{calendarTitle}</h3>
              <button
                type="button"
                onClick={() => calendarAction("today")}
                data-z="Z09-3"
              >
                今天
              </button>
              <button
                className="small-arrow"
                type="button"
                onClick={() => calendarAction("prev")}
                aria-label="上一段时间"
                data-z="Z09-4"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                className="small-arrow"
                type="button"
                onClick={() => calendarAction("next")}
                aria-label="下一段时间"
                data-z="Z09-5"
              >
                <ChevronRight size={17} />
              </button>
            </div>
            <div className="view-switch">
              <button
                className={view === "timeGridWeek" ? "selected" : ""}
                type="button"
                onClick={() => changeView("timeGridWeek")}
                data-z="Z09-6"
              >
                周
              </button>
              <button
                className={view === "timeGridDay" ? "selected" : ""}
                type="button"
                onClick={() => changeView("timeGridDay")}
                data-z="Z09-7"
              >
                日
              </button>
              <button
                className={view === "dayGridMonth" ? "selected" : ""}
                type="button"
                onClick={() => changeView("dayGridMonth")}
                data-z="Z09-8"
              >
                月
              </button>
            </div>
          </div>
          <div className="calendar-legend">
            <span>
              <i className="legend-dot reserved" />
              已安排
            </span>
            <span>
              <i className="legend-dot blocked" />
              私人占用
            </span>
            <span>
              <i className="legend-dot open" />
              主动开放
            </span>
            <small>拖选空白时间添加安排 · 点击色块修改</small>
          </div>
          <div className="fullcalendar-wrap" data-z="Z09-9">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              locale={zhCnLocale}
              initialView={view}
              headerToolbar={false}
              firstDay={1}
              allDaySlot={false}
              selectable
              selectMirror
              nowIndicator
              dayMaxEvents
              height="auto"
              slotMinTime="07:00:00"
              slotMaxTime="23:00:00"
              slotDuration="00:30:00"
              slotLabelInterval="01:00:00"
              events={calendarEvents}
              datesSet={(info) => setCalendarTitle(info.view.title)}
              select={(info) => {
                const date = dateKey(info.start),
                  start = `${pad(info.start.getHours())}:${pad(info.start.getMinutes())}`;
                let end = `${pad(info.end.getHours())}:${pad(info.end.getMinutes())}`;
                if (dateKey(info.end) !== date || end === "00:00")
                  end = `${pad(Math.min(23, info.start.getHours() + 1))}:${pad(info.start.getMinutes())}`;
                openNew({ date, start, end });
              }}
              eventClick={(info) => openEdit(info.event.id)}
              eventContent={(info) => (
                <div className="event-inner">
                  <strong>{info.event.title}</strong>
                  {info.timeText && <span>{info.timeText}</span>}
                </div>
              )}
            />
          </div>
        </div>
        <aside className="schedule-rail">
          <div className="rail-card">
            <div className="rail-head">
              <div>
                <span className="rail-icon amber">
                  <Share2 size={18} />
                </span>
                <h3>已开放时间</h3>
              </div>
              <button
                type="button"
                className="rail-add"
                onClick={() => openNew({ type: "open", title: "开放交流时间" })}
                aria-label="开放时间"
                data-z="Z09-10"
              >
                <Plus size={17} />
              </button>
            </div>
            <p className="rail-intro">只有这些时间会出现在客户预览里。</p>
            <div
              className="rail-list"
              data-b={openSlots.length ? "B19" : "B22"}
            >
              {openSlots.length ? (
                openSlots.slice(0, 5).map((slot) => (
                  <button
                    type="button"
                    className="open-row"
                    key={slot.id}
                    onClick={() => openEdit(slot.id)}
                    data-z="Z19-1"
                  >
                    <span
                      className={`row-mark ${isOpenAvailable(data.events, slot) ? "" : "muted"}`}
                    />
                    <span>
                      <strong>{dateLabel(slot.date)}</strong>
                      <small>
                        {slot.start}–{slot.end} ·{" "}
                        {isOpenAvailable(data.events, slot)
                          ? "客户可见"
                          : isFuture(slot)
                            ? "当前有冲突"
                            : "已过期"}
                      </small>
                    </span>
                    <ArrowRight size={15} />
                  </button>
                ))
              ) : (
                <p className="rail-empty">
                  还没有开放时段。点右上角加号，选择愿意分享的空闲时间。
                </p>
              )}
            </div>
          </div>
          <div className="rail-card" data-b={requests.length ? "B20" : "B12"}>
            <div className="rail-head">
              <div>
                <span className="rail-icon green">
                  <CalendarClock size={18} />
                </span>
                <h3>预约意向</h3>
              </div>
              <span className="request-count">{requests.length} 待处理</span>
            </div>
            <p className="rail-intro">客户提交的是意向，确认后才占用课表。</p>
            {requests.length ? (
              <div className="request-stack">
                {requests.map((request) => {
                  const slot = data.events.find(
                    (item) => item.id === request.slotId,
                  );
                  const valid = slot && isOpenAvailable(data.events, slot);
                  return (
                    <div className="request-item" key={request.id}>
                      <div className="request-item-top">
                        <strong>{request.name}</strong>
                        <span
                          className={
                            valid ? "status-pill" : "status-pill warning"
                          }
                        >
                          {valid ? "待确认" : "时间不可约"}
                        </span>
                      </div>
                      <p>{slot ? timeLabel(slot) : "已撤回的时段"}</p>
                      {request.need && <small>“{request.need}”</small>}
                      <small>联系：{request.contact}</small>
                      <div>
                        <button
                          type="button"
                          className="request-accept"
                          disabled={!valid}
                          onClick={() => resolveRequest(request.id, true)}
                          data-z="Z20-1"
                        >
                          <Check size={14} /> 确认
                        </button>
                        <button
                          type="button"
                          onClick={() => resolveRequest(request.id, false)}
                          data-z="Z20-2"
                        >
                          不接受
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="rail-empty">
                目前没有待处理意向。可以打开客户预览，模拟提交一次。
              </p>
            )}
          </div>
          <div className="rail-tip">
            <Clock3 size={18} />
            <p>
              空闲不等于公开。你可以先用这张表管理生活和工作，再决定哪些时间拿出去分享。
            </p>
          </div>
        </aside>
      </div>

      {dialog && (
        <div
          className="overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDialog(null);
          }}
          data-b={dialog.id ? "B18" : "B10"}
        >
          <div className="editor-modal">
            <div className="editor-head">
              <div>
                <span className="section-kicker">TIME BLOCK</span>
                <h2>{dialog.id ? "修改时间安排" : "添加时间安排"}</h2>
              </div>
              <button
                type="button"
                className="modal-close-inline"
                onClick={() => setDialog(null)}
                aria-label="关闭"
                data-z={dialog.id ? "Z18-1" : "Z10-1"}
              >
                <X size={20} />
              </button>
            </div>
            <div className="type-selector">
              {Object.entries(typeNames).map(([type, name]) => (
                <button
                  key={type}
                  className={dialog.form.type === type ? `active ${type}` : ""}
                  type="button"
                  onClick={() => changeForm("type", type)}
                  data-z={dialog.id ? "Z18-2" : "Z10-2"}
                >
                  <span className={`type-dot ${type}`} />
                  {name}
                </button>
              ))}
            </div>
            <div className="editor-fields">
              <label className="form-field">
                <span>名称</span>
                <input
                  value={dialog.form.title}
                  onChange={(event) => changeForm("title", event.target.value)}
                  maxLength={45}
                  placeholder={
                    dialog.form.type === "open"
                      ? "例如：经验交流时间"
                      : "例如：摄影课程 / 私人安排"
                  }
                  data-z={dialog.id ? "Z18-3" : "Z10-3"}
                />
              </label>
              <label className="form-field">
                <span>日期</span>
                <input
                  type="date"
                  value={dialog.form.date}
                  onChange={(event) => changeForm("date", event.target.value)}
                  data-z={dialog.id ? "Z18-4" : "Z10-4"}
                />
              </label>
              <div className="form-grid">
                <label className="form-field">
                  <span>开始</span>
                  <input
                    type="time"
                    step="1800"
                    value={dialog.form.start}
                    onChange={(event) =>
                      changeForm("start", event.target.value)
                    }
                    data-z={dialog.id ? "Z18-5" : "Z10-5"}
                  />
                </label>
                <label className="form-field">
                  <span>结束</span>
                  <input
                    type="time"
                    step="1800"
                    value={dialog.form.end}
                    onChange={(event) => changeForm("end", event.target.value)}
                    data-z={dialog.id ? "Z18-6" : "Z10-6"}
                  />
                </label>
              </div>
              {!dialog.id && (
                <label className="repeat-check">
                  <input
                    type="checkbox"
                    checked={dialog.form.repeat}
                    onChange={(event) =>
                      changeForm("repeat", event.target.checked)
                    }
                    data-z="Z10-7"
                  />{" "}
                  连续 4 周的同一时间
                </label>
              )}
            </div>
            <div className="editor-info">
              <LockKeyhole size={16} />
              <span>
                已安排与私人占用不能重叠。开放时间必须由你主动选择，也不能覆盖已有安排。
              </span>
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="editor-actions">
              {dialog.id && (
                <button
                  type="button"
                  className="delete-button"
                  onClick={deleteEvent}
                  data-z="Z18-7"
                >
                  <Trash2 size={16} /> 删除
                </button>
              )}
              <button
                type="button"
                className="button button-quiet"
                onClick={() => setDialog(null)}
                data-z={dialog.id ? "Z18-8" : "Z10-8"}
              >
                取消
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={saveEvent}
                data-z={dialog.id ? "Z18-9" : "Z10-9"}
              >
                保存安排 <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {shareOpen && (
        <div
          className="overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShareOpen(false);
          }}
          data-b="B11"
        >
          <div className="share-modal">
            <div className="editor-head">
              <div>
                <span className="section-kicker">CUSTOMER VIEW</span>
                <h2>客户预约预览</h2>
              </div>
              <button
                className="modal-close-inline"
                type="button"
                onClick={() => setShareOpen(false)}
                aria-label="关闭客户预览"
                data-z="Z11-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="share-banner">
              <span className="share-avatar">时</span>
              <div>
                <strong>一位时间分享者</strong>
                <small>只展示本人主动开放、当前仍可约的时间</small>
              </div>
            </div>
            <form onSubmit={sendRequest}>
              <h3>选择时间</h3>
              <div className="public-slot-list">
                {availableSlots.length ? (
                  availableSlots.map((slot) => (
                    <label
                      key={slot.id}
                      className={`public-slot ${selectedSlot === slot.id ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="slot"
                        value={slot.id}
                        checked={selectedSlot === slot.id}
                        onChange={() => {
                          setSelectedSlot(slot.id);
                          setError("");
                        }}
                        data-z="Z11-2"
                      />
                      <span>
                        <strong>{dateLabel(slot.date)}</strong>
                        <small>
                          {slot.start}–{slot.end} · {slot.title}
                        </small>
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="rail-empty">
                    目前没有可约时间。请先在课表里开放未来的空闲时段。
                  </p>
                )}
              </div>
              <div className="form-grid">
                <label className="form-field">
                  <span>称呼</span>
                  <input
                    value={customer.name}
                    onChange={(event) =>
                      setCustomer((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    maxLength={30}
                    placeholder="例如：小王"
                    data-z="Z11-3"
                  />
                </label>
                <label className="form-field">
                  <span>联系方式</span>
                  <input
                    value={customer.contact}
                    onChange={(event) =>
                      setCustomer((current) => ({
                        ...current,
                        contact: event.target.value,
                      }))
                    }
                    maxLength={60}
                    placeholder="手机或微信（仅演示）"
                    data-z="Z11-4"
                  />
                </label>
              </div>
              <label className="form-field">
                <span>想交流什么</span>
                <textarea
                  value={customer.need}
                  onChange={(event) =>
                    setCustomer((current) => ({
                      ...current,
                      need: event.target.value,
                    }))
                  }
                  maxLength={200}
                  rows={3}
                  placeholder="简单说说你的需求"
                  data-z="Z11-5"
                />
              </label>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <div className="share-actions">
                <p>提交后等待对方确认，此时还没有约成。</p>
                <button
                  className="button button-primary"
                  type="submit"
                  data-z="Z11-6"
                >
                  提交预约意向 <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
