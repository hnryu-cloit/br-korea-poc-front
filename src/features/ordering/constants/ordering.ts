export type OrderingItem = { name: string; quantity: number };

export type OrderingOption = {
  id: string;
  title: string;
  basis: string;
  description: string;
  items: OrderingItem[];
  reasoning: string;
  metrics: { key: string; value: string }[];
  specialFactors?: string[];
  recommended?: boolean;
};

export const orderingStats = [
  { label: "주문 마감까지", value: "17분", tone: "danger" as const },
  { label: "추천 옵션", value: "3개", tone: "primary" as const },
  { label: "주문 목적", value: "누락 방지", tone: "default" as const },
  { label: "최종 의사결정", value: "점주 직접", tone: "success" as const },
];

export const orderingQuickPrompts = [
  "추천 주문량 근거는?",
  "어제와 얼마나 다른가요?",
  "날씨가 주문에 영향을 주나요?",
  "조기 품절은 어떻게 반영되나요?",
];

export const orderingOptions: OrderingOption[] = [
  {
    id: "yesterday",
    title: "전일 기준",
    basis: "어제 판매량 기반",
    description: "어제와 동일한 수량으로 주문합니다.",
    items: [
      { name: "초코 도넛", quantity: 120 },
      { name: "딸기 도넛", quantity: 90 },
      { name: "글레이즈드 도넛", quantity: 150 },
      { name: "크림 도넛", quantity: 100 },
      { name: "말차 도넛", quantity: 70 },
    ],
    reasoning: "어제 월요일 판매량과 잔여 재고를 기준으로 산정했습니다.",
    metrics: [
      { key: "재고 소진율", value: "95%" },
      { key: "품절 품목", value: "0개" },
      { key: "잔여 재고", value: "5%" },
    ],
  },
  {
    id: "lastweek",
    title: "전주 동요일 기준",
    basis: "지난주 월요일 판매량 기반",
    description: "지난주 같은 요일 판매량과 최근 증가 추세를 반영합니다.",
    items: [
      { name: "초코 도넛", quantity: 135 },
      { name: "딸기 도넛", quantity: 95 },
      { name: "글레이즈드 도넛", quantity: 160 },
      { name: "크림 도넛", quantity: 110 },
      { name: "말차 도넛", quantity: 80 },
    ],
    reasoning: "지난주 월요일 대비 최근 3주 평균 증가 추세와 날씨 유사도를 반영했습니다.",
    metrics: [
      { key: "3주 평균 증가율", value: "+12%" },
      { key: "날씨 유사도", value: "90%" },
      { key: "재고 회전율", value: "98%" },
    ],
    specialFactors: ["날씨: 맑음, 22°C", "조기 품절: 말차 도넛 +5개 보정"],
    recommended: true,
  },
  {
    id: "pattern",
    title: "점주 반복 패턴",
    basis: "최근 4주 점주 선택 패턴",
    description: "점주가 자주 수정하는 수량과 최근 월요일 패턴을 반영합니다.",
    items: [
      { name: "초코 도넛", quantity: 130 },
      { name: "딸기 도넛", quantity: 100 },
      { name: "글레이즈드 도넛", quantity: 155 },
      { name: "크림 도넛", quantity: 105 },
      { name: "말차 도넛", quantity: 75 },
    ],
    reasoning: "점주님의 최근 4주 월요일 선택 패턴과 수정 빈도를 개인화 기본값으로 반영했습니다.",
    metrics: [
      { key: "4주 평균 선택", value: "100%" },
      { key: "수정 빈도", value: "낮음" },
      { key: "패턴 신뢰도", value: "85%" },
    ],
    specialFactors: ["개인화 기본값 적용"],
  },
];
