// 여러 화면에서 같이 쓰는 조각: 상태바, 뒤로, 탭바, 아이콘
export const Mark = ({ size = 39, bg = "#fff" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    <path d="M20 50 Q20 43 26 38 L45 23 Q50 19 55 23 L74 38 Q80 43 80 50 L80 74 Q80 82 72 82 L28 82 Q20 82 20 74 Z" fill="#C2571A" />
    <path d="M38 56 L47 65 L63 47" fill="none" stroke={bg} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Shield = ({ size = 13, color = "#fff", w = 2.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round">
    <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" />
  </svg>
);

export const Check = ({ color = "#C2571A" }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg>
);

export const Status = ({ dark }) => (
  <div className="sb" style={dark ? { color: "#fff" } : undefined}>
    <span>9:41</span>
    <span><i style={{ width: 3, height: 6 }} /><i style={{ width: 3, height: 9 }} /><i style={{ width: 3, height: 12 }} /><span className="bat" /></span>
  </div>
);

export const Back = ({ onBack }) => (
  <div className="nav">
    <svg onClick={onBack} width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#191F28" strokeWidth="2.2" strokeLinecap="round"><path d="M15 6l-6 6 6 6" /></svg>
    <span />
  </div>
);

const TABS = [
  { id: "map", label: "지도", d: <><path d="M12 2c-4 0-7 3-7 7 0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></> },
  { id: "pass", label: "내 이용권", d: <><rect x="3" y="6" width="18" height="13" rx="3" /><path d="M3 10h18" /></> },
  { id: "alerts", label: "알림", d: <><path d="M6 16V11a6 6 0 1112 0v5l2 2H4z" /><path d="M10 21h4" /></> },
];

export const Tab = ({ active, go, unread }) => (
  <div className="tab">
    {TABS.map((t) => (
      <div key={t.id} className={active === t.id ? "on" : ""} onClick={() => go(t.id)}>
        <svg viewBox="0 0 24 24" fill="none" stroke={active === t.id ? "#191F28" : "#8B95A1"} strokeWidth="2">{t.d}</svg>
        {t.label}
        {t.id === "alerts" && unread && <span className="badge" />}
      </div>
    ))}
  </div>
);
