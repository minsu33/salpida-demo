import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SHOPS, ALERT } from "./data.js";
import { Mark } from "./ui.jsx";
import * as S from "./screens.jsx";

const KEY = "salpida-demo";
const FRESH = { answers: {}, pass: null, alert: false, unread: false };
const load = () => {
  try { return { ...FRESH, ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return FRESH; }
};

// PC에서는 폰 틀을 창 높이에 맞춰 줄인다
function useFit(ref) {
  useLayoutEffect(() => {
    const fit = () => {
      const el = ref.current;
      if (!el) return;
      const pc = window.innerWidth > 520;
      const k = pc ? Math.min(1, (window.innerHeight - 48) / 874) : 1;
      el.parentElement.style.width = pc ? `${402 * k}px` : "";
      el.parentElement.style.height = pc ? `${874 * k}px` : "";
      el.style.transform = pc ? `scale(${k})` : "";
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [ref]);
}

export default function App() {
  const [stack, setStack] = useState([{ name: "onboarding" }]);
  const [state, setState] = useState(load);
  const [shopId, setShopId] = useState("bodyfit");
  const [push, setPush] = useState(null); // null | "in" | "out"
  const [toast, setToast] = useState(null);
  const device = useRef(null);
  const timers = useRef([]);
  useFit(device);

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* 저장 못 해도 시연은 된다 */ } }, [state]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const page = stack[stack.length - 1];
  const shop = SHOPS.find((s) => s.id === shopId);
  const patch = (p) => setState((s) => ({ ...s, ...p }));
  const say = (msg) => { setToast(null); requestAnimationFrame(() => setToast({ msg, k: Date.now() })); };

  const nav = {
    go: (name) => setStack((st) => [...st, { name }]),
    back: () => setStack((st) => (st.length > 1 ? st.slice(0, -1) : st)),
    tab: (name) => setStack([{ name }]),
  };

  const actions = {
    start: () => { timers.current.forEach(clearTimeout); setState(FRESH); setShopId("bodyfit"); setPush(null); nav.tab("map"); },
    openShop: (id) => { setShopId(id); nav.go("detail"); },
    answer: (id, v) => setState((s) => ({ ...s, answers: { ...s.answers, [id]: v } })),
    copy: (text) => { navigator.clipboard?.writeText(text).catch(() => {}); say("문구를 복사했어요"); },
    // 이용권을 등록하면 살피다가 지켜보기 시작하고, 잠시 뒤 결제 후 알림이 온다 (시연용으로 시간을 줄임)
    register: () => {
      patch({ pass: { shopId }, alert: false, unread: false });
      nav.tab("pass");
      say("이제 살피다가 이 업장을 지켜볼게요");
      later(() => { patch({ alert: true, unread: true }); setPush("in"); }, 3200);
      later(() => setPush((p) => (p ? "out" : p)), 9200);
      later(() => setPush(null), 9600);
    },
    openPush: () => { setPush(null); patch({ unread: false }); nav.tab("alerts"); },
    readAlerts: () => patch({ unread: false }),
  };

  const props = { nav, actions, state, shop, setShopId };
  const View = S[page.name];
  const passShop = state.pass && SHOPS.find((s) => s.id === state.pass.shopId);

  return (
    <div className="stage">
      <div className="fit">
      <div className="device" ref={device}>
        <div className="s">
          <div className="screen" key={stack.length + page.name}><View {...props} /></div>

          {push && passShop && (
            <div className={`push ${push === "out" ? "out" : ""}`} onClick={actions.openPush}>
              <div className="appic"><Mark /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="row" style={{ fontSize: 14 }}><b>살피다</b><span className="ter" style={{ fontSize: 13 }}>지금</span></div>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 3 }}>{passShop.name} · 참고 신호</div>
                <div style={{ fontSize: 14, marginTop: 2, color: "#4E5968" }}>{ALERT.title}</div>
              </div>
            </div>
          )}
          {toast && <div className="toast" key={toast.k}>{toast.msg}</div>}
        </div>
      </div>
      </div>
    </div>
  );
}
