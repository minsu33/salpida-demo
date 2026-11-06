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
        <div className="pad t26" style={{ paddingTop: 14 }}>MY</div>
        <div className="mystats">
          <div><b>{(state.viewed || []).length}</b><span>살펴본 업장</span></div>
          <div><b>{state.checked || 0}</b><span>결제 전 체크</span></div>
          <div><b>{state.pass ? 1 : 0}</b><span>지켜보는 이용권</span></div>
        </div>
        <div className="watch" style={{ marginTop: 26 }}>
          <div className="t18 b7">알림</div>
          <Toggle k="closed" label="폐업·휴업 등록" sub="인허가에 등록되면 바로 알려요" />
          <Toggle k="change" label="면적·대표자 변경" sub="주 1회 인허가를 비교해요" />
          <Toggle k="signal" label="참고 신호" sub="닫기 전 업장에서 자주 보인 모습" />
        </div>
        <div className="pad" style={{ marginTop: 26 }}>
          <div className="t18 b7">데이터</div>
          <div className="ti"><div><b>업장 정보 출처</b><span>{meta ? `${meta.source} · ${md(meta.updatedAt)} 기준` : "불러오는 중"}</span></div></div>
          <div className="ti"><div><b>크기 안내 기준</b><span>서울·경기 인허가 10년치, 같은 크기 업장들의 과거 폐업</span></div></div>
          <button className="rowlink" onClick={() => ui.toast("정정 요청을 보냈어요 (시연)")}><span>업장 정보가 다르면 정정 요청</span><Icon d={I.arrow} size={18} color="#8B95A1" /></button>
        </div>
        <div className="pad t12 ter" style={{ marginTop: 22 }}>살피다 0.3 · 업장 상호는 가려서 보여 줘요</div>
      </div>
      <Tab active="my" go={nav.tab} unread={state.alerts.filter((a) => !a.read).length} />
    </div>
  );
}
