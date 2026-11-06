import { motion } from "framer-motion";
import { PASS, PROTECT, ALERT_TEXT, RECORD, won, remain, held, canObject } from "../data.js";
import { Icon, I, Status, Back, Tab, Mark, md } from "../components.jsx";
import { useStore } from "../lib/store.jsx";

const unreadOf = (s) => s.alerts.filter((a) => !a.read).length;

// 내 이용권 (결제 후)
export function Pass({ nav, ui }) {
  const { state } = useStore();
  const p = state.pass;
  const closed = state.alerts.some((a) => a.kind === "closed");
  return (
    <div className="s">
      <div className="scroll">
        <Status onSecret={ui.secret} />
        <div className="pad t26" style={{ paddingTop: 14 }}>내 이용권</div>
        {!p ? (
          <div className="empty"><Mark size={56} /><b>등록한 이용권이 없어요</b><span>등록하면 폐업을 지켜봐요</span><button className="btn" onClick={() => nav.tab("map")}>지도에서 업장 찾기</button></div>
        ) : (
          <>
            <div className="pass">
              <div className="row"><div className="t18 b7">{p.shop.name}</div><span className="t13" style={{ opacity: 0.6 }}>{PASS.name}</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 22 }}>
                <span style={{ width: 12, height: 12, borderRadius: 6, background: closed ? "#FF8A65" : "#fff" }} />
                <span className="t26" style={{ color: "#fff" }}>{closed ? "폐업 등록됨" : "영업 중"}</span>
              </div>
              <div className="t14" style={{ opacity: 0.65, marginTop: 6 }}>영업 상태 주 1회 확인</div>
              <div className="p"><i style={{ width: `${(100 * p.daysLeft) / PASS.days}%` }} /></div>
              <div className="row t14" style={{ opacity: 0.8 }}><span>{p.daysLeft}일 남음</span><span>이용권 남은 값 {won(remain(p.daysLeft))}</span></div>
            </div>
            <div className="proof">
              <div className="row"><b className="t16">결제 기록</b><span className="t13 ter">환불 신청에 쓰는 기록</span></div>
              <div className="t15" style={{ marginTop: 10 }}>{won(p.pay?.amount || PASS.price)} · {p.pay?.method || "일시불"}{p.pay?.months ? ` · ${p.pay.months}개월 할부` : ""} · {p.pay?.date ? md(p.pay.date) : ""}</div>
              {p.pay?.method === "안심결제" ? (
                <div className="verdict good" style={{ marginTop: 12 }}><Icon d={I.check} size={16} color="#C2571A" w={2.6} />환불 보장 {won(held(p.daysLeft))} · 결제대행사 보관</div>
              ) : (
                <div className={`verdict ${canObject(p.pay) ? "good" : ""}`} style={{ marginTop: 12 }}>
                  <Icon d={canObject(p.pay) ? I.check : I.info} size={16} color={canObject(p.pay) ? "#C2571A" : "#4E5968"} w={2.6} />
                  {canObject(p.pay) ? "닫히면 남은 할부 멈춤 가능" : "할부 멈춤 대상 아님"}
                </div>
              )}
              {p.shop.protect === "insurance" && <div className="verdict good" style={{ marginTop: 8 }}><Icon d={I.shield} size={16} color="#C2571A" w={2.4} />보증보험으로 남은 돈 환급</div>}
            </div>
            <div className="pad">
              <button className="rowlink" onClick={() => nav.go("record")}><span>업장 기록 보기</span><span className="ter">›</span></button>
            </div>
          </>
        )}
      </div>
      <Tab active="pass" go={nav.tab} unread={unreadOf(state)} />
    </div>
  );
}

