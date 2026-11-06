import { useEffect, useState } from "react";
import { TIERS, CHECKS } from "../data.js";
import { Icon, I, Status, Back, Sk, md } from "../components.jsx";
import { getShop } from "../lib/api.js";
import { useStore } from "../lib/store.jsx";

// 업장 상세 (결제 전): 공공데이터 사실 → 크기 비교 → 업장이 가입한 보장(따로) → 할 일, 버튼은 하단 고정
export function Detail({ nav }) {
  const { state } = useStore();
  const [d, setD] = useState(null);
  useEffect(() => { getShop(state.shop.id).then(setD); }, [state.shop.id]);
  const shop = d?.shop || state.shop;
  const t = TIERS[shop.tier];

  return (
    <div className="s">
      <div className="scroll">
        <Status /><Back onBack={nav.back} />
        <div className="pad">
          <div className="t26">{shop.name}</div>
          <div className="t14 ter" style={{ marginTop: 6 }}>헬스장 · {shop.dist}m · 영업 {shop.years}년째</div>
        </div>

        {!d ? (
          <div className="pad" style={{ marginTop: 20 }}>
            <Sk h={92} r={18} /><Sk w="35%" h={14} style={{ marginTop: 26 }} /><Sk w="55%" h={24} style={{ marginTop: 10 }} />
            {[0, 1, 2].map((k) => <Sk key={k} h={10} r={5} style={{ marginTop: 16 }} />)}
            <Sk h={64} r={18} style={{ marginTop: 26 }} />
          </div>
        ) : (
          <div className="fadein">
            <div className="card pad-card" style={{ marginTop: 20 }}>
              <div className="row"><div className="status"><i />영업 중</div><span className="t14 ter">{md(d.meta.updatedAt)} 확인</span></div>
              <div className="t13 ter" style={{ marginTop: 6 }}>서울시 인허가 기준 · 면적 {shop.areaM2}㎡</div>
            </div>

            <div className="pad" style={{ marginTop: 26 }}>
              <div className="t14 sub b7">업장 크기</div>
              <div className="t20" style={{ marginTop: 4 }}>약 {shop.pyeong}평 · {t.label}</div>
              <div className="t14 sub" style={{ marginTop: 4 }}>{t.note}</div>
              <div style={{ marginTop: 6 }}>
                {Object.entries(TIERS).map(([k, v]) => (
                  <div key={k} className={`tier ${k === shop.tier ? "mine" : ""}`}>
                    <span>{v.label}</span>
                    <div className="bar"><i className="grow" style={{ width: `${v.bar}%`, background: k === shop.tier ? "#C2571A" : "#C9CED4" }} /></div>
                    <b>{k === shop.tier ? "이 업장" : v.tag}</b>
                  </div>
                ))}
              </div>
              <div className="t12 ter" style={{ marginTop: 10 }}>서울·경기 인허가 10년치 기준 · 이 업장 예측이 아니에요</div>
            </div>

            <div className="pad" style={{ marginTop: 26 }}>
              <div className="t14 sub b7">업장이 가입한 보장</div>
              {shop.guard ? (
                <div className="guard" style={{ marginTop: 8 }}>
                  <Icon d={I.shield} size={22} color="#C2571A" />
                  <div style={{ flex: 1 }}><b>보장 업장</b><span>문을 닫아도 남은 이용료를 돌려받아요</span></div>
                </div>
              ) : (
                <div className="guard none" style={{ marginTop: 8 }}>
                  <Icon d={I.shield} size={22} color="#8B95A1" />
                  <div style={{ flex: 1 }}><b>보장 업장이 아니에요</b><span>결제할 때 보증보험과 할부를 꼭 확인하세요</span></div>
                </div>
              )}
              <div className="t12 ter" style={{ marginTop: 8 }}>보장 여부는 크기 안내에 반영하지 않아요</div>
            </div>

            <div className="pad" style={{ marginTop: 26 }}>
              <div className="t14 sub b7">결제 전에 물어볼 세 가지</div>
              <div className="todo3">{CHECKS.map((c, k) => <span key={c.id}><i>{k + 1}</i>{c.title}</span>)}</div>
            </div>
          </div>
        )}
      </div>
      <div className="bottom"><button className={`btn acc-b ${d ? "" : "off"}`} style={{ flex: 1 }} onClick={() => nav.go("check")}>결제 전 체크 시작</button></div>
    </div>
  );
}
