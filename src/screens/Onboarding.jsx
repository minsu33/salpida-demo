import { useEffect, useState } from "react";
import { Mark, Icon, I, Status } from "../components.jsx";
import { useStore } from "../lib/store.jsx";

// 처음 설치했을 때: 로고 → 소개 한 장 → 알림 허용 → 지도. 다음부터는 Splash만 잠깐.
const POINTS = [
  [I.search, "결제 전", "업장 크기부터 확인"],
  [I.shield, "결제할 때", "닫혀도 전액 환불"],
  [I.bell, "결제 후", "닫히면 바로 알림"],
];

const Logo = () => <div className="s splash"><div className="splash-mark"><Mark size={96} /></div><div className="splash-word">살핌<span /></div></div>;

export function Splash({ nav }) {
  useEffect(() => { const t = setTimeout(() => nav.tab("map"), 700); return () => clearTimeout(t); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <Logo />;
}

export function Onboarding({ nav }) {
  const { dispatch } = useStore();
  const [step, setStep] = useState("splash");
  const [ask, setAsk] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStep("intro"), 1100); return () => clearTimeout(t); }, []);
  const start = () => { dispatch({ type: "onboarded" }); nav.tab("map"); };

  if (step === "splash") return <Logo />;
  return (
    <div className="s">
      <Status />
      <div className="intro fadein">
        <Mark size={56} />
        <div className="intro-t">선결제 전에,<br />업장부터 살펴보세요</div>
        <div className="intro-list">
          {POINTS.map(([d, k, t]) => (
            <div key={k}><span><Icon d={d} size={22} color="#C2571A" w={2.1} /></span><em>{k}</em><b>{t}</b></div>
          ))}
        </div>
      </div>
      <div className="bottom"><button className="btn acc-b" style={{ flex: 1 }} onClick={() => setAsk(true)}>시작하기</button></div>
      {ask && (
        <div className="sys-dim">
          <div className="sys">
            <b>'살핌'에서 알림을 보내고자 합니다</b>
            <p>등록한 업장에 폐업이 등록되면 알려 드려요.</p>
            <div className="sys-btns"><span onClick={start}>허용 안 함</span><span style={{ fontWeight: 700 }} onClick={start}>허용</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
