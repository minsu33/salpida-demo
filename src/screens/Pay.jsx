import { useState } from "react";
import { motion } from "framer-motion";
import { TIERS, PASS, PROTECT, won, man, refundIfQuit, canObject } from "../data.js";
import { Icon, I, Status, Back } from "../components.jsx";
import { useStore } from "../lib/store.jsx";

// 결제 전에 알아 둘 것: 사용자에게 묻지 않고 앱이 아는 것을 먼저 보여 준다
export function Prep({ nav }) {
  const { state } = useStore();
  const shop = state.shop;
  const rows = [
    { k: "돈 지키는 수단", v: shop.guard ? `${PROTECT[shop.protect].name} · ${PROTECT[shop.protect].body}` : "없음", warn: !shop.guard },
    { k: "3개월 뒤 그만두면", v: `약 ${won(refundIfQuit(PASS.price, 90))} 환급`, s: "소비자분쟁해결기준 계산" },
    { k: "업장 크기", v: `${TIERS[shop.tier].label} · 약 ${shop.pyeong}평` },
  ];
  return (
    <div className="s">
      <div className="scroll">
        <Status /><Back onBack={nav.back} />
        <div className="pad">
          <div className="t14 ter b6">{shop.name} · {PASS.name} {won(PASS.price)}</div>
          <div className="t26" style={{ marginTop: 6 }}>결제 전에 알아 둘 것</div>
        </div>
        <div className="facts">
          {rows.map((r, i) => (
            <motion.div key={r.k} className="fact" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i }}>
              <span className="t14 sub">{r.k}</span>
              <div><b className={r.warn ? "acc" : ""}>{r.v}</b>{r.s && <span>{r.s}</span>}</div>
            </motion.div>
          ))}
        </div>
        <div className="hint">
          <Icon d={I.card} size={20} color="#C2571A" />
          <span>{shop.protect === "escrow" ? "안심결제면 닫혀도 맡긴 돈 환불" : shop.guard ? "할부로 내면 한 번 더 안전" : "지킬 수단 없음 → 할부가 가장 중요"}</span>
        </div>
      </div>
      <div className="bottom"><button className="btn acc-b" style={{ flex: 1 }} onClick={() => nav.go("pay")}>결제 방법 고르기</button></div>
    </div>
  );
}

