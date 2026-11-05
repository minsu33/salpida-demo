// 시연용 예시 데이터. 업장은 가상이고, 크기 단계와 문구 기준은 분석 결과(서울·경기 인허가 2016~2026)를 따른다.
// 크기 단계: 작은 편 약 49평(162.4㎡) 이하 / 중간 / 큰 편 약 99평(328.6㎡) 이상. 작은 편은 큰 편보다 문을 닫는 일이 약 2배.

export const TIERS = {
  small: { label: "작은 편", bar: 90, tag: "2배", note: "작은 업장은 큰 업장보다 문을 닫는 일이 약 2배 많았어요" },
  mid: { label: "중간", bar: 75, tag: "", note: "작은 업장과 큰 업장 사이예요" },
  large: { label: "큰 편", bar: 50, tag: "기준", note: "큰 업장은 문을 닫는 일이 가장 적었어요" },
};

export const SHOPS = [
  { id: "bodyfit", name: "바디핏 OO점", tier: "small", pyeong: 45, dist: "320m", years: 7, guard: true, x: 220, y: 345, checkedAt: "11월 3일" },
  { id: "dd", name: "△△휘트니스", tier: "large", pyeong: 120, dist: "540m", years: 11, guard: false, x: 95, y: 410, checkedAt: "11월 3일" },
  { id: "pt", name: "□□PT", tier: "mid", pyeong: 70, dist: "410m", years: 3, guard: false, x: 300, y: 225, checkedAt: "11월 3일" },
  { id: "oo", name: "OO짐", tier: "small", pyeong: 38, dist: "610m", years: 2, guard: true, x: 120, y: 250, checkedAt: "11월 3일" },
];

export const CHECKS = [
  { id: "guarantee", title: "보증보험 가입", sub: "문 닫으면 남은 돈을 돌려받아요", ask: "혹시 회원 보증보험 들어 있나요? 증권 번호 알 수 있을까요?" },
  { id: "refund", title: "환불 기준서", sub: "중도 해지할 때 돌려받는 기준", ask: "중도 해지하면 얼마 돌려받는지 적힌 기준서 받을 수 있을까요?" },
  { id: "card", title: "3개월 이상 할부", sub: "20만 원 이상이면 문 닫을 때 남은 할부를 멈출 수 있어요", ask: "카드 3개월 이상 할부로 결제할게요." },
];

export const PASS = { name: "12개월권", price: "60만 원", daysLeft: 214 };

export const ALERT = {
  title: "사장님 글이 3개월째 올라오지 않았어요",
  body: "문을 닫는다는 뜻은 아니에요. 닫기 전 업장에서 자주 보인 모습이라 알려 드려요.",
};

export const HISTORY = [
  { m: "11.3", t: "인허가 확인 · 영업 중", s: "주 1회 서울·경기 인허가 비교" },
  { m: "10.27", t: "인허가 확인 · 영업 중", s: "바뀐 점 없음" },
];

export const RECORD = {
  months: 14,
  posts: [60, 75, 55, 80, 65, 50, 40, 30, 15, 0, 0, 0],
  log: [
    { m: "11월", t: "사장님 글 3개월째 없음", s: "참고 신호로 알렸어요", hot: true },
    { m: "9월", t: "12개월권 60만 → 55만 원", s: "가격 정보 바뀜" },
    { m: "7월", t: "강사 3명 → 2명", s: "업장 소개 글 기준" },
    { m: "3월", t: "인허가 확인 · 영업 중", s: "면적 · 대표자 그대로" },
  ],
};
