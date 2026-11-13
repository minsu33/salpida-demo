import { useEffect, useState } from "react";
import { Icon, I, Status, Tab, md } from "../components.jsx";
import { getShops } from "../lib/api.js";
import { useStore } from "../lib/store.jsx";

// MY: 내가 살펴본 기록, 알림 설정, 데이터 출처
export function My({ nav, ui }) {
  const { state, dispatch } = useStore();
  const [meta, setMeta] = useState(null);
  useEffect(() => { getShops().then((d) => setMeta(d.meta)).catch(() => {}); }, []);
  const n = state.notify || {};
  const Toggle = ({ k, label, sub }) => (
    <div className="r"><div><div className="t16 b6">{label}</div><div className="t13 ter" style={{ marginTop: 2 }}>{sub}</div></div>
      <button className={`tg ${n[k] === false ? "off" : ""}`} aria-label={label} onClick={() => dispatch({ type: "notify", key: k })} /></div>
  );
  return (
    <div className="s">
      <div className="scroll">
        <Status onSecret={ui.secret} />
        <div className="pad t26" style={{ paddingTop: 14 }}>내 정보</div>
        <button className="me-card" onClick={() => ui.toast("프로필 편집은 준비 중이에요")}>
          <span className="avatar"><Icon d={I.user} size={26} color="#fff" /></span>
          <div><b>살핌 회원</b><span>카카오로 로그인</span></div>
          <Icon d={I.arrow} size={18} color="#B0B8C1" />
        </button>
        <div className="mystats">
          <div><b>{state.pass ? 1 : 0}</b><span>이용권</span></div>
          <div><b>{(state.viewed || []).length}</b><span>살펴본 업장</span></div>
          <div><b>{state.alerts.length}</b><span>받은 알림</span></div>
        </div>
        <div className="watch" style={{ marginTop: 26 }}>
          <div className="t18 b7">알림</div>
          <Toggle k="closed" label="폐업·휴업 등록" sub="바로 알림" />
          <Toggle k="change" label="업장 정보가 바뀌면" sub="주 1회" />
          <Toggle k="signal" label="참고 신호" sub="앱 안에서만 보여 줘요" />
        </div>
        <div className="pad" style={{ marginTop: 26 }}>
          <div className="t18 b7">데이터</div>
          <div className="ti"><div><b>업장 정보 출처</b><span>{meta ? `${meta.source} · ${md(meta.updatedAt)} 기준` : "불러오는 중"}</span></div></div>
          <div className="ti"><div><b>크기 안내 기준</b><span>서울·경기 공개 자료 10년</span></div></div>
          <button className="rowlink" onClick={() => ui.toast("정정 요청을 보냈어요 (시연)")}><span>정보 정정 요청</span><Icon d={I.arrow} size={18} color="#8B95A1" /></button>
        </div>
        <div className="pad" style={{ marginTop: 26 }}>
          <div className="t18 b7">더 보기</div>
          {["찜한 업장", "결제 수단", "공지사항", "고객센터", "약관 및 개인정보 처리방침"].map((t) => (
            <button key={t} className="rowlink" onClick={() => ui.toast(`${t}은 준비 중이에요`)}><span>{t}</span><Icon d={I.arrow} size={18} color="#B0B8C1" /></button>
          ))}
        </div>
        <div className="pad t12 ter" style={{ marginTop: 22 }}>살핌 0.3</div>
      </div>
      <Tab active="my" go={nav.tab} unread={state.alerts.filter((a) => !a.read).length} />
    </div>
  );
}
