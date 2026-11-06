import { motion } from "framer-motion";
import { PASS, ALERT_TEXT, RECORD, won, remain } from "../data.js";
import { Icon, I, Status, Back, Tab, Mark } from "../components.jsx";
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
          <div className="empty"><Mark size={56} /><b>등록한 이용권이 없어요</b><span>결제한 업장을 등록하면 살피다가 지켜봐요</span><button className="btn" onClick={() => nav.tab("map")}>지도에서 업장 찾기</button></div>
        ) : (
          <>
            <div className="pass">
              <div className="row"><div className="t18 b7">{p.shop.name}</div><span className="t13" style={{ opacity: 0.6 }}>{PASS.name}</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 22 }}>
                <span style={{ width: 12, height: 12, borderRadius: 6, background: closed ? "#FF8A65" : "#fff" }} />
                <span className="t26" style={{ color: "#fff" }}>{closed ? "폐업 등록됨" : "영업 중"}</span>
              </div>
              <div className="t14" style={{ opacity: 0.65, marginTop: 6 }}>인허가 기준 · 주 1회 확인</div>
              <div className="p"><i style={{ width: `${(100 * p.daysLeft) / PASS.days}%` }} /></div>
              <div className="row t14" style={{ opacity: 0.8 }}><span>{p.daysLeft}일 남음</span><span>남은 이용료 약 {won(remain(p.daysLeft))}</span></div>
            </div>
            <div className="info">
              <div className="r"><span>결제</span><span>{won(PASS.price)} · {p.paidBy}</span></div>
              <div className="r"><span>보장</span><span>{p.shop.guard ? "보장 업장 · 닫아도 환급" : "보장 없음"}</span></div>
            </div>
            <div className="pad">
              <button className="rowlink" onClick={() => nav.go("record")}><span>업장 기록 보기</span><span className="ter">매달 쌓여요 ›</span></button>
              <div className="t14 ter" style={{ marginTop: 14, lineHeight: 1.5 }}>폐업·휴업 등록, 면적·대표자 변경, 닫기 전 업장에서 자주 보인 신호가 생기면 알려 드려요.</div>
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
          <div className="empty"><Mark size={56} /><b>아직 받은 알림이 없어요</b><span>{p ? "바뀌는 게 있으면 바로 알려 드릴게요" : "이용권을 등록하면 여기에 알림이 와요"}</span></div>
        )}
        <div className="pad">
          {state.alerts.map((a) => {
            const t = ALERT_TEXT[a.kind];
            return (
              <motion.button key={a.id} className={`acard ${a.kind}`} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} onClick={() => open(a)}>
                <div className="row"><span className={`tagc ${a.kind}`}>{t.tag}</span>{!a.read && <i className="dot-new" />}</div>
                <div className="t18 b7" style={{ marginTop: 10, textAlign: "left" }}>{p?.shop.name} {t.title}</div>
                <div className="t14 acc b7" style={{ marginTop: 10, textAlign: "left" }}>지금 할 일 보기 ›</div>
              </motion.button>
            );
          })}
          {p && <div className="t14 ter b7" style={{ marginTop: 22 }}>지난 기록</div>}
          {p && [["11.3", "인허가 확인 · 영업 중", "주 1회 서울·경기 인허가 비교"], ["오늘", "이용권을 등록했어요", `${PASS.name} · ${p.shop.guard ? "보장 업장" : "보장 없음"}`]].map(([m, t, s]) => (
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
    { t: "남은 이용료 확인", s: `${p.daysLeft}일 남음 · 약 ${left}`, act: "이용권 보기", fn: () => nav.tab("pass") },
    { t: "업장에 운영 계획 물어보기", s: "다음 달에도 정상 운영하는지 직접 확인해요", act: "문구 복사", fn: () => ui.copy("요즘 운영은 계속 정상으로 하시나요? 다음 달 일정도 알 수 있을까요?") },
    { t: p.paidBy === "할부" ? "할부 결제라 안심이에요" : "일시불이면 영수증 챙기기", s: p.paidBy === "할부" ? "문을 닫으면 남은 할부를 멈출 수 있어요" : "피해구제를 신청할 때 결제 증빙이 필요해요", act: "자세히", fn: () => ui.toast("20만 원 이상, 3개월 이상 할부면 남은 할부를 멈출 수 있어요") },
  ] : [
    { t: "카드사에 남은 할부 멈춤 요청", s: p.paidBy === "할부" ? "할부거래법에 따라 남은 할부 지급을 거절할 수 있어요" : "일시불이면 이 단계는 건너뛰세요", act: "요청 문구 복사", fn: () => ui.copy(`${p.shop.name}이 폐업해 이용권을 쓸 수 없게 되어, 남은 할부금 지급 거절(항변권)을 요청합니다.`) },
    { t: p.shop.guard ? "보증보험에 환급 청구" : "보장 업장이 아니었어요", s: p.shop.guard ? `남은 이용료 약 ${left}을 돌려받을 수 있어요` : "아래 피해구제를 신청하세요", act: p.shop.guard ? "청구 안내" : "다음", fn: () => ui.toast(p.shop.guard ? "OO보증보험 청구 화면으로 이어져요 (시연)" : "소비자원 피해구제로 넘어가요") },
    { t: "한국소비자원 피해구제 신청", s: "1372 소비자상담센터 · 결제 영수증과 이용권을 준비해요", act: "안내 보기", fn: () => ui.toast("1372 소비자상담센터로 연결돼요 (시연)") },
  ];
  return (
    <div className="s">
      <div className="scroll">
        <Status /><Back onBack={nav.back} />
        <div className="pad">
          <span className={`tagc ${a.kind}`}>{t.tag}</span>
          <div className="t26" style={{ marginTop: 12 }}>{p.shop.name}<br />{t.title}</div>
          <div className="t15 sub" style={{ marginTop: 10, lineHeight: 1.55 }}>{t.body}</div>
        </div>
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
        <div className="pad t13 ter" style={{ marginTop: 16, lineHeight: 1.55 }}>영업 중인 업장의 기록을 매달 쌓아요. 문 닫은 업장이 생기면 닫기 전 기록에서 공통점을 다시 찾아요.</div>
      </div>
    </div>
  );
}
