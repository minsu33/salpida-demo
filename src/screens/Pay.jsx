import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PASS, won, man, canObject } from "../data.js";
import { Icon, I, Status, Back } from "../components.jsx";
import { useStore } from "../lib/store.jsx";

const QR = Array.from({ length: 441 }, (_, i) => { const x = i % 21, y = (i / 21) | 0; const f = (a, b) => x >= a && x < a + 7 && y >= b && y < b + 7; const fin = f(0, 0) || f(14, 0) || f(0, 14); if (fin) { const lx = x % 7 === 0 || x % 7 === 6 || x >= 14 && (x - 14) % 7 === 6, cx = x % 7, cy = y % 7; return cx === 0 || cx === 6 || cy === 0 || cy === 6 || (cx >= 2 && cx <= 4 && cy >= 2 && cy <= 4); } return ((x * 7 + y * 13 + x * y) % 5) < 2; });

// 결제: 안심결제 업장은 카운터 QR을 먼저 찍고, 같은 화면에서 금액·할부를 고른 뒤 바로 낸다
export function Pay({ nav, ui }) {
  const { state, dispatch } = useStore();
  const shop = state.shop;
  const escrow = shop.protect === "escrow";
  const [step, setStep] = useState(escrow ? "scan" : "form");
  const [es, setEs] = useState(escrow);
  const [months, setMonths] = useState(6);
  const [amount, setAmount] = useState(PASS.price);
  useEffect(() => { if (step !== "scan") return; const t = setTimeout(() => setStep("form"), 1800); return () => clearTimeout(t); }, [step]);
  const setAmt = (v) => setAmount(Math.min(99999999, Number(v.replace(/\D/g, "")) || 0));
  const method = es ? "안심결제" : months ? "할부" : "일시불";
  const pay = { method, months, amount, date: new Date().toISOString().slice(0, 10) };
  const safe = es ? "남은 이용료 전액 환불" : shop.protect === "insurance" ? "보증보험으로 환급" : canObject(pay) ? "남은 할부를 멈출 수 있어요" : null;
  const submit = () => { dispatch({ type: "register", pay }); ui.registered(pay); };

  if (step === "scan") return (
    <div className="s scanner" onClick={() => setStep("form")}>
      <Status dark /><Back onBack={nav.back} />
      <div className="t26" style={{ color: "#fff", textAlign: "center", marginTop: 30 }}>카운터 QR을 찍어 주세요</div>
      <div className="finder"><div className="qr" style={{ margin: 0, background: "#fff" }}>{QR.map((on, i) => <i key={i} className={on ? "on" : ""} />)}</div><span className="scanline" /></div>
    </div>
  );
  return (
    <div className="s">
      <div className="scroll fadein">
        <Status /><Back onBack={nav.back} />
        <div className="pad">
          <div className="t15 sub b6">{shop.name}</div>
          <label className="amt big"><input inputMode="numeric" value={amount ? amount.toLocaleString() : ""} placeholder="0" onChange={(e) => setAmt(e.target.value)} onFocus={(e) => e.target.select()} /><span>원</span></label>
          <div className="quick">{[300000, 600000, 1000000].map((v) => <button key={v} className={amount === v ? "on" : ""} onClick={() => setAmount(v)}>{man(v)}</button>)}</div>
        </div>
        {escrow && (
          <div className="pad" style={{ marginTop: 28 }}>
            <div className="paykind">
              <button className={es ? "on" : ""} onClick={() => setEs(true)}><b>안심결제</b><span>수수료 0원</span></button>
              <button className={!es ? "on" : ""} onClick={() => setEs(false)}><b>일반 결제</b><span>업장에 전액</span></button>
            </div>
            {es && <Split amount={amount} />}
          </div>
        )}
        <div className="pad" style={{ marginTop: 24 }}>
          <div className="row"><div className="t16 b7">할부</div>{months > 0 && amount > 0 && <span className="t14 sub">월 <b style={{ color: "var(--ink)" }}>{man(amount / months)} 원</b></span>}</div>
          <div className="pills">{[0, 3, 6, 12].map((v) => <button key={v} className={months === v ? "on" : ""} onClick={() => setMonths(v)}>{v ? `${v}개월` : "일시불"}</button>)}</div>
        </div>
        <motion.div key={safe || "none"} className={`ifclose ${safe ? "" : "bad"}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <Icon d={safe ? I.shield : I.info} size={24} color={safe ? "#C2571A" : "#8B95A1"} w={2} />
          <div><span>업장이 닫히면</span><b>{safe || "돌려받기 어려워요"}</b></div>
        </motion.div>
      </div>
      <div className="bottom"><button className="btn acc-b" style={{ flex: 1 }} disabled={!amount} onClick={submit}>{es ? `${won(amount)} 결제하기` : "결제하고 등록하기"}</button></div>
    </div>
  );
}

// 안심결제 돈 나눔: 절반은 업장에 바로, 절반은 결제대행사가 맡아 매달 보낸다
export function Split({ amount }) {
  return (
    <div className="split2">
      <div className="sbar"><i /><i /></div>
      <div className="row t13"><span>업장에 바로 <b>{man(amount / 2)} 원</b></span><span className="acc">보관 <b>{man(amount / 2)} 원</b> · 매달 {man(amount / 2 / 12)}씩</span></div>
    </div>
  );
}

// 카운터에서 QR로 결제: 카드 결제 그대로, 돈만 결제대행사가 나눠 보낸다
