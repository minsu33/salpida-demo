import { useEffect, useState } from "react";
import { TIERS, PROTECT } from "../data.js";
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
          <div className="t14 ter" style={{ marginTop: 6 }}>{shop.dist}m · {shop.years}년째 영업</div>
        </div>

        {!d ? (
          <div className="pad" style={{ marginTop: 20 }}>
            <Sk h={92} r={18} /><Sk w="35%" h={14} style={{ marginTop: 26 }} /><Sk w="55%" h={24} style={{ marginTop: 10 }} />
            {[0, 1, 2].map((k) => <Sk key={k} h={10} r={5} style={{ marginTop: 16 }} />)}
            <Sk h={64} r={18} style={{ marginTop: 26 }} />
          </div>
        ) : (
          <div className="fadein">
            <div className="facts3">
              <div><span>영업 상태</span><b><i className="live" />영업 중</b></div>
              <div><span>영업 기간</span><b>{shop.years}년째</b></div>
              <div><span>면적</span><b>약 {shop.pyeong}평</b></div>
            </div>
            <div className="pad t12 ter" style={{ marginTop: 8 }}>서울시 인허가 · {md(d.meta.updatedAt)} 기준</div>

            <div className="pad" style={{ marginTop: 26 }}>
              <div className="row"><div className="t18 b7">크기는 {t.label}</div><span className="t13 ter">1년 안에 닫은 비율</span></div>
              <div style={{ marginTop: 8 }}>
                {Object.entries(TIERS).map(([k, v]) => (
                  <div key={k} className={`tier ${k === shop.tier ? "mine" : ""}`}>
                    <span>{v.label}</span>
                    <div className="bar"><i className="grow" style={{ width: `${v.bar}%`, background: k === shop.tier ? "#C2571A" : "#C9CED4" }} /></div>
                    <b>{v.tag}</b>
                  </div>
                ))}
              </div>
              <div className="t13 ter" style={{ marginTop: 12 }}>같은 크기 업장들의 기록이에요 · 이 업장이 닫는다는 뜻은 아니에요</div>
            </div>

            <div className="pad" style={{ marginTop: 26 }}>
              <div className="t18 b7">닫히면 내 돈은</div>
              {shop.guard ? (
                <div className="guard" style={{ marginTop: 8 }}>
                  <Icon d={I.shield} size={22} color="#C2571A" />
                  <div style={{ flex: 1 }}><b>{PROTECT[shop.protect].short}</b><span>{PROTECT[shop.protect].name} 업장</span></div>
                </div>
              ) : (
                <div className="guard none" style={{ marginTop: 8 }}>
                  <Icon d={I.shield} size={22} color="#8B95A1" />
                  <div style={{ flex: 1 }}><b>보장 없음</b><span>3개월 이상 할부로 지킬 수 있어요</span></div>
                </div>
              )}
                          </div>

          </div>
        )}
      </div>
      <div className="bottom"><button className={`btn acc-b ${d ? "" : "off"}`} style={{ flex: 1 }} onClick={() => nav.go("pay")}>결제 방법 고르기</button></div>
    </div>
  );
}
