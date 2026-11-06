// 여러 화면에서 같이 쓰는 조각
export const Mark = ({ size = 39, bg = "#fff" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
    <path d="M20 50 Q20 43 26 38 L45 23 Q50 19 55 23 L74 38 Q80 43 80 50 L80 74 Q80 82 72 82 L28 82 Q20 82 20 74 Z" fill="#C2571A" />
    <path d="M38 56 L47 65 L63 47" fill="none" stroke={bg} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Icon = ({ d, size = 22, color = "#191F28", w = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round" aria-hidden>{d}</svg>
);

export const I = {
  shield: <><path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></>,
  doc: <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M10 13h6M10 17h4" /></>,
  card: <><rect x="3" y="6" width="18" height="13" rx="3" /><path d="M3 10h18" /></>,
  pin: <><path d="M12 2c-4 0-7 3-7 7 0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></>,
  bell: <><path d="M6 16V11a6 6 0 1112 0v5l2 2H4z" /><path d="M10 21h4" /></>,
  check: <path d="M5 12l5 5 9-10" />,
  back: <path d="M15 6l-6 6 6 6" />,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3" /></>,
  phone: <><rect x="7" y="2" width="10" height="20" rx="2.5" /><path d="M11 18h2" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  arrow: <path d="M9 6l6 6-6 6" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" /></>,
  gym: <path d="M6.5 7v10M3.5 9.5v5M17.5 7v10M20.5 9.5v5M6.5 12h11" />,
  pilates: <><circle cx="16.5" cy="5" r="2" /><path d="M3 19h18M5.5 19l4.5-6h5.5l2 6M10 13l5.5-4.5" /></>,
  yoga: <><circle cx="12" cy="4.5" r="2" /><path d="M12 8v5M5 10.5l7 2.5 7-2.5M6 19l6-4 6 4" /></>,
  swim: <><path d="M3 16c1.5 1.3 3 1.3 4.5 0s3-1.3 4.5 0 3 1.3 4.5 0 3-1.3 4.5 0M3 20c1.5 1.3 3 1.3 4.5 0s3-1.3 4.5 0 3 1.3 4.5 0 3-1.3 4.5 0" /><circle cx="16" cy="7" r="2" /><path d="M5 13l5-5 3 3" /></>,
  golf: <><path d="M9 21V3l8 4-8 4" /><path d="M5 21h10" /></>,
};

// 업종: 지도 핀 아이콘과 검색 아래 칩에 같이 쓴다. ready가 false면 곧 추가될 업종
export const CATS = [
  { id: "gym", label: "헬스", icon: "gym", ready: true },
  { id: "pilates", label: "필라테스", icon: "pilates", ready: true },
  { id: "yoga", label: "요가", icon: "yoga", ready: false },
  { id: "swim", label: "수영", icon: "swim", ready: false },
  { id: "golf", label: "골프", icon: "golf", ready: false },
];

export const Status = ({ dark, onSecret }) => (
  <div className="sb" style={dark ? { color: "#fff" } : undefined} onClick={onSecret}>
    <span>9:41</span>
    <span><i style={{ width: 3, height: 6 }} /><i style={{ width: 3, height: 9 }} /><i style={{ width: 3, height: 12 }} /><span className="bat" /></span>
  </div>
);

export const Back = ({ onBack, right }) => (
  <div className="nav">
    <button className="hit" onClick={onBack} aria-label="뒤로"><Icon d={I.back} size={26} w={2.2} /></button>
    {right || <span />}
  </div>
);

const TABS = [
  { id: "map", label: "지도", d: I.pin },
  { id: "pass", label: "내 이용권", d: I.card },
  { id: "alerts", label: "알림", d: I.bell },
  { id: "my", label: "MY", d: I.user },
];
export const Tab = ({ active, go, unread }) => (
  <div className="tab">
    {TABS.map((t) => (
      <button key={t.id} className={active === t.id ? "on" : ""} onClick={() => go(t.id)}>
        <Icon d={t.d} size={24} color={active === t.id ? "#C2571A" : "#8B95A1"} />
        {t.label}
        {t.id === "alerts" && unread > 0 && <span className="badge">{unread}</span>}
      </button>
    ))}
  </div>
);

// 로딩 자리: 실제 레이아웃과 같은 높이의 회색 막대
export const Sk = ({ w = "100%", h = 16, r = 8, style }) => <span className="sk" style={{ width: w, height: h, borderRadius: r, ...style }} />;

export const Chip = ({ children, tone }) => <span className={`chipg ${tone || ""}`}>{children}</span>;

export const md = (iso) => { const [, m, d] = iso.split("-"); return `${+m}월 ${+d}일`; };
