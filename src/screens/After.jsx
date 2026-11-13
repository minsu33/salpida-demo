import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PASS, ALERT_TEXT, RECORD, won, remain, canObject, refundIfQuit } from "../data.js";
import { Icon, I, Status, Back, Tab, Mark, md } from "../components.jsx";
import { useStore } from "../lib/store.jsx";

// 토스처럼: 돌려받는 돈이 0에서 올라가며 보인다
function CountUp({ to }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf; const t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / 700); setV(to * (1 - Math.pow(1 - k, 3))); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{Math.round(v / 1e4)}만 원</>;
}

const unreadOf = (s) => s.alerts.filter((a) => !a.read).length;

// 내 이용권: 이용권 카드 + 소식(참고 신호·폐업 등록). 알림 탭을 따로 두지 않는다
export function Pass({ nav, ui }) {
  const { state, dispatch } = useStore();
  const p = state.pass;
  const closed = state.alerts.some((a) => a.kind === "closed");
  const es = p?.pay?.method === "안심결제";
  const open = (a) => { dispatch({ type: "read", id: a.id }); nav.go("alert", { id: a.id }); };
  const left = p ? won(remain(p.daysLeft, p.pay?.amount)) : "";
  return (
    <div className="s">
      <div className="scroll">
        <Status onSecret={ui.secret} />
        <div className="pad t26" style={{ paddingTop: 14 }}>내 이용권</div>
        {!p ? (
          <div className="empty"><Mark size={56} /><b>이용권이 없어요</b><button className="btn" onClick={() => nav.tab("map")}>업장 찾기</button></div>
        ) : (
          <>
            <div className="pass">
              <div className="row"><div className="t18 b7">{p.shop.name}</div><span className="t13" style={{ opacity: 0.6 }}>{PASS.name}</span></div>
              <div className="pstate"><i style={{ background: closed ? "#FF8A65" : "#3DD68C" }} />{closed ? "폐업 등록됨" : "영업 중"}</div>
              <div className="p"><i style={{ width: `${(100 * p.daysLeft) / PASS.days}%`, background: closed ? "#5B616B" : undefined }} /></div>
              <div className="row t14" style={{ opacity: 0.8 }}>{closed ? <><span>이용 중단</span><span>{es ? `환불 ${left}` : `남은 이용료 ${left}`}</span></> : <><span>{p.daysLeft}일 남음</span><span>남은 이용료 {left}</span></>}</div>
              <div className="pguard">
                <Icon d={es || canObject(p.pay) || p.shop.protect === "insurance" ? I.shield : I.info} size={18} color="#fff" w={2.1} />
                {es ? (closed ? `${left} 전액 환불 중` : "닫히면 전액 환불") : p.shop.protect === "insurance" ? "닫히면 보증보험 환급" : canObject(p.pay) ? "닫히면 할부 멈춤 가능" : "보장 없음"}
              </div>
            </div>
            <div className="pad paid">
              <span>{won(p.pay?.amount || PASS.price)} · {es ? "안심결제" : "일반 결제"} · {p.pay?.months ? `${p.pay.months}개월 할부` : "일시불"}</span>
              <span>{p.pay?.date ? md(p.pay.date) : ""}</span>
            </div>
            <div className="pad" style={{ marginTop: 10 }}><button className="rowlink" onClick={() => nav.go("record")}><span>업장 기록</span><Icon d={I.arrow} size={18} color="#B0B8C1" /></button></div>
            {state.alerts.length > 0 && (
              <div className="pad" style={{ marginTop: 28 }}>
                <div className="t18 b7">소식</div>
                {state.alerts.map((a) => {
                  const t = ALERT_TEXT[a.kind];
                  return (
                    <motion.button key={a.id} className="feed" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} onClick={() => open(a)}>
                      <span className={`fdot ${a.kind} ${a.read ? "" : "new"}`} />
                      <div><em className={a.kind}>{t.tag}</em><b>{t.title}</b>{a.kind === "closed" && es && <span>남은 {left} 전액 환불</span>}</div>
                      <Icon d={I.arrow} size={20} color="#B0B8C1" />
                    </motion.button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
      <Tab active="pass" go={nav.tab} unread={unreadOf(state)} />
    </div>
  );
}

// 알림 상세: 경고 한 줄 + 지금 할 일
export function Alert({ nav, ui, params }) {
  const { state } = useStore();
  const a = state.alerts.find((x) => x.id === params.id) || state.alerts[0];
  const p = state.pass;
  if (!a || !p) return <div className="s"><Status /><Back onBack={nav.back} /></div>;
  const t = ALERT_TEXT[a.kind];
  const left = won(remain(p.daysLeft, p.pay?.amount));
  const es = p.pay?.method === "안심결제";
  const todos = a.kind === "signal" ? es ? [
    { t: "그대로 둬도 돼요", s: `닫혀도 남은 ${left} 전액 환불` },
  ] : [
    { t: "남은 돈", s: `약 ${left}` },
    { t: `닫기 전에 해지하면 약 ${won(refundIfQuit(p.pay?.amount || PASS.price, PASS.days - p.daysLeft))}`, s: "위약금 10%를 뺀 금액", act: "계산 보기", fn: () => ui.toast("쓴 기간 이용료와 위약금 10%를 뺀 금액이에요") },
    { t: canObject(p.pay) ? "할부라 안심" : "영수증 챙기기", s: canObject(p.pay) ? "닫으면 할부 멈춤 가능" : "피해구제에 필요", act: "자세히", fn: () => ui.toast("20만 원 이상, 3개월 이상 할부면 남은 할부를 멈출 수 있어요") },
  ] : [
    canObject(p.pay) && { t: "카드사에 할부 멈춤 요청", s: canObject(p.pay) ? `${p.pay.months}개월 할부 · 할부거래법` : "대상 아님 · 건너뛰기", act: "요청 문구 복사", fn: () => ui.copy(`${p.shop.name}이 폐업해 이용권을 쓸 수 없게 되어, 남은 할부금 지급 거절(항변권)을 요청합니다.`) },
    p.shop.protect === "insurance" && { t: p.shop.protect === "insurance" ? "보증보험 환급 청구" : "보증보험 없음", s: p.shop.protect === "insurance" ? `약 ${left}` : "3번으로", act: p.shop.protect === "insurance" ? "청구 안내" : "다음", fn: () => ui.toast(p.shop.protect === "insurance" ? "OO보증보험 청구 화면으로 이어져요 (시연)" : "소비자원 피해구제로 넘어가요") },
    { t: "소비자원 피해구제 신청", s: "1372 · 영수증 준비", act: "안내 보기", fn: () => ui.toast("1372 소비자상담센터로 연결돼요 (시연)") },
  ].filter(Boolean);
  const half = Math.round(remain(p.daysLeft, p.pay?.amount) / 1e4) / 2;
  return (
    <div className="s">
      <div className="scroll">
        <Status /><Back onBack={nav.back} />
        <div className="pad">
          <span className={`tagc ${a.kind}`}>{t.tag}</span>
          <div className="t26" style={{ marginTop: 12 }}>{p.shop.name}<br />{t.title}</div>
          <div className="t15 sub" style={{ marginTop: 10, lineHeight: 1.55 }}>{a.kind === "closed" && es ? "따로 신청하지 않아도 돼요." : t.body}</div>
        </div>
        {a.kind === "closed" && p.pay?.method === "안심결제" ? (
          <motion.div className="refund" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <span>돌려받는 돈</span>
            <b><CountUp to={remain(p.daysLeft, p.pay?.amount)} /></b>
            <div className="rbar full"><i /><i /></div>
            <div className="rsplit">
              <div className="h"><i /><span>보관금 {half}만 원</span></div>
              <div className="h2"><i /><span>보험금 {half}만 원</span></div>
            </div>
            <div className="rsteps">{["폐업 확인", "보관금 환불", "보험금 지급"].map((x, i) => <div key={x} className={i < 2 ? "done" : "now"}><i>{i < 2 ? "✓" : ""}</i>{x}</div>)}</div>
          </motion.div>
        ) : (<>
        {a.kind === "signal" && (
          <div className="key sig" style={{ marginTop: 20, cursor: "pointer" }} onClick={() => nav.go("record")}>
            <div className="row"><b className="t15">사장님 글</b><span className="t13 acc b7">최근 3개월 0건</span></div>
            <div className="bars">
              {RECORD.posts.map((v, i) => <motion.i key={i} className={v ? "" : "zero"} initial={{ height: 0 }} animate={{ height: v ? `${v}%` : 10 }} transition={{ delay: 0.03 * i, duration: 0.4 }} />)}
            </div>
            <div className="row t12 ter" style={{ marginTop: 6 }}><span>1년 전</span><span>지금</span></div>
          </div>
        )}
        <div className="pad" style={{ marginTop: 26 }}>
          <div className="t18 b7">지금 할 일</div>
          {todos.map((x, i) => (
            <motion.div key={x.t} className="todo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }}>
              {a.kind !== "signal" && <i>{i + 1}</i>}
              <div style={{ flex: 1 }}><b>{x.t}</b><span>{x.s}</span></div>
              {x.act && <button className="actbtn" onClick={x.fn}>{x.act}</button>}
            </motion.div>
          ))}
        </div>
        </>)}
      </div>
    </div>
  );
}

// 업장 기록: 쓸수록 쌓이는 데이터
export function Record({ nav }) {
  const { state } = useStore();
  const s = state.pass?.shop || state.shop;
  const closedRec = state.alerts?.some((x) => x.kind === "closed");
  return (
    <div className="s">
      <div className="scroll">
        <Status /><Back onBack={nav.back} />
        <div className="pad">
          <div className="t26">{s?.name} 기록</div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}><span className="chipg" style={closedRec ? { background: "#FFF1EF", color: "#F04452" } : undefined}>{closedRec ? "폐업 등록됨" : "영업 중"}</span><span className="chipg">기록 14개월째</span></div>
        </div>
        <div className="key" style={{ marginTop: 18 }}>
          <div className="row"><b className="t15">사장님 글</b><span className="t13 ter">월별</span></div>
          <div className="bars">
            {RECORD.posts.map((v, i) => <motion.i key={i} className={v ? "" : "zero"} initial={{ height: 0 }} animate={{ height: v ? `${v}%` : 10 }} transition={{ delay: 0.03 * i, duration: 0.4 }} />)}
          </div>
          <div className="row t12 ter" style={{ marginTop: 6 }}><span>1년 전</span><span className="acc b7">최근 3개월 0건</span></div>
        </div>
        <div className="pad" style={{ marginTop: 14 }}>
          {(closedRec ? [{ m: "2월", t: "인허가에 폐업 등록", s: "남은 이용료 전액 환불", hot: true }, ...RECORD.log] : RECORD.log).map((l) => <div className="ti" key={l.m + l.t}><div className="d" style={l.hot ? { background: "var(--acc)" } : undefined} /><div className="m">{l.m}</div><div><b>{l.t}</b><span>{l.s}</span></div></div>)}
        </div>
              </div>
    </div>
  );
}
