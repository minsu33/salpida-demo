import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ALERT_TEXT } from "./data.js";
import { Mark } from "./components.jsx";
import { StoreProvider, useStore } from "./lib/store.jsx";
import { useStackNav } from "./lib/nav.js";
import { Onboarding, Splash } from "./screens/Onboarding.jsx";
import { MapScreen, List } from "./screens/Map.jsx";
import { Detail } from "./screens/Detail.jsx";
import { Check, Result, Counter } from "./screens/Check.jsx";
import { Pass, Alerts, Alert, Record } from "./screens/After.jsx";
import { My } from "./screens/My.jsx";

const SCREENS = { onboarding: Onboarding, splash: Splash, map: MapScreen, list: List, detail: Detail, check: Check, result: Result, counter: Counter, pass: Pass, alerts: Alerts, alert: Alert, record: Record, my: My };

// 들어갈 때는 오른쪽에서, 뒤로 갈 때는 반대로, 탭 이동은 페이드
const slide = {
  enter: (d) => (d === 0 ? { opacity: 0, x: 0, zIndex: 1 } : d > 0 ? { x: "100%", zIndex: 2 } : { x: "-25%", zIndex: 0 }),
  center: { x: 0, opacity: 1, transition: { type: "tween", ease: [0.2, 0.8, 0.2, 1], duration: 0.34 } },
  exit: (d) => (d === 0 ? { opacity: 0, transition: { duration: 0.15 } } : d > 0 ? { x: "-25%", zIndex: 0, transition: { duration: 0.34 } } : { x: "100%", zIndex: 2, transition: { duration: 0.3 } }),
};

// PC에서는 폰 틀을 창 높이에 맞춰 줄인다
function useFit(ref) {
  useLayoutEffect(() => {
    const fit = () => {
      const el = ref.current; if (!el) return;
      const pc = window.innerWidth > 520; const k = pc ? Math.min(1, (window.innerHeight - 48) / 874) : 1;
      el.parentElement.style.width = pc ? `${402 * k}px` : ""; el.parentElement.style.height = pc ? `${874 * k}px` : "";
      el.style.transform = pc ? `scale(${k})` : "";
    };
    fit(); window.addEventListener("resize", fit); return () => window.removeEventListener("resize", fit);
  }, [ref]);
}

function Shell() {
  const { state, dispatch } = useStore();
  const nav = useStackNav(state.onboarded ? "splash" : "onboarding");
  const [push, setPush] = useState(null);
  const [toast, setToast] = useState(null);
  const [skip, setSkip] = useState(false);
  const [panel, setPanel] = useState(false);
  const device = useRef(null);
  const timers = useRef([]);
  const taps = useRef([]);
  useFit(device);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const say = (msg) => setToast({ msg, k: Date.now() });
  const sendAlert = (kind) => {
    const id = Date.now();
    dispatch({ type: "alert", kind, id }); setPush({ kind, id });
    later(() => setPush(null), 6500);
  };
  // 시연용으로 3개월을 몇 초로 줄인다: 등록 → '3개월 뒤' → 참고 신호 알림
  const timeSkip = () => {
    setSkip(true);
    later(() => dispatch({ type: "skip" }), 700);
    later(() => { setSkip(false); sendAlert("signal"); }, 1700);
  };

  const ui = {
    toast: say,
    copy: (text) => { navigator.clipboard?.writeText(text).catch(() => {}); say("문구를 복사했어요"); },
    registered: () => { clear(); nav.tab("pass"); say("이제 살피다가 이 업장을 지켜볼게요"); later(timeSkip, 2600); },
    // 상태바를 빠르게 세 번 누르면 시연 메뉴가 열린다 (홈 화면 앱에서도 동작)
    secret: () => { const t = Date.now(); taps.current = [...taps.current.filter((x) => t - x < 700), t]; if (taps.current.length >= 3) { taps.current = []; setPanel(true); } },
  };

  const demo = {
    restart: () => { clear(); setPush(null); dispatch({ type: "reset", onboarded: false }); nav.tab("onboarding"); },
    fromMap: () => { clear(); setPush(null); dispatch({ type: "reset", onboarded: true }); nav.tab("map"); },
    signal: () => { if (!state.pass) return say("먼저 이용권을 등록하세요"); timeSkip(); },
    closed: () => { if (!state.pass) return say("먼저 이용권을 등록하세요"); sendAlert("closed"); },
  };

  const openPush = () => { const p = push; setPush(null); dispatch({ type: "read", id: "all" }); nav.tab("alerts"); later(() => nav.go("alert", { id: p.id }), 60); };
  const View = SCREENS[nav.page.name];
  const pushShop = state.pass?.shop;

  return (
    <div className="stage">
      <div className="fit">
        <div className="device" ref={device}>
          <div className="s">
            <AnimatePresence initial={false} custom={nav.dir}>
              <motion.div key={nav.depth + nav.page.name} className="screen" custom={nav.dir} variants={slide} initial="enter" animate="center" exit="exit">
                <View nav={nav} ui={ui} params={nav.page.params} />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {push && pushShop && (
                <motion.div className="push" key={push.id} onClick={openPush} drag="y" dragConstraints={{ top: 0, bottom: 0 }} onDragEnd={(_, i) => i.offset.y < -30 && setPush(null)}
                  initial={{ y: -140 }} animate={{ y: 0, transition: { type: "spring", stiffness: 380, damping: 26 } }} exit={{ y: -160, transition: { duration: 0.25 } }}>
                  <div className="appic"><Mark size={30} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="row t14"><b>살피다</b><span className="ter t13">지금</span></div>
                    <div className="t15 b7" style={{ marginTop: 3 }}>{pushShop.name} · {ALERT_TEXT[push.kind].tag}</div>
                    <div className="t14 sub" style={{ marginTop: 2 }}>{ALERT_TEXT[push.kind].title}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {skip && (
                <motion.div className="skipper" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.15 } }}>3개월 뒤</motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {toast && <div className="toast" key={toast.k}>{toast.msg}</div>}

            <AnimatePresence>
              {panel && (
                <motion.div className="sys-dim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPanel(false)}>
                  <motion.div className="demo" initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} onClick={(e) => e.stopPropagation()}>
                    <b>시연 메뉴</b>
                    {[["처음 설치한 상태로", demo.restart], ["지도부터 다시 시작", demo.fromMap], ["3개월 뒤 · 참고 신호 알림", demo.signal], ["폐업 등록 알림 보내기", demo.closed]].map(([t, fn]) => (
                      <button key={t} onClick={() => { setPanel(false); fn(); }}>{t}</button>
                    ))}
                    <button className="ter" onClick={() => setPanel(false)}>닫기</button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return <StoreProvider><Shell /></StoreProvider>;
}
