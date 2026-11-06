import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { TIERS } from "../data.js";
import { Icon, I, Status, Tab, Sk, md } from "../components.jsx";
import { getShops } from "../lib/api.js";
import { useStore } from "../lib/store.jsx";

// 지도: 핀에는 평수만, 고르면 이름과 크기. 아래 시트를 위로 끌거나 '상세 보기'로 상세에 들어간다.
export function MapScreen({ nav, ui }) {
  const { state, dispatch } = useStore();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [guardOnly, setGuardOnly] = useState(false);
  const [selId, setSelId] = useState(state.shop?.id);
  const sheet = useAnimation();

  const load = () => { setErr(null); setData(null); getShops().then(setData).catch((e) => setErr(e.message)); };
  useEffect(load, []);

  const shops = (data?.shops || []).filter((s) => !guardOnly || s.guard);
  const sel = shops.find((s) => s.id === selId) || shops.find((s) => s.hero) || shops[0];
  const open = () => { if (!sel) return; dispatch({ type: "pick", shop: sel }); nav.go("detail"); };

  return (
    <div className="s mapscreen">
      <div className="maplayer">
        {shops.map((s) => {
          const on = sel && s.id === sel.id;
          return (
            <motion.button key={s.id} className={`mk ${on ? "on" : ""}`} style={{ left: `${s.x}%`, top: `${s.y}%`, zIndex: on ? 5 : 2 }}
              initial={false} animate={{ scale: on ? 1.12 : 1 }} transition={{ type: "spring", stiffness: 500, damping: 22 }}
              onClick={() => { setSelId(s.id); sheet.start({ y: [12, 0], transition: { duration: 0.25 } }); }}>
              <span className="mk-dot">{s.guard ? <Icon d={I.shield} size={13} color={on ? "#fff" : "#191F28"} w={2.4} /> : <i />}</span>
              <span className="mk-name">{s.name.replace("○○", "")}</span>
            </motion.button>
          );
        })}
        <div className="me" style={{ left: "44.3%", top: "50.3%" }} />
      </div>
      <div className="maptop" />
      <Status onSecret={ui.secret} />
      <div className="search"><Icon d={I.search} size={20} w={2.4} /><span>업장 검색</span></div>
      <div className="chips">
        <div className="chip on">헬스</div>
        <button className={`chip ${guardOnly ? "on" : ""}`} onClick={() => setGuardOnly(!guardOnly)}><Icon d={I.shield} size={14} color={guardOnly ? "#fff" : "#191F28"} />&nbsp;보장 업장만</button>
      </div>

      <motion.div className="sheet" animate={sheet} drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0.4, bottom: 0.1 }}
        onDragEnd={(_, i) => { if (i.offset.y < -50) open(); }}>
        <div className="grab" />
        {err ? (
          <div className="t14 sub" style={{ padding: "6px 0 4px" }}>{err}<button className="link" onClick={load} style={{ marginLeft: 8 }}>다시 시도</button></div>
        ) : !data ? (
          <div><Sk w="55%" h={22} /><Sk w="40%" h={14} style={{ marginTop: 10 }} /><Sk h={48} r={14} style={{ marginTop: 16 }} /></div>
        ) : !sel ? (
          <div className="t15 sub" style={{ padding: "4px 0 8px" }}>근처에 보장 업장이 없어요<button className="link" onClick={() => setGuardOnly(false)} style={{ marginLeft: 8 }}>필터 해제</button></div>
        ) : (
          <>
            <div className="row" style={{ alignItems: "flex-start" }}>
              <div>
                <div className="t20">{sel.name}</div>
                <div className="t14 ter" style={{ marginTop: 4 }}>헬스장 · {sel.dist}m · 영업 {sel.years}년째</div>
              </div>
              <span className={`chipg ${sel.tier === "small" ? "dark" : ""}`}>{TIERS[sel.tier].label} · 약 {sel.pyeong}평</span>
            </div>
            <button className="btn" style={{ width: "100%", height: 50, marginTop: 14, fontSize: 16 }} onClick={open}>상세 보기</button>
            <div className="t12 ter" style={{ marginTop: 10, textAlign: "center" }}>서울시 인허가 {data.meta.count}곳 · {md(data.meta.updatedAt)} 기준 · 상호는 가렸어요</div>
          </>
        )}
      </motion.div>
      <Tab active="map" go={nav.tab} unread={state.alerts.filter((a) => !a.read).length} />
    </div>
  );
}