// 알림 목록
export function Alerts({ nav, ui }) {
  const { state, dispatch } = useStore();
  const p = state.pass;
  const open = (a) => { dispatch({ type: "read", id: a.id }); nav.go("alert", { id: a.id }); };
  return (
    <div className="s">
      <div className="scroll">
        <Status onSecret={ui.secret} />
        <div className="pad t26" style={{ paddingTop: 14 }}>알림</div>
        {state.alerts.length === 0 && (
          <div className="empty"><Mark size={56} /><b>알림 없음</b><span>{p ? "폐업이 등록되면 바로 알려요" : "이용권을 등록하면 알림이 와요"}</span></div>
        )}
        <div className="pad">
          {state.alerts.map((a) => {
            const t = ALERT_TEXT[a.kind];
            return (
              <motion.button key={a.id} className={`acard ${a.kind}`} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} onClick={() => open(a)}>
                <div className="row"><span className={`tagc ${a.kind}`}>{t.tag}</span>{!a.read && <i className="dot-new" />}</div>
                <div className="t18 b7" style={{ marginTop: 10, textAlign: "left" }}>{p?.shop.name} {t.title}</div>
                <div className="t14 acc b7" style={{ marginTop: 10, textAlign: "left" }}>할 일 보기 ›</div>
              </motion.button>
            );
          })}
          {p && <div className="t14 ter b7" style={{ marginTop: 22 }}>지난 기록</div>}
          {p && [["오늘", "이용권 등록", PASS.name], ["9.2", "영업 중 확인", ""]].map(([m, t, s]) => (
            <div className="ti" key={t}><div className="m">{m}</div><div><b>{t}</b><span>{s}</span></div></div>
          ))}
        </div>
      </div>
      <Tab active="alerts" go={nav.tab} unread={unreadOf(state)} />
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
  const left = won(remain(p.daysLeft));
  const todos = a.kind === "signal" ? [
    { t: "남은 돈 확인", s: `약 ${left}`, act: "이용권 보기", fn: () => nav.tab("pass") },
    { t: "업장에 운영 물어보기", s: "다음 달 일정 확인", act: "문구 복사", fn: () => ui.copy("요즘 운영은 계속 정상으로 하시나요? 다음 달 일정도 알 수 있을까요?") },
    { t: canObject(p.pay) ? "할부라 안심" : "영수증 챙기기", s: canObject(p.pay) ? "닫으면 할부 멈춤 가능" : "피해구제에 필요", act: "자세히", fn: () => ui.toast("20만 원 이상, 3개월 이상 할부면 남은 할부를 멈출 수 있어요") },
  ] : [
    { t: "카드사에 할부 멈춤 요청", s: canObject(p.pay) ? `${p.pay.months}개월 할부 · 할부거래법` : "대상 아님 · 건너뛰기", act: "요청 문구 복사", fn: () => ui.copy(`${p.shop.name}이 폐업해 이용권을 쓸 수 없게 되어, 남은 할부금 지급 거절(항변권)을 요청합니다.`) },
    { t: p.shop.protect === "insurance" ? "보증보험 환급 청구" : "보증보험 없음", s: p.shop.protect === "insurance" ? `약 ${left}` : "3번으로", act: p.shop.protect === "insurance" ? "청구 안내" : "다음", fn: () => ui.toast(p.shop.protect === "insurance" ? "OO보증보험 청구 화면으로 이어져요 (시연)" : "소비자원 피해구제로 넘어가요") },
    { t: "소비자원 피해구제 신청", s: "1372 · 영수증 준비", act: "안내 보기", fn: () => ui.toast("1372 소비자상담센터로 연결돼요 (시연)") },
  ];
  return (
    <div className="s">
      <div className="scroll">
        <Status /><Back onBack={nav.back} />
        <div className="pad">
          <span className={`tagc ${a.kind}`}>{t.tag}</span>
          <div className="t26" style={{ marginTop: 12 }}>{p.shop.name}<br />{t.title}</div>
          <div className="t15 sub" style={{ marginTop: 10, lineHeight: 1.55 }}>{a.kind === "closed" && p.pay?.method === "안심결제" ? `${won(held(p.daysLeft))}은 자동 환불돼요. 나머지 ${won(remain(p.daysLeft) - held(p.daysLeft))}은 업장이 이미 받은 돈이에요.` : t.body}</div>
        </div>
        {a.kind === "closed" && p.pay?.method === "안심결제" ? (
          <motion.div className="refund" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <span>자동으로 돌려받는 돈</span>
            <b>{won(held(p.daysLeft))}</b>
            <span>결제한 카드로 환불</span>
            {canObject(p.pay) && <button className="actbtn" style={{ alignSelf: "flex-start", marginTop: 8 }} onClick={() => ui.copy(`${p.shop.name}이 폐업해 남은 할부금 지급 거절(항변권)을 요청합니다.`)}>남은 할부 멈추기</button>}
          </motion.div>
        ) : (
        <div className="pad" style={{ marginTop: 26 }}>
          <div className="t18 b7">지금 할 일</div>
          {todos.map((x, i) => (
            <motion.div key={x.t} className="todo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }}>
              <i>{i + 1}</i>
              <div style={{ flex: 1 }}><b>{x.t}</b><span>{x.s}</span></div>
              <button className="actbtn" onClick={x.fn}>{x.act}</button>
            </motion.div>
          ))}
        </div>
        )}
        {a.kind === "signal" && <div className="pad"><button className="rowlink" onClick={() => nav.go("record")}><span>왜 이런 알림이 왔나요?</span><span className="ter">업장 기록 보기 ›</span></button></div>}
      </div>
    </div>
  );
}

// 업장 기록: 쓸수록 쌓이는 데이터
export function Record({ nav }) {
  const { state } = useStore();
  const s = state.pass?.shop || state.shop;
  return (
    <div className="s">
      <div className="scroll">
        <Status /><Back onBack={nav.back} />
        <div className="pad">
          <div className="t26">{s?.name} 기록</div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}><span className="chipg">영업 중</span><span className="chipg">기록 14개월째</span></div>
        </div>
        <div className="key" style={{ marginTop: 18 }}>
          <div className="row"><b className="t15">사장님 글</b><span className="t13 ter">월별</span></div>
          <div className="bars">
            {RECORD.posts.map((v, i) => <motion.i key={i} className={v ? "" : "zero"} initial={{ height: 0 }} animate={{ height: v ? `${v}%` : 10 }} transition={{ delay: 0.03 * i, duration: 0.4 }} />)}
          </div>
          <div className="row t12 ter" style={{ marginTop: 6 }}><span>1년 전</span><span className="acc b7">최근 3개월 0건</span></div>
        </div>
        <div className="pad" style={{ marginTop: 14 }}>
          {RECORD.log.map((l) => <div className="ti" key={l.m}><div className="d" style={l.hot ? { background: "var(--acc)" } : undefined} /><div className="m">{l.m}</div><div><b>{l.t}</b><span>{l.s}</span></div></div>)}
        </div>
              </div>
    </div>
  );
}
