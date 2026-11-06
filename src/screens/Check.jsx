import { motion } from "framer-motion";
import { CHECKS } from "../data.js";
import { Icon, I, Status, Back } from "../components.jsx";
import { useStore } from "../lib/store.jsx";

const okOf = (c, answers) => answers[c.id] === c.opts[0];

// 결제 전 체크 (결제할 때): 카운터에서 묻고 들은 대로 고른다
export function Check({ nav }) {
  const { state, dispatch } = useStore();
  const done = CHECKS.every((c) => state.answers[c.id]);
  return (
    <div className="s">
      <div className="scroll">
        <Status /><Back onBack={nav.back} />
        <div className="pad" style={{ paddingBottom: 20 }}>
          <div className="t26">결제하기 전에<br />카운터에서 물어보세요</div>
          <div className="t16 sub" style={{ marginTop: 8 }}>{state.shop.name}에 묻고, 들은 대로 골라 주세요</div>
        </div>
        {CHECKS.map((c, i) => (
          <div className="q" key={c.id}>
            <div className="t">
              <div className="ic"><Icon d={I[c.icon]} /></div>
              <div><div className="t13 ter b7">질문 {i + 1}</div><div className="t16 b7" style={{ marginTop: 2 }}>{c.q}</div><div className="t13 ter" style={{ marginTop: 4, lineHeight: 1.45 }}>{c.sub}</div></div>
            </div>
            <div className="seg3">
              {c.opts.map((v) => {
                const on = state.answers[c.id] === v;
                return (
                  <motion.button key={v} whileTap={{ scale: 0.96 }} className={on ? "on" : ""} onClick={() => dispatch({ type: "answer", id: c.id, v })}>
                    {on && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ display: "inline-flex" }}><Icon d={I.check} size={14} color="#fff" w={3} /></motion.span>}{v}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="bottom">
        <motion.button className={`btn ${done ? "" : "off"}`} style={{ flex: 1 }} animate={done ? { scale: [1, 1.03, 1] } : {}} onClick={() => nav.go("result")}>{done ? "결과 보기" : "세 가지를 골라 주세요"}</motion.button>
      </div>
    </div>
  );
}

// 체크 결과 + 보장 안내: 빠진 것은 카운터에 보여 줄 질문으로
export function Result({ nav, ui }) {
  const { state, dispatch } = useStore();
  const ok = CHECKS.filter((c) => okOf(c, state.answers));
  const todo = CHECKS.filter((c) => !okOf(c, state.answers));
  const shop = state.shop;
  const register = () => { dispatch({ type: "register" }); ui.registered(); };
  return (
    <div className="s">
      <div className="scroll">
        <Status /><Back onBack={nav.back} />
        <div className="pad" style={{ paddingBottom: 18 }}>
          <div className="t14 ter b7">{shop.name} 결제 전 체크</div>
          <div className="t26" style={{ marginTop: 6 }}>{todo.length === 0 ? "세 가지 모두 됐어요" : <><span className="num">{ok.length}</span>개는 됐고,<br /><span className="num acc">{todo.length}</span>개만 더 챙기면 돼요</>}</div>
        </div>
        <div className="res">
          {CHECKS.map((c) => {
            const good = okOf(c, state.answers);
            return (
              <div className="r" key={c.id}>
                <div className={`ok ${good ? "" : "warn"}`}>{good ? <Icon d={I.check} size={14} color="#191F28" w={3} /> : "!"}</div>
                <div style={{ flex: 1 }}><div className="t16 b6">{c.title}</div><div className="t13 ter" style={{ marginTop: 2 }}>들은 답 · {state.answers[c.id]}</div></div>
                <span className={`t14 b6 ${good ? "ter" : "acc"}`}>{good ? "확인" : "물어보기"}</span>
              </div>
            );
          })}
        </div>
        {todo.length > 0 && (
          <button className="show-btn" onClick={() => nav.go("counter")}>
            <Icon d={I.phone} size={22} color="#191F28" />
            <div style={{ flex: 1, textAlign: "left" }}><b>카운터에 보여 주기</b><span>물어볼 말을 큰 글씨로 띄워 드려요</span></div>
            <Icon d={I.arrow} size={18} color="#8B95A1" />
          </button>
        )}
        <div className="pad" style={{ marginTop: 26 }}>
          <div className="t14 sub b7">업장이 가입한 보장</div>
          {shop.guard ? (
            <div className="key" style={{ margin: "8px 0 0", background: "var(--card)" }}>
              <div className="row"><b className="t16" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon d={I.shield} size={18} color="#191F28" />보장 업장</b><span className="chipg" style={{ background: "#fff" }}>OO보증보험</span></div>
              <div className="t13 ter" style={{ marginTop: 14 }}>내가 더 내는 돈</div>
              <div className="t40" style={{ whiteSpace: "nowrap" }}>0원</div>
              <div className="t14 sub" style={{ marginTop: 4, lineHeight: 1.5 }}>보장료는 업장이 내요. 문을 닫으면 남은 이용료를 돌려받아요.</div>
            </div>
          ) : (
            <div className="guard none" style={{ marginTop: 8 }}><Icon d={I.shield} size={22} color="#8B95A1" /><div style={{ flex: 1 }}><b>보장 업장이 아니에요</b><span>할부로 결제하면 닫았을 때 남은 결제를 멈출 수 있어요</span></div></div>
          )}
        </div>
      </div>
      <div className="bottom"><button className="btn acc-b" style={{ flex: 1 }} onClick={register}>이용권 등록하고 지켜보기</button></div>
    </div>
  );
}

// 카운터에 보여 주기: 직원에게 화면을 그대로 보여 준다
export function Counter({ nav }) {
  const { state } = useStore();
  const todo = CHECKS.filter((c) => !okOf(c, state.answers));
  return (
    <div className="s counter">
      <Status />
      <div className="pad" style={{ paddingTop: 20 }}>
        <span className="chipg dark">직원분께 보여 주세요</span>
        <div className="t20" style={{ marginTop: 14 }}>{state.shop.name}</div>
        <div className="t16 sub" style={{ marginTop: 4 }}>결제하기 전에 확인하고 싶어요</div>
        {todo.map((c, i) => (
          <motion.div key={c.id} className="cq" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.12 }}>
            <span>{i + 1}</span>{c.ask}
          </motion.div>
        ))}
      </div>
      <div className="bottom"><button className="btn" style={{ flex: 1 }} onClick={nav.back}>다 물어봤어요</button></div>
    </div>
  );
}
