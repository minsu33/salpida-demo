import { useEffect, useState } from "react";
import { TIERS, PROTECT, man } from "../data.js";
import { Icon, I, Status, Back, Sk, md } from "../components.jsx";
import { getShop } from "../lib/api.js";
import { useStore } from "../lib/store.jsx";

// 업장 상세 (결제 전): 공공데이터 사실 → 크기 비교 → 업장이 가입한 보장(따로) → 할 일, 버튼은 하단 고정
// 업장이 안내한 이용권 가격 (시연용 예시)
const PLANS = [[1, 100000], [3, 250000], [6, 400000], [12, 600000]];

export function Detail({ nav, ui }) {
  const { state } = useStore();
  const [plan, setPlan] = useState(12);
  const [liked, setLiked] = useState(false);
  const amount = PLANS.find(([m]) => m === plan)[1];
  const [d, setD] = useState(null);
  useEffect(() => { getShop(state.shop.id).then(setD); }, [state.shop.id]);
  const shop = d?.shop || state.shop;
  const t = TIERS[shop.tier];

  return (
    <div className="s">
      <div className="scroll">
        <Status /><Back onBack={nav.back} right={
          <div className="navr">
            <button className="hit" aria-label="공유" onClick={() => ui.toast("링크를 복사했어요")}><Icon d={I.share} size={22} /></button>
            <button className="hit" aria-label="찜" onClick={() => { setLiked(!liked); ui.toast(liked ? "찜을 풀었어요" : "찜했어요"); }}><Icon d={I.heart} size={22} color={liked ? "#C2571A" : "#191F28"} /></button>
          </div>} />
        <div className="pad">
          <div className="t26">{shop.name}</div>
          <div className="t14 ter" style={{ marginTop: 6 }}>{shop.cat === "pilates" ? "필라테스" : "헬스"} · {shop.dist}m</div>
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

            <div className="pad" style={{ marginTop: 30 }}>
              <div className="row"><div className="t18 b7">이용권</div><span className="t13 ter">업장 안내 가격</span></div>
              <div className="plans">
                {PLANS.map(([m, won]) => (
                  <button key={m} className={plan === m ? "on" : ""} onClick={() => setPlan(m)}>
                    <span>{m}개월</span><b>{man(won)} 원</b><em>월 {man(won / m)}</em>
                  </button>
                ))}
              </div>
            </div>

            <div className="pad" style={{ marginTop: 30 }}>
              <div className="t18 b7">업장 정보</div>
              <div className="info2">
                <div><span>주소</span><b>서울 강남구 역삼동 ○○길</b></div>
                <div><span>업종</span><b>{shop.cat === "pilates" ? "필라테스" : "체력단련장업"}</b></div>
                <div><span>면적</span><b>{shop.areaM2}㎡ · 약 {shop.pyeong}평</b></div>
                <div><span>개업</span><b>{2026 - shop.years}년</b></div>
              </div>
              <button className="rowlink" onClick={() => nav.go("record")}><span>업장 기록</span><Icon d={I.arrow} size={18} color="#B0B8C1" /></button>
              <button className="rowlink" onClick={() => ui.toast("정정 요청을 보냈어요")}><span>정보가 달라요</span><Icon d={I.arrow} size={18} color="#B0B8C1" /></button>
            </div>
          </div>
        )}
      </div>
      <div className="bottom"><button className={`btn acc-b ${d ? "" : "off"}`} style={{ flex: 1 }} onClick={() => nav.go("pay", { amount, plan })}>{man(amount)} 원 결제하기</button></div>
    </div>
  );
}