// 결제: 손님이 고르는 건 두 가지(결제 방식, 카드 할부). 맨 아래에 '닫히면 내 돈은?'을 바로 보여 준다
export function Pay({ nav, ui }) {
  const { state, dispatch } = useStore();
  const escrow = state.shop.protect === "escrow";
  const [es, setEs] = useState(escrow);
  const [months, setMonths] = useState(6);
  const [amount, setAmount] = useState(PASS.price);
  const setAmt = (v) => setAmount(Math.min(99999999, Number(v.replace(/\D/g, "")) || 0));
  const method = es ? "안심결제" : months ? "할부" : "일시불";
  const pay = { method, months, amount, date: new Date().toISOString().slice(0, 10) };
  const stop = canObject(pay);
  const lines = [es && `보관된 ${man(amount / 2)} 원 자동 환불`, stop && "남은 할부 멈춤"].filter(Boolean);
  const submit = () => { if (es) return nav.go("qr", { pay }); dispatch({ type: "register", pay }); ui.registered(); };
  return (
    <div className="s">
      <div className="scroll">
        <Status /><Back onBack={nav.back} />
        <div className="pad"><div className="t26">어떻게 결제할까요?</div><div className="t15 sub" style={{ marginTop: 6 }}>{state.shop.name} · {PASS.name}</div></div>
        <div className="pad" style={{ marginTop: 18 }}>
          <label className="amt"><input inputMode="numeric" value={amount ? amount.toLocaleString() : ""} placeholder="0" onChange={(e) => setAmt(e.target.value)} onFocus={(e) => e.target.select()} /><span>원</span></label>
          {escrow && <>
            <div className="t14 sub b6" style={{ marginTop: 20 }}>결제 방식</div>
            <div className="paykind">
              <button className={es ? "on" : ""} onClick={() => setEs(true)}><b>안심결제<em>추천</em></b><span>절반은 결제대행사가 보관</span></button>
              <button className={!es ? "on" : ""} onClick={() => setEs(false)}><b>일반 결제</b><span>업장에 전액</span></button>
            </div>
            {es && <Split amount={amount} />}
          </>}
          <div className="t14 sub b6" style={{ marginTop: 20 }}>카드</div>
          <div className="pills">{[0, 3, 6, 12].map((v) => <button key={v} className={months === v ? "on" : ""} onClick={() => setMonths(v)}>{v ? `${v}개월` : "일시불"}</button>)}</div>
        </div>
        <motion.div key={lines.join()} className={`ifclose ${lines.length ? "" : "bad"}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <span>닫히면 내 돈은?</span>
          {lines.length ? lines.map((l) => <b key={l}><Icon d={I.check} size={18} color="#C2571A" w={2.8} />{l}</b>) : <b>돌려받기 어려워요</b>}
        </motion.div>
      </div>
      <div className="bottom"><button className="btn acc-b" style={{ flex: 1 }} disabled={!amount} onClick={submit}>{es ? "안심결제로 결제하기" : "결제하고 등록하기"}</button></div>
    </div>
  );
}

// 안심결제 돈 나눔: 절반은 업장에 바로, 절반은 결제대행사가 맡아 매달 보낸다
export function Split({ amount }) {
  return (
    <div className="split">
      <div className="a"><b>{man(amount / 2)}</b><span>업장에 바로</span></div>
      <div className="b"><b>{man(amount / 2)}</b><span>결제대행사가 보관</span></div>
    </div>
  );
}

// 카운터에서 QR로 결제: 카드 결제 그대로, 돈만 결제대행사가 나눠 보낸다
const QR = Array.from({ length: 441 }, (_, i) => { const x = i % 21, y = (i / 21) | 0; const f = (a, b) => x >= a && x < a + 7 && y >= b && y < b + 7; const fin = f(0, 0) || f(14, 0) || f(0, 14); if (fin) { const lx = x % 7 === 0 || x % 7 === 6 || x >= 14 && (x - 14) % 7 === 6, cx = x % 7, cy = y % 7; return cx === 0 || cx === 6 || cy === 0 || cy === 6 || (cx >= 2 && cx <= 4 && cy >= 2 && cy <= 4); } return ((x * 7 + y * 13 + x * y) % 5) < 2; });
export function Qr({ nav, ui, params }) {
  const { state, dispatch } = useStore();
  const pay = params.pay;
  const done = () => { dispatch({ type: "register", pay }); ui.registered(); };
  return (
    <div className="s">
      <div className="scroll">
        <Status /><Back onBack={nav.back} />
        <div className="pad"><div className="t26">직원에게 보여 주세요</div><div className="t15 sub" style={{ marginTop: 6 }}>{state.shop.name} · {won(pay.amount)}</div></div>
        <div className="qr">{QR.map((on, i) => <i key={i} className={on ? "on" : ""} />)}</div>
        <div className="steps">
          {[["phone", "화면 보여 주기"], ["card", pay.months ? `카드 ${pay.months}개월` : "카드 일시불"], ["shield", "안심결제"]].map(([ic, t], i) => (
            <div key={t} className="step"><span><Icon d={I[ic]} size={22} color={i === 2 ? "#C2571A" : "#191F28"} /></span><b>{t}</b></div>
          ))}
        </div>
        <div className="pad"><Split amount={pay.amount} /></div>
              </div>
      <div className="bottom"><button className="btn acc-b" style={{ flex: 1 }} onClick={done}>결제 완료</button></div>
    </div>
  );
}
