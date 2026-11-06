import { createContext, useContext, useEffect, useReducer } from "react";
import { PASS, SKIP_DAYS } from "../data.js";

// 앱 상태 하나: 온보딩 여부, 체크 답, 이용권, 알림. 브라우저에 저장해 다시 열어도 이어진다.
const KEY = "salpida-demo-v2";
export const FRESH = { onboarded: false, shop: null, answers: {}, pass: null, alerts: [], viewed: [], checked: 0, notify: { closed: true, change: true, signal: true } };

function load() {
  try {
    if (new URLSearchParams(location.search).has("reset")) { localStorage.removeItem(KEY); history.replaceState(null, "", location.pathname); }
    return { ...FRESH, ...JSON.parse(localStorage.getItem(KEY)) };
  } catch { return FRESH; }
}

function reducer(s, a) {
  switch (a.type) {
    case "reset": return { ...FRESH, onboarded: a.onboarded ?? false };
    case "onboarded": return { ...s, onboarded: true };
    case "pick": return { ...s, shop: a.shop, answers: s.shop?.id === a.shop.id ? s.answers : {}, viewed: [a.shop.id, ...(s.viewed || []).filter((x) => x !== a.shop.id)].slice(0, 20) };
    case "checked": return { ...s, checked: (s.checked || 0) + 1 };
    case "notify": return { ...s, notify: { ...FRESH.notify, ...s.notify, [a.key]: !(s.notify || FRESH.notify)[a.key] } };
    case "answer": return { ...s, answers: { ...s.answers, [a.id]: a.v } };
    case "register": return { ...s, pass: { shop: s.shop, daysLeft: PASS.daysLeft, paidBy: s.answers.card === "할부로" ? "할부" : "일시불" }, alerts: [] };
    case "skip": return s.pass ? { ...s, pass: { ...s.pass, daysLeft: s.pass.daysLeft - SKIP_DAYS } } : s;
    case "alert": return { ...s, alerts: [{ id: a.id || Date.now(), kind: a.kind, read: false }, ...s.alerts] };
    case "read": return { ...s, alerts: s.alerts.map((x) => (x.id === a.id || a.id === "all" ? { ...x, read: true } : x)) };
    default: return s;
  }
}

const Ctx = createContext(null);
export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* 저장 못 해도 시연은 된다 */ } }, [state]);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}
export const useStore = () => useContext(Ctx);
