import { useEffect, useRef, useState } from "react";
import { TIERS, CHECKS, ALERT_TEXT } from "../data.js";
import { Mark, Icon, I, Status } from "../components.jsx";
import { useStore } from "../lib/store.jsx";

// 처음 설치했을 때만: 스플래시 → 소개 카드 3장 → 권한 요청. 다음부터는 Splash만 잠깐.
const SLIDES = [
  { k: "결제 전", t: "이 업장, 크기부터\n살펴봐요", s: "서울·경기 인허가 10년치로 본\n크기별 폐업 차이를 알려 드려요" },
  { k: "결제할 때", t: "세 가지만\n물어보면 돼요", s: "보증보험, 환불 기준, 할부.\n빠진 게 있으면 물어볼 말까지 챙겨 드려요" },
  { k: "결제 후", t: "바뀌면\n먼저 알려 드려요", s: "인허가가 바뀌거나 닫기 전 신호가 보이면\n바로 알림을 보내요" },
];

function Art({ i }) {
  if (i === 0) return (
    <div className="art-card">
      <div className="row"><b style={{ fontSize: 16 }}>○○피트니스 F점</b><span className="chipg">작은 편 · 약 28평</span></div>
      {Object.entries(TIERS).map(([k, v]) => (
        <div key={k} className={`tier ${k === "small" ? "mine" : ""}`}><span>{v.label}</span><div className="bar"><i className="grow" style={{ width: `${v.bar}%`, background: k === "small" ? "#191F28" : "#B0B8C1" }} /></div><b>{v.tag}</b></div>
      ))}
    </div>
  );
  if (i === 1) return (
    <div className="art-card" style={{ padding: "8px 18px" }}>
      {CHECKS.map((c, j) => (
        <div key={c.id} className="art-row" style={{ animationDelay: `${j * 0.12}s` }}>
          <div className="ok" style={j === 1 ? { background: "var(--acc-soft)", color: "var(--acc)", fontWeight: 800 } : undefined}>{j === 1 ? "?" : <Icon d={I.check} size={14} color="#191F28" w={3} />}</div>
          <div style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>{c.title}</div>
          <span className="ter" style={{ fontSize: 13 }}>{j === 1 ? "물어보기" : "확인"}</span>
        </div>
      ))}
    </div>
  );
  return (
    <div style={{ width: 300 }}>
      <div className="art-push">
        <div className="appic"><Mark size={30} /></div>
        <div style={{ flex: 1 }}>
          <div className="row" style={{ fontSize: 12 }}><b>살피다</b><span className="ter">지금</span></div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>○○피트니스 F점 · 참고 신호</div>
          <div style={{ fontSize: 12, color: "#4E5968", marginTop: 1 }}>{ALERT_TEXT.signal.title}</div>
        </div>
      </div>
      <div className="art-card" style={{ marginTop: 12, background: "#191F28", color: "#fff" }}>
        <div className="row" style={{ fontSize: 13, opacity: 0.7 }}><span>내 이용권</span><span>214일 남음</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}><span style={{ width: 10, height: 10, borderRadius: 5, background: "#fff" }} /><b style={{ fontSize: 22 }}>영업 중</b></div>
      </div>
    </div>
  );
}

export function Splash({ nav }) {
  useEffect(() => { const t = setTimeout(() => nav.tab("map"), 700); return () => clearTimeout(t); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <div className="s splash"><div className="splash-mark"><Mark size={96} /></div><div className="splash-word">살피다<span /></div></div>;
}

export function Onboarding({ nav }) {
  const { dispatch } = useStore();
  const [step, setStep] = useState("splash");
  const [i, setI] = useState(0);
  const [ask, setAsk] = useState(false);
  const [dx, setDx] = useState(0);
  const x0 = useRef(null);
  useEffect(() => { const t = setTimeout(() => setStep("slides"), 1100); return () => clearTimeout(t); }, []);

  const start = () => { dispatch({ type: "onboarded" }); nav.tab("map"); };
  const next = () => (i < SLIDES.length - 1 ? setI(i + 1) : setStep("perm"));
  const up = () => { if (dx < -50) next(); else if (dx > 50 && i > 0) setI(i - 1); x0.current = null; setDx(0); };

  if (step === "splash") return <div className="s splash"><div className="splash-mark"><Mark size={96} /></div><div className="splash-word">살피다<span /></div></div>;

  if (step === "perm") return (
    <div className="s">
      <Status />
      <div style={{ padding: "48px 24px 0" }}>
        <div className="t26">살피다를 쓰려면<br />두 가지만 허용해 주세요</div>
        {[["위치", "근처 업장을 지도에 보여 드려요", I.pin], ["알림", "이용권 업장이 바뀌면 먼저 알려 드려요", I.bell]].map(([b, s, d]) => (
          <div className="ob" key={b} style={{ marginTop: 22 }}><div className="obi"><Icon d={d} color="#C2571A" w={2.2} /></div><div><b>{b}</b><span>{s}</span></div></div>
        ))}
        <div className="t14 ter" style={{ marginTop: 28 }}>언제든 설정에서 바꿀 수 있어요</div>
      </div>
      <div className="bottom"><button className="btn acc-b" style={{ flex: 1 }} onClick={() => setAsk(true)}>허용하고 시작하기</button></div>
      {ask && (
        <div className="sys-dim">
          <div className="sys">
            <b>'살피다'에서 알림을 보내고자 합니다</b>
            <p>이용권을 등록한 업장의 인허가가 바뀌거나 참고 신호가 보이면 알려 드려요.</p>
            <div className="sys-btns"><span onClick={start}>허용 안 함</span><span style={{ fontWeight: 700 }} onClick={start}>허용</span></div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="s">
      <Status />
      <button className="skip" onClick={() => setStep("perm")}>건너뛰기</button>
      <div className="ob-view" onPointerDown={(e) => { x0.current = e.clientX; }} onPointerMove={(e) => x0.current != null && setDx(e.clientX - x0.current)} onPointerUp={up} onPointerLeave={() => x0.current != null && up()}>
        <div className="ob-track" style={{ transform: `translateX(calc(${-i * 100}% + ${dx}px))`, transition: dx ? "none" : undefined }}>
          {SLIDES.map((sl, j) => (
            <div className="ob-slide" key={sl.k}>
              <div className="ob-art">{j === i && <Art i={j} />}</div>
              <div style={{ padding: "0 28px" }}>
                <div className="t14 acc b7">{sl.k}</div>
                <div className="t26" style={{ marginTop: 8, whiteSpace: "pre-line" }}>{sl.t}</div>
                <div className="t16 sub" style={{ marginTop: 12, lineHeight: 1.55, whiteSpace: "pre-line" }}>{sl.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bottom" style={{ flexDirection: "column", gap: 18, alignItems: "center" }}>
        <div className="dots">{SLIDES.map((_, j) => <i key={j} className={j === i ? "on" : ""} />)}</div>
        <button className="btn acc-b" style={{ alignSelf: "stretch" }} onClick={next}>{i < SLIDES.length - 1 ? "다음" : "시작하기"}</button>
      </div>
    </div>
  );
}
