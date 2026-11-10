import { useState, useEffect } from "react";
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
          <span>{shop.protect === "escrow" ? "안심결제면 닫혀도 전액 환불" : shop.guard ? "할부로 내면 한 번 더 안전" : "지킬 수단 없음 → 할부가 가장 중요"}</span>
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
  const lines = [es && "남은 이용료 전액 환불 (살핌 보장)", state.shop.protect === "insurance" && "보증보험으로 환급", !es && stop && "남은 할부 멈춤 요청 가능"].filter(Boolean);
  const submit = () => nav.go("qr", { pay });
  return (
    <div className="s">
      <div className="scroll">
        <Status /><Back onBack={nav.back} />
        <div className="pad"><div className="t26">어떻게 결제할까요?</div><div className="t15 sub" style={{ marginTop: 6 }}>{state.shop.name} · {PASS.name}</div></div>
        <div className="pad" style={{ marginTop: 18 }}>
          <div className="t14 sub b6">결제 금액</div>
          <label className="amt"><input inputMode="numeric" value={amount ? amount.toLocaleString() : ""} placeholder="금액 입력" onChange={(e) => setAmt(e.target.value)} onFocus={(e) => e.target.select()} /><span>원</span><Icon d={I.pen} size={16} color="#8B95A1" /></label>
          <div className="quick">{[300000, 600000, 1000000].map((v) => <button key={v} className={amount === v ? "on" : ""} onClick={() => setAmount(v)}>{man(v)} 원</button>)}</div>
          {escrow && <>
            <div className="t14 sub b6" style={{ marginTop: 20 }}>결제 방식</div>
            <div className="paykind">
              <button className={es ? "on" : ""} onClick={() => setEs(true)}><b>안심결제<em>추천</em></b><span>닫히면 전액 환불</span></button>
              <button className={!es ? "on" : ""} onClick={() => setEs(false)}><b>일반 결제</b><span>업장에 전액</span></button>
            </div>
            {es && <Split amount={amount} />}
          </>}
          {es ? <>
            <div className="t14 sub b6" style={{ marginTop: 20 }}>할부</div>
            <div className="pills">{[0, 3, 6, 12].map((v) => <button key={v} className={months === v ? "on" : ""} onClick={() => setMonths(v)}>{v ? `${v}개월` : "일시불"}</button>)}</div>
            {months > 0 && amount > 0 && <div className="permonth">{months}개월 · 월 <b>{man(amount / months)} 원</b></div>}
          </> : <>
            <div className="t14 sub b6" style={{ marginTop: 20 }}>카드 단말기에서</div>
            <div className="pills">{[0, 3].map((v) => <button key={v} className={(v ? months >= 3 : !months) ? "on" : ""} onClick={() => setMonths(v)}>{v ? "할부 3개월 이상" : "일시불"}</button>)}</div>
            <div className="permonth">할부는 매장 단말기에서 골라요</div>
          </>}
        </div>
        <motion.div key={lines.join()} className={`ifclose ${lines.length ? "" : "bad"}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <span>닫히면 내 돈은?</span>
          {lines.length ? lines.map((l) => <b key={l}><Icon d={I.check} size={18} color="#C2571A" w={2.8} />{l}</b>) : <b>{months && amount < 200000 ? "20만 원 미만은 할부 멈춤이 안 돼요" : "돌려받기 어려워요"}</b>}
        </motion.div>
      </div>
      <div className="bottom"><button className="btn acc-b" style={{ flex: 1 }} disabled={!amount} onClick={submit}>{es ? "카운터 QR 찍고 결제하기" : "카운터에서 결제하기"}</button></div>
    </div>
  );
}

// 안심결제 돈 나눔: 절반은 업장에 바로, 절반은 결제대행사가 맡아 매달 보낸다
export function Split({ amount }) {
  return (
    <div className="split2">
      <div className="sbar"><i /><i /></div>
      <div className="row t13"><span>업장에 바로 <b>{man(amount / 2)} 원</b></span><span className="acc">보관 <b>{man(amount / 2)} 원</b> → 매달 {man(amount / 2 / 12)} 원씩 업장으로</span></div>
    </div>
  );
}

// 카운터에서 QR로 결제: 카드 결제 그대로, 돈만 결제대행사가 나눠 보낸다
const QR = Array.from({ length: 441 }, (_, i) => { const x = i % 21, y = (i / 21) | 0; const f = (a, b) => x >= a && x < a + 7 && y >= b && y < b + 7; const fin = f(0, 0) || f(14, 0) || f(0, 14); if (fin) { const lx = x % 7 === 0 || x % 7 === 6 || x >= 14 && (x - 14) % 7 === 6, cx = x % 7, cy = y % 7; return cx === 0 || cx === 6 || cy === 0 || cy === 6 || (cx >= 2 && cx <= 4 && cy >= 2 && cy <= 4); } return ((x * 7 + y * 13 + x * y) % 5) < 2; });
export function Qr({ nav, ui, params }) {
  const { state, dispatch } = useStore();
  const pay = params.pay;
  const es = pay.method === "안심결제";
  const [step, setStep] = useState(es ? "scan" : "pay");
  useEffect(() => { if (step !== "scan") return; const t = setTimeout(() => setStep("pay"), 1600); return () => clearTimeout(t); }, [step]);
  const done = () => { dispatch({ type: "register", pay }); ui.registered(); };
  const card = pay.months ? `${pay.months}개월 할부` : "일시불";
  // 안심결제: 카운터에 놓인 업장 QR을 손님이 찍는다 → 결제대행사 결제창에서 카드로 낸다
  if (step === "scan") return (
    <div className="s scanner" onClick={() => setStep("pay")}>
      <Status dark /><Back onBack={nav.back} />
      <div className="t26" style={{ color: "#fff", textAlign: "center", marginTop: 30 }}>카운터 QR을 찍어 주세요</div>
      <div className="t14" style={{ color: "#fff", opacity: 0.6, textAlign: "center", marginTop: 8 }}>{state.shop.name} 계산대</div>
      <div className="t14" style={{ color: "#fff", opacity: 0.6, textAlign: "center", marginTop: 4 }}>QR이 네모 안에 들어오게 해 주세요</div>
      <div className="finder"><div className="qr" style={{ margin: 0, background: "#fff" }}>{QR.map((on, i) => <i key={i} className={on ? "on" : ""} />)}</div><span className="scanline" /></div>
    </div>
  );
  return (
    <div className="s">
      <div className="scroll">
        <Status /><Back onBack={nav.back} />
        {es ? <>
          <div className="pad"><div className="t26">이대로 결제할까요?</div><div className="t15 sub" style={{ marginTop: 6 }}>{state.shop.name} · 안심결제</div></div>
          <div className="paysum">
            <div className="row"><span>결제 금액</span><b>{won(pay.amount)}</b></div>
            <div className="row"><span>카드</span><b>내 카드 ···1234 · {card}</b></div>
          </div>
          <div className="pad"><Split amount={pay.amount} /></div>
        </> : <>
          <div className="pad"><div className="t26">카운터에서 카드로 내세요</div><div className="t15 sub" style={{ marginTop: 6 }}>{state.shop.name} · {won(pay.amount)}</div></div>
          <div className="cardpay"><Icon d={I.card} size={64} color="#191F28" w={1.6} /></div>
          <div className="steps">
            {[["card", `카드 ${card}`], ["doc", "결제 기록"], ["bell", "폐업 알림"]].map(([ic, t], i) => (
              <div key={t} className="step"><span><Icon d={I[ic]} size={22} color={i === 2 ? "#C2571A" : "#191F28"} /></span><b>{t}</b></div>
            ))}
          </div>
        </>}
      </div>
      <div className="bottom"><button className="btn acc-b" style={{ flex: 1 }} onClick={done}>{es ? `${won(pay.amount)} 결제하기` : "결제했어요, 등록하기"}</button></div>
    </div>
  );
}
