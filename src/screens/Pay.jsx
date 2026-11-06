import { useState } from "react";
import { motion } from "framer-motion";
import { TIERS, PASS, won, refundIfQuit, canObject } from "../data.js";
import { Icon, I, Status, Back } from "../components.jsx";
import { useStore } from "../lib/store.jsx";

// 결제 전에 알아 둘 것: 사용자에게 묻지 않고 앱이 아는 것을 먼저 보여 준다
export function Prep({ nav }) {
  const { state } = useStore();
  const shop = state.shop;
  const rows = [
    { k: "보증보험", v: shop.guard ? "보장 업장 · 닫으면 환급" : "가입 안 됨", s: shop.guard ? "OO보증보험 · 이용권 끝날 때까지" : "업장 게시 정보 기준", warn: !shop.guard },
    { k: "중도에 그만두면", v: `약 ${won(refundIfQuit(PASS.price, 90))} 돌려받아요`, s: "3개월 쓰고 그만둘 때 · 소비자분쟁해결기준(위약금 10%)" },
    { k: "업장 크기", v: `${TIERS[shop.tier].label} · 약 ${shop.pyeong}평`, s: TIERS[shop.tier].note },
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
              <div><b className={r.warn ? "acc" : ""}>{r.v}</b><span>{r.s}</span></div>
            </motion.div>
          ))}
        </div>
        <div className="hint">
          <Icon d={I.card} size={20} color="#C2571A" />
          <span>{shop.guard ? "보장 업장이라도, 할부로 내면 한 번 더 안전해요" : "보증보험이 없어서, 결제 방법이 가장 중요해요"}</span>
        </div>
      </div>
      <div className="bottom"><button className="btn acc-b" style={{ flex: 1 }} onClick={() => nav.go("pay")}>결제 방법 고르기</button></div>
    </div>
  );
}

// 결제 방법: 할부를 기본으로 골라 두고, 고른 대로 이용권을 등록한다
export function Pay({ nav, ui }) {
  const { state, dispatch } = useStore();
  const [method, setMethod] = useState("할부");
  const [months, setMonths] = useState(6);
  const [amount, setAmount] = useState(PASS.price);
  const ok = canObject({ method, months, amount });
  const opts = [
    { id: "할부", t: "카드 3개월 이상 할부", s: "문을 닫으면 남은 할부를 멈출 수 있어요. 무이자면 추가 비용 0원", tag: "추천" },
    { id: "일시불", t: "일시불", s: "문을 닫으면 돌려받기 어려워요. 피해구제를 신청해도 환급은 17.9%" },
  ];
  const submit = () => { dispatch({ type: "register", pay: { method, months: method === "할부" ? months : 0, amount, date: new Date().toISOString().slice(0, 10) } }); ui.registered(); };
  return (
    <div className="s">
      <div className="scroll">
        <Status /><Back onBack={nav.back} />
        <div className="pad"><div className="t26">어떻게 결제할까요?</div><div className="t15 sub" style={{ marginTop: 6 }}>{state.shop.name} · {PASS.name}</div></div>
        <div className="pad" style={{ marginTop: 18 }}>
          {opts.map((o) => (
            <motion.button key={o.id} whileTap={{ scale: 0.98 }} className={`opt ${method === o.id ? "on" : ""}`} onClick={() => setMethod(o.id)}>
              <span className="radio" />
              <div style={{ flex: 1 }}><b>{o.t}{o.tag && <em>{o.tag}</em>}</b><span>{o.s}</span></div>
            </motion.button>
          ))}
        </div>
        <div className="pad" style={{ marginTop: 20 }}>
          <div className="t14 sub b6">결제 금액</div>
          <div className="pills">{[300000, 600000, 1000000].map((v) => <button key={v} className={amount === v ? "on" : ""} onClick={() => setAmount(v)}>{won(v)}</button>)}</div>
          {method === "할부" && <>
            <div className="t14 sub b6" style={{ marginTop: 16 }}>할부 개월</div>
            <div className="pills">{[2, 3, 6, 12].map((v) => <button key={v} className={months === v ? "on" : ""} onClick={() => setMonths(v)}>{v}개월</button>)}</div>
          </>}
          <motion.div key={String(ok)} className={`verdict ${ok ? "good" : ""}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <Icon d={ok ? I.check : I.info} size={18} color={ok ? "#C2571A" : "#4E5968"} w={2.6} />
            {ok ? "이 결제는 닫혔을 때 남은 할부를 멈출 수 있어요" : method === "할부" ? "3개월 이상, 20만 원 이상이어야 멈출 수 있어요" : "일시불은 닫혔을 때 지켜 줄 장치가 없어요"}
          </motion.div>
        </div>
      </div>
      <div className="bottom"><button className="btn acc-b" style={{ flex: 1 }} onClick={submit}>이렇게 결제하고 등록하기</button></div>
    </div>
  );
}
