import { useEffect, useRef, useState } from "react";
import { SHOPS, TIERS, CHECKS, PASS, ALERT, HISTORY, RECORD } from "./data.js";
import { Mark, Shield, Check, Status, Back, Tab } from "./ui.jsx";

const sizeLabel = (s) => `${TIERS[s.tier].label} · 약 ${s.pyeong}평`;

// 1 온보딩: 스플래시 → 가치 카드 3장 → 권한 요청
const SLIDES = [
  { k: "결제 전", t: "이 업장, 크기부터\n살펴봐요", s: "서울·경기 인허가 10년치로 본\n크기별 폐업 차이를 알려 드려요" },
  { k: "결제할 때", t: "세 가지만\n물어보면 돼요", s: "보증보험, 환불 기준, 할부.\n빠진 게 있으면 물어볼 말까지 챙겨 드려요" },
  { k: "결제 후", t: "바뀌면\n먼저 알려 드려요", s: "인허가가 바뀌거나 닫기 전 신호가 보이면\n바로 알림을 보내요" },
];

function SlideArt({ i }) {
  if (i === 0) return (
    <div className="art-card">
      <div className="row"><b style={{ fontSize: 16 }}>바디핏 OO점</b><span className="chipg">작은 편 · 약 45평</span></div>
      {Object.entries(TIERS).map(([k, v]) => (
        <div key={k} className={`tier ${k === "small" ? "mine" : ""}`}><span>{v.label}</span><div className="bar"><i className="grow" style={{ width: `${v.bar}%`, background: k === "small" ? "#C2571A" : "#B0B8C1" }} /></div><b>{v.tag}</b></div>
      ))}
    </div>
  );
  if (i === 1) return (
    <div className="art-card" style={{ padding: "8px 18px" }}>
      {CHECKS.map((c, j) => (
        <div key={c.id} className="art-row" style={{ animationDelay: `${j * 0.12}s` }}>
          <div className="ok" style={j === 1 ? { background: "var(--acc-soft)", color: "var(--acc)", fontWeight: 800 } : undefined}>{j === 1 ? "?" : <Check />}</div>
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
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>바디핏 OO점 · 참고 신호</div>
          <div style={{ fontSize: 12, color: "#4E5968", marginTop: 1 }}>{ALERT.title}</div>
        </div>
      </div>
      <div className="art-card" style={{ marginTop: 12, background: "#191F28", color: "#fff" }}>
        <div className="row" style={{ fontSize: 13, opacity: 0.7 }}><span>내 이용권</span><span>214일 남음</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}><span style={{ width: 10, height: 10, borderRadius: 5, background: "#fff" }} /><b style={{ fontSize: 22 }}>영업 중</b></div>
      </div>
    </div>
  );
}

export function onboarding({ actions }) {
  const [step, setStep] = useState("splash"); // splash | slides | perm
  const [i, setI] = useState(0);
  const [ask, setAsk] = useState(false);
  const [dx, setDx] = useState(0);
  const touch = useRef(null);
  useEffect(() => { const t = setTimeout(() => setStep("slides"), 1100); return () => clearTimeout(t); }, []);

  const next = () => (i < SLIDES.length - 1 ? setI(i + 1) : setStep("perm"));
  const onDown = (e) => { touch.current = e.clientX; };
  const onMove = (e) => { if (touch.current != null) setDx(e.clientX - touch.current); };
  const onUp = () => {
    if (dx < -50) next(); else if (dx > 50 && i > 0) setI(i - 1);
    touch.current = null; setDx(0);
  };

  if (step === "splash") return (
    <div className="s splash"><div className="splash-mark"><Mark size={96} /></div><div className="splash-word">살피다<span /></div></div>
  );

  if (step === "perm") return (
    <div className="s">
      <Status />
      <div style={{ padding: "48px 24px 0" }}>
        <div className="h1" style={{ fontSize: 28 }}>살피다를 쓰려면<br />두 가지만 허용해 주세요</div>
        {[
          ["위치", "근처 업장을 지도에 보여 드려요", <><path d="M12 2c-4 0-7 3-7 7 0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></>],
          ["알림", "이용권 업장이 바뀌면 먼저 알려 드려요", <><path d="M6 16V11a6 6 0 1112 0v5l2 2H4z" /><path d="M10 21h4" /></>],
        ].map(([b, s, d]) => (
          <div className="ob" key={b} style={{ marginTop: 22 }}><div className="obi"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C2571A" strokeWidth="2.2">{d}</svg></div><div><b>{b} <span style={{ display: "inline", color: "var(--acc)", fontSize: 13, fontWeight: 700 }}>필요</span></b><span>{s}</span></div></div>
        ))}
        <div className="ter" style={{ fontSize: 14, marginTop: 28 }}>언제든 설정에서 바꿀 수 있어요</div>
      </div>
      <div className="bottom"><div className="btn acc-b" style={{ flex: 1 }} onClick={() => setAsk(true)}>허용하고 시작하기</div></div>
      {ask && (
        <div className="sys-dim">
          <div className="sys">
            <b>'살피다'에서 알림을 보내고자 합니다</b>
            <p>이용권을 등록한 업장의 인허가가 바뀌거나 참고 신호가 보이면 알려 드려요.</p>
            <div className="sys-btns"><span onClick={actions.start}>허용 안 함</span><span style={{ fontWeight: 700 }} onClick={actions.start}>허용</span></div>
          </div>
        </div>
      )}
      <div className="home" />
    </div>
  );

  return (
    <div className="s">
      <Status />
      <div className="skip" onClick={() => setStep("perm")}>건너뛰기</div>
      <div className="ob-view" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={() => touch.current != null && onUp()}>
        <div className="ob-track" style={{ transform: `translateX(calc(${-i * 100}% + ${dx}px))`, transition: dx ? "none" : undefined }}>
          {SLIDES.map((sl, j) => (
            <div className="ob-slide" key={sl.k}>
              <div className="ob-art">{j === i && <SlideArt i={j} />}</div>
              <div style={{ padding: "0 28px" }}>
                <div className="acc" style={{ fontSize: 15, fontWeight: 700 }}>{sl.k}</div>
                <div className="h1" style={{ fontSize: 28, marginTop: 8, whiteSpace: "pre-line" }}>{sl.t}</div>
                <div className="sub" style={{ fontSize: 16, marginTop: 12, lineHeight: 1.55, whiteSpace: "pre-line" }}>{sl.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bottom" style={{ flexDirection: "column", gap: 18, alignItems: "center" }}>
        <div className="dots">{SLIDES.map((_, j) => <i key={j} className={j === i ? "on" : ""} />)}</div>
        <div className="btn acc-b" style={{ alignSelf: "stretch" }} onClick={next}>{i < SLIDES.length - 1 ? "다음" : "시작하기"}</div>
      </div>
      <div className="home" />
    </div>
  );
}

// 다시 열 때: 로고만 잠깐
export function splash({ nav }) {
  useEffect(() => { const t = setTimeout(() => nav.tab("map"), 700); return () => clearTimeout(t); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <div className="s splash"><div className="splash-mark"><Mark size={96} /></div><div className="splash-word">살피다<span /></div></div>;
}

// 2 지도: 핀을 누르면 아래 시트가 바뀌고, 시트를 누르면 업장 상세
export function map({ nav, actions, state, shop, setShopId }) {
  const [guardOnly, setGuardOnly] = useState(false);
  const shops = SHOPS.filter((s) => !guardOnly || s.guard);
  const sel = shops.find((s) => s.id === shop.id) || shops[0];
  return (
    <div className="s">
      <div className="map" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 120, background: "linear-gradient(#fff 35%,rgba(255,255,255,0))", zIndex: 2 }} />
      <Status />
      <div className="search"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#191F28" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg><span>업장 검색</span></div>
      <div className="chips">
        <div className="chip on">헬스</div>
        <div className={`chip guard ${guardOnly ? "on" : ""}`} onClick={() => setGuardOnly(!guardOnly)}><Shield size={14} color={guardOnly ? "#fff" : "#C2571A"} />&nbsp;보장 업장</div>
        <div className="chip" style={{ opacity: 0.55 }}>필라테스 준비 중</div>
      </div>
      {shops.map((s) => (
        <div key={s.id} className={`pin ${s.id === sel.id ? "sel" : ""}`} style={{ left: s.x, top: s.y }} onClick={() => setShopId(s.id)}>
          <b>{s.guard && <span className="g"><Shield size={12} color={s.id === sel.id ? "#fff" : "#C2571A"} /></span>}{s.name}</b>
        </div>
      ))}
      <div className="dot" style={{ left: 330, top: 300 }} /><div className="dot" style={{ left: 60, top: 325 }} /><div className="dot" style={{ left: 290, top: 420 }} />
      <div className="me" style={{ left: 178, top: 440 }} />
      <div className="sheet" onClick={() => actions.openShop(sel.id)}>
        <div className="grab" />
        <div className="row">
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{sel.name}</div>
            <div className="ter" style={{ fontSize: 14, marginTop: 4 }}>헬스장 · {sel.dist} · 영업 {sel.years}년째</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
            <span className="chipg">{sizeLabel(sel)}</span>
            {sel.guard && <span className="chipg" style={{ background: "var(--acc-soft)", color: "var(--acc)", gap: 4 }}><Shield size={12} color="#C2571A" />보장 업장</span>}
          </div>
        </div>
      </div>
      <Tab active="map" go={nav.tab} unread={state.unread} />
      <div className="home" />
    </div>
  );
}

// 3 업장 상세 (결제 전)
export function detail({ nav, shop }) {
  const t = TIERS[shop.tier];
  return (
    <div className="s">
      <div className="scroll">
        <Status /><Back onBack={nav.back} />
        <div style={{ padding: "2px 20px 0" }}>
          <div className="h1">{shop.name}</div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
            <span className="chipg">{sizeLabel(shop)}</span>
            {shop.guard && <span className="chipg" style={{ background: "var(--acc)", color: "#fff", gap: 4 }}><Shield size={12} />보장 업장</span>}
            <span className="ter" style={{ fontSize: 14 }}>헬스장 · 영업 {shop.years}년째</span>
          </div>
        </div>
        <div className="act">
          <div style={{ fontSize: 17, fontWeight: 700 }}>결제 전에 이것만 챙기세요</div>
          <ul style={{ marginTop: 8 }}><li><i>1</i>보증보험 들었는지 묻기</li><li><i>2</i>환불 기준서 받기</li><li><i>3</i>3개월 이상 카드 할부로</li></ul>
          <div className="btn acc-b" style={{ height: 50, marginTop: 12, fontSize: 16 }} onClick={() => nav.go("check")}>결제 전 체크 시작</div>
        </div>
        <div style={{ margin: "26px 20px 0" }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>왜 챙겨야 하나요</div>
          <div className="sub" style={{ fontSize: 14, marginTop: 6, lineHeight: 1.5 }}>{t.note}</div>
          {Object.entries(TIERS).map(([k, v]) => (
            <div key={k} className={`tier ${k === shop.tier ? "mine" : ""}`}>
              <span>{v.label}</span>
              <div className="bar"><i style={{ width: `${v.bar}%`, background: k === shop.tier ? "#191F28" : "#B0B8C1" }} /></div>
              <b>{v.tag}</b>
            </div>
          ))}
          <div className="sub" style={{ fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>서울·경기 인허가 10년치 분석 기준이에요. 크기 말고는 가려낼 기준이 아직 없어요. 이 업장에 대한 예측이 아니에요.</div>
        </div>
        <div className="info" style={{ marginTop: 14 }}>
          <div className="r"><span>상태</span><span>영업 중 · 인허가 {shop.checkedAt} 확인</span></div>
          <div className="r"><span>보장</span><span>{shop.guard ? "닫아도 남은 이용료 환급" : "보장 업장 아님"}</span></div>
        </div>
      </div>
      <div className="home" />
    </div>
  );
}

// 4 결제 전 체크 (결제할 때): 카운터에서 물어보고 들은 대로 고른다
const ICONS = {
  shield: <><path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z" /><path d="M9 12l2 2 4-4" /></>,
  doc: <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M10 13h6M10 17h4" /></>,
  card: <><rect x="3" y="6" width="18" height="13" rx="3" /><path d="M3 10h18" /></>,
};
export function check({ nav, actions, state, shop }) {
  const done = CHECKS.every((c) => state.answers[c.id]);
  return (
    <div className="s">
      <div className="scroll">
        <Status /><Back onBack={nav.back} />
        <div style={{ padding: "4px 20px 22px" }}>
          <div className="h1">결제하기 전에<br />카운터에서 물어보세요</div>
          <div className="sub" style={{ fontSize: 15, marginTop: 8, lineHeight: 1.5 }}>{shop.name}에 묻고, 들은 대로 골라 주세요</div>
        </div>
        {CHECKS.map((c, i) => (
          <div className="q" key={c.id}>
            <div className="t">
              <div className="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#191F28" strokeWidth="2" strokeLinejoin="round">{ICONS[c.icon]}</svg></div>
              <div style={{ paddingTop: 1 }}><div className="acc" style={{ fontSize: 13, fontWeight: 700 }}>질문 {i + 1}</div><div style={{ fontSize: 17, fontWeight: 700, marginTop: 2 }}>{c.q}</div><div className="ter" style={{ fontSize: 13, marginTop: 4, lineHeight: 1.45 }}>{c.sub}</div></div>
            </div>
            <div className="seg2">
              {c.opts.map((v) => (
                <span key={v} className={state.answers[c.id] === v ? "on" : ""} onClick={() => actions.answer(c.id, v)}>{state.answers[c.id] === v && <Check />}{v}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="bottom"><div className={`btn ${done ? "" : "off"}`} style={{ flex: 1 }} onClick={() => nav.go("result")}>{done ? "결과 보기" : "세 가지를 골라 주세요"}</div></div>
      <div className="home" />
    </div>
  );
}

// 5 체크 결과: 답에 따라 문구가 바뀐다
export function result({ nav, actions, state, shop }) {
  const ok = CHECKS.filter((c) => state.answers[c.id] === c.opts[0]);
  const todo = CHECKS.filter((c) => state.answers[c.id] !== c.opts[0]);
  const head = todo.length === 0 ? "세 가지 모두 됐어요" : ok.length === 0 ? `${todo.length}개를 챙기고 결제하세요` : `${ok.length}개는 됐고,\n${todo.length}개만 챙기면 돼요`;
  return (
    <div className="s">
      <div className="scroll">
        <Status /><Back onBack={nav.back} />
        <div style={{ padding: "4px 20px 22px" }}><div className="h1" style={{ whiteSpace: "pre-line" }}>{head}</div></div>
        <div className="res">
          {ok.map((c) => (
            <div className="r" key={c.id}><div className="ok"><Check /></div><div style={{ flex: 1, fontSize: 16, fontWeight: 500 }}>{c.title}</div><span className="ter" style={{ fontSize: 14 }}>확인</span></div>
          ))}
          {todo.map((c) => (
            <div className="r" key={c.id} style={{ alignItems: "flex-start" }}>
              <div className="ok" style={{ background: "var(--acc-soft)", color: "var(--acc)", fontWeight: 800, fontSize: 15 }}>?</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{c.title}</div>
                <div className="sub" style={{ fontSize: 14, marginTop: 4 }}>결제 전에 이렇게 물어보세요</div>
                <div style={{ marginTop: 10, padding: 14, borderRadius: 12, background: "var(--card)", fontSize: 14, lineHeight: 1.5 }}>"{c.ask}"</div>
                <div style={{ marginTop: 10, fontSize: 14, fontWeight: 600, color: "var(--acc)", cursor: "pointer" }} onClick={() => actions.copy(c.ask)}>문구 복사</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bottom">
        {shop.guard
          ? <div className="btn acc-b" style={{ flex: 1 }} onClick={() => nav.go("guard")}>보장 업장 확인하기</div>
          : <div className="btn" style={{ flex: 1 }} onClick={actions.register}>이용권 등록하고 지켜보기</div>}
      </div>
      <div className="home" />
    </div>
  );
}

// 6 보장 업장: 보장료는 업장이, 소비자는 0원
export function guard({ nav, actions, shop }) {
  return (
    <div className="s">
      <div className="scroll">
        <Status /><Back onBack={nav.back} />
        <div style={{ padding: "4px 20px 0" }}>
          <div style={{ display: "flex", gap: 6 }}><span className="chipg">{shop.name}</span><span className="chipg" style={{ background: "var(--acc)", color: "#fff", gap: 4 }}><Shield size={13} />보장 업장</span></div>
          <div className="h1" style={{ marginTop: 12 }}>문을 닫아도<br />남은 돈을 돌려받아요</div>
          <div className="sub" style={{ fontSize: 15, marginTop: 8 }}>이 업장은 폐업 보장에 가입했어요</div>
        </div>
        <div className="key" style={{ background: "var(--acc-soft)" }}>
          <div className="sub" style={{ fontSize: 14, fontWeight: 600 }}>내가 더 내는 돈</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}><span style={{ fontSize: 40, fontWeight: 800, letterSpacing: -0.8 }}>0원</span><span className="acc" style={{ fontSize: 16, fontWeight: 700 }}>보장료는 업장이 내요</span></div>
          <div style={{ fontSize: 14, marginTop: 8, color: "var(--sub)", lineHeight: 1.5 }}>업장이 문을 닫으면 남은 기간 이용료를<br />보증보험사가 돌려줘요</div>
        </div>
        <div className="info">
          <div className="r"><span>보장하는 곳</span><span>OO보증보험</span></div>
          <div className="r"><span>보장 기간</span><span>이용권 끝날 때까지</span></div>
          <div className="r"><span>업장 크기</span><span>{sizeLabel(shop)}</span></div>
          <div className="r"><span>살피다는</span><span>가입만 이어 줘요</span></div>
        </div>
      </div>
      <div className="bottom"><div className="btn acc-b" style={{ flex: 1 }} onClick={actions.register}>이용권 등록하고 지켜보기</div></div>
      <div className="home" />
    </div>
  );
}

// 7 내 이용권 (결제 후)
export function pass({ nav, state }) {
  const [watch, setWatch] = useState({ close: true, change: true, signal: true });
  const s = state.pass && SHOPS.find((x) => x.id === state.pass.shopId);
  const Toggle = ({ k, label }) => <div className="r"><div style={{ fontSize: 16, fontWeight: 500 }}>{label}</div><div className={`tg ${watch[k] ? "" : "off"}`} style={{ cursor: "pointer" }} onClick={() => setWatch({ ...watch, [k]: !watch[k] })} /></div>;
  return (
    <div className="s">
      <div className="scroll">
        <Status />
        <div style={{ padding: "14px 20px 0" }} className="h1">내 이용권</div>
        {!s ? (
          <div style={{ margin: "60px 20px", textAlign: "center" }}>
            <div className="sub" style={{ fontSize: 16 }}>등록한 이용권이 없어요</div>
            <div className="btn" style={{ marginTop: 20 }} onClick={() => nav.tab("map")}>지도에서 업장 찾기</div>
          </div>
        ) : (
          <>
            <div className="pass">
              <div className="row"><div style={{ fontSize: 18, fontWeight: 700 }}>{s.name}</div><span style={{ fontSize: 13, opacity: 0.6 }}>{PASS.name} · {PASS.daysLeft}일 남음</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 26 }}><span style={{ width: 12, height: 12, borderRadius: 6, background: "#fff" }} /><span style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.6 }}>영업 중</span></div>
              <div style={{ fontSize: 14, opacity: 0.65, marginTop: 6 }}>인허가 기준 · {s.checkedAt} 확인{s.guard ? " · 보장 업장" : ""}</div>
              <div className="p" style={{ marginBottom: 0 }}><i /></div>
            </div>
            <div className="watch">
              <div className="rowlink" onClick={() => nav.go("record")}><span>업장 기록 보기</span><span className="ter">기록 {RECORD.months}개월째 ›</span></div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 22 }}>이럴 때 알려 드려요</div>
              <div className="ter" style={{ fontSize: 14, margin: "4px 0 6px" }}>주 1회 서울·경기 인허가와 업장 기록을 비교해요</div>
              <Toggle k="close" label="폐업·휴업 등록" />
              <Toggle k="change" label="면적·대표자 변경" />
              <Toggle k="signal" label="참고 신호 (글 끊김 등)" />
            </div>
          </>
        )}
      </div>
      <Tab active="pass" go={nav.tab} unread={state.unread} />
      <div className="home" />
    </div>
  );
}

// 8 알림
export function alerts({ nav, actions, state }) {
  const s = state.pass && SHOPS.find((x) => x.id === state.pass.shopId);
  useEffect(() => { if (state.unread) actions.readAlerts(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="s">
      <div className="scroll">
        <Status />
        <div style={{ padding: "14px 20px 0" }} className="h1">알림</div>
        {state.alert && s && (
          <div style={{ margin: "18px 20px 0", padding: 20, borderRadius: 20, background: "var(--acc-soft)" }}>
            <span className="chipg" style={{ background: "#fff", color: "var(--acc)" }}>참고 신호</span>
            <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.4, marginTop: 12 }}>{s.name} {ALERT.title}</div>
            <div className="sub" style={{ fontSize: 14, lineHeight: 1.55, marginTop: 8 }}>{ALERT.body}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <div className="btn ghost" style={{ flex: 1, height: 46, fontSize: 15, background: "#fff" }} onClick={() => nav.tab("pass")}>남은 기간 보기</div>
              <div className="btn acc-b" style={{ flex: 1, height: 46, fontSize: 15 }} onClick={() => nav.go("record")}>업장 기록 보기</div>
            </div>
          </div>
        )}
        <div style={{ margin: "26px 20px 0", fontSize: 15, fontWeight: 700, color: "var(--sub)" }}>지난 알림</div>
        <div style={{ margin: "0 20px" }}>
          {s ? HISTORY.map((h) => <div className="ti" key={h.m}><div className="m">{h.m}</div><div><b>{h.t}</b><span>{h.s}</span></div></div>)
            : <div className="sub" style={{ fontSize: 15, padding: "16px 0" }}>이용권을 등록하면 여기에 알림이 와요</div>}
          {s && <div className="ti"><div className="m">오늘</div><div><b>이용권을 등록했어요</b><span>{PASS.name} · {s.guard ? "보장 업장" : "보장 없음"}</span></div></div>}
        </div>
      </div>
      <Tab active="alerts" go={nav.tab} unread={false} />
      <div className="home" />
    </div>
  );
}

// 9 업장 기록: 쓸수록 쌓이는 데이터
export function record({ nav, state }) {
  const s = (state.pass && SHOPS.find((x) => x.id === state.pass.shopId)) || SHOPS[0];
  return (
    <div className="s">
      <div className="scroll">
        <Status /><Back onBack={nav.back} />
        <div style={{ padding: "4px 20px 0" }}>
          <div className="h1">{s.name} 기록</div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}><span className="chipg">영업 중</span><span className="chipg">기록 {RECORD.months}개월째</span></div>
        </div>
        <div className="key" style={{ marginTop: 18 }}>
          <div className="row"><b style={{ fontSize: 15 }}>사장님 글</b><span className="ter" style={{ fontSize: 13 }}>월별</span></div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 7, height: 96, marginTop: 14 }}>
            {RECORD.posts.map((v, i) => <i key={i} style={{ flex: 1, height: v ? `${v}%` : 4, background: v ? "#B0B8C1" : "var(--acc)", borderRadius: v ? 4 : 2 }} />)}
          </div>
          <div className="row ter" style={{ fontSize: 12, marginTop: 6 }}><span>12월</span><span className="acc" style={{ fontWeight: 700 }}>최근 3개월 0건</span></div>
        </div>
        <div style={{ margin: "22px 20px 0" }}>
          {RECORD.log.map((l) => <div className="ti" key={l.m}><div className="d" style={l.hot ? { background: "var(--acc)" } : undefined} /><div className="m">{l.m}</div><div><b>{l.t}</b><span>{l.s}</span></div></div>)}
        </div>
        <div className="sub" style={{ margin: "18px 20px 0", fontSize: 13, lineHeight: 1.5 }}>영업 중인 업장의 기록을 매달 쌓아요. 나중에 문 닫은 업장이 생기면, 닫기 전 기록에서 공통점을 다시 찾아요.</div>
      </div>
      <div className="home" />
    </div>
  );
}
