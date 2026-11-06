// 화면 문구와 기준값. 업장 목록은 public/data/shops.json (서울 인허가, 상호 가림)에서 읽는다.
// 크기 단계: 작은 편 약 49평(162.4㎡) 이하 / 중간 / 큰 편 약 99평(328.6㎡) 이상. 작은 편은 큰 편보다 문을 닫는 일이 약 2배.

export const TIERS = {
  small: { label: "작은 편", bar: 92, tag: "약 2배", note: "같은 크기 업장들은 큰 업장보다 문을 닫는 일이 약 2배 많았어요" },
  mid: { label: "중간", bar: 76, tag: "", note: "작은 업장과 큰 업장 사이예요" },
  large: { label: "큰 편", bar: 46, tag: "기준", note: "같은 크기 업장들은 문을 닫는 일이 가장 적었어요" },
};

export const CHECKS = [
  { id: "guarantee", title: "보증보험", q: "보증보험에 가입돼 있나요?", sub: "가입돼 있으면 문 닫아도 남은 돈을 돌려받아요", opts: ["가입됨", "안 됨", "모름"], icon: "shield", ask: "회원 보증보험에 가입돼 있나요?" },
  { id: "refund", title: "환불 기준서", q: "환불 기준을 글로 받았나요?", sub: "중도에 그만둘 때 얼마 돌려받는지 적힌 종이", opts: ["받음", "못 받음", "모름"], icon: "doc", ask: "중도 해지할 때 환불 기준을 글로 받을 수 있을까요?" },
  { id: "card", title: "카드 할부", q: "카드 3개월 이상 할부로 내나요?", sub: "할부면 문 닫았을 때 남은 결제를 멈출 수 있어요", opts: ["할부로", "일시불", "아직"], icon: "card", ask: "카드 3개월 이상 할부로 결제할게요." },
];

export const PASS = { name: "12개월권", price: 600000, days: 365, daysLeft: 365 }; // 등록 직후는 365일 남음
export const SKIP_DAYS = 90; // 시연에서 '3개월 뒤'로 넘기는 날 수

export const won = (n) => `${Math.round(n / 10000)}만 원`;
export const remain = (daysLeft, price = PASS.price) => price * Math.max(0, daysLeft) / PASS.days;
// 안심결제: 절반은 업장에 바로, 절반은 결제대행사가 맡아 매달 정산 → 닫히면 아직 안 보낸 몫이 돌아온다
export const held = (daysLeft, price = PASS.price) => remain(daysLeft, price) * 0.5;
// 중도 해지 시 환급 (소비자분쟁해결기준: 쓴 기간 이용료 + 총액의 10% 위약금 공제)
export const refundIfQuit = (price, usedDays) => Math.max(0, price - (price * usedDays) / PASS.days - price * 0.1);
// 업장이 고른 '돈 지키는 수단'. 안심결제: 결제대행사가 맡아 매달 나눠 정산 / 보증보험: 닫으면 보험사가 환급 (시연용 가정)
export const PROTECT = {
  escrow: { name: "안심결제", short: "절반 보관", body: "결제 금액 절반을 결제대행사가 보관" },
  insurance: { name: "보증보험", short: "보험사 가입", body: "닫히면 보험사가 환급" },
};
// 할부 항변: 20만 원 이상, 3개월 이상 신용카드 할부
export const canObject = (pay) => !!pay && (pay.method === "할부" || pay.method === "안심결제") && pay.amount >= 200000 && pay.months >= 3;
export const man = (n) => `${+(n / 10000).toFixed(1)}만`;

export const ALERT_TEXT = {
  signal: {
    tag: "참고 신호", title: "사장님 글이 3개월째 없어요",
    body: "문을 닫는다는 뜻은 아니에요.",
  },
  closed: {
    tag: "폐업 등록", title: "인허가에 폐업이 등록됐어요",
    body: "아래 순서대로 하면 돼요.",
  },
};

export const RECORD = {
  posts: [60, 75, 55, 80, 65, 50, 40, 30, 15, 0, 0, 0],
  log: [
    { m: "11월", t: "사장님 글 3개월째 없음", s: "알림 없이 참고로 기록", hot: true },
    { m: "9월", t: "12개월권 60만 → 55만 원", s: "가격 정보 바뀜" },
    { m: "7월", t: "강사 3명 → 2명", s: "업장 소개 글 기준" },
    { m: "3월", t: "인허가 확인 · 영업 중", s: "면적 · 대표자 그대로" },
  ],
};
