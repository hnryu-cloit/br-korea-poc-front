export type HighlightStat = {
  label: string;
  value: string;
  tone?: "default" | "primary" | "danger" | "success";
};

export type InsightCard = {
  title: string;
  description: string;
  items: string[];
};

export type PromptCard = {
  label: string;
  prompt: string;
};

export const dashboardStats: HighlightStat[] = [
  { label: "품절 위험 SKU", value: "3건", tone: "danger" },
  { label: "주문 검토 필요", value: "1건", tone: "primary" },
  { label: "추천 질문 세트", value: "12개", tone: "success" },
  { label: "정책 로그 수집", value: "정상", tone: "default" },
];

export const dashboardInsights: InsightCard[] = [
  {
    title: "생산 관리 Agent",
    description: "최근 판매 추세와 4주 평균 생산 패턴을 결합해 다음 1시간의 재고 리스크를 추적합니다.",
    items: [
      "스트로베리 필드는 55분 후 품절 위험",
      "글레이즈드는 현재 생산 패턴 유지 권장",
      "2차 생산 권장 시점은 14:20",
    ],
  },
  {
    title: "주문 관리 Agent",
    description: "주문 마감 20분 전 3개 옵션과 특이사항을 함께 제시해 점주 판단을 보조합니다.",
    items: [
      "전주 동요일 옵션이 기본 추천",
      "전전주 동요일은 행사 영향 제외값으로 안정적",
      "전월 동요일은 배달 채널 회복 반영 필요",
    ],
  },
  {
    title: "매출 분석 Agent",
    description: "질의형 분석 결과를 바로 실행 가능한 액션으로 변환합니다.",
    items: [
      "오전 배달 전환율 하락 원인 분석",
      "T-day 이후 재방문 액션 제안",
      "채널별 이익률 차이와 대응 권고",
    ],
  },
];

export const productionStats: HighlightStat[] = [
  { label: "현재 재고", value: "146개", tone: "default" },
  { label: "1시간 후 예측", value: "38개", tone: "danger" },
  { label: "알림 트리거", value: "활성", tone: "primary" },
  { label: "찬스 로스 영향", value: "-10%", tone: "success" },
];

export const orderingStats: HighlightStat[] = [
  { label: "마감까지", value: "20분", tone: "danger" },
  { label: "추천 옵션", value: "3개", tone: "primary" },
  { label: "점주 선택", value: "대기", tone: "default" },
  { label: "사유 저장", value: "필수", tone: "success" },
];

export const salesStats: HighlightStat[] = [
  { label: "응답 유형", value: "SQL/API 우선", tone: "primary" },
  { label: "추천 질문", value: "12개", tone: "success" },
  { label: "출처 포함", value: "92%", tone: "default" },
  { label: "실행 인사이트", value: "3건", tone: "danger" },
];

export const orchestrationStats: HighlightStat[] = [
  { label: "민감정보 마스킹", value: "적용", tone: "success" },
  { label: "권한 구분", value: "점주/운영/본사", tone: "primary" },
  { label: "프롬프트 로그", value: "감사 가능", tone: "default" },
  { label: "RAG 출처", value: "표시", tone: "success" },
];

export const salesPrompts: PromptCard[] = [
  { label: "배달 감소", prompt: "이번 주 배달 건수가 지난주보다 줄어든 원인을 알려줘" },
  { label: "T-day 성과", prompt: "T-day 행사 이후 매출과 재방문 영향이 어땠는지 분석해줘" },
  { label: "시간대 비교", prompt: "오전 10시부터 12시까지 채널별 매출 차이를 비교해줘" },
  { label: "상품 믹스", prompt: "도넛과 커피 묶음 판매를 늘리기 위한 액션을 제안해줘" },
];

export const orderingOptions: InsightCard[] = [
  {
    title: "옵션 A · 전주 동요일",
    description: "기본 추천안. 최근 날씨와 점심 피크를 반영하면 가장 무난한 선택입니다.",
    items: [
      "캠페인 영향으로 글레이즈드 수요 8% 증가",
      "오후 배달 채널은 소폭 감소",
      "추천 사유: 가장 최근 패턴과 유사",
    ],
  },
  {
    title: "옵션 B · 전전주 동요일",
    description: "이상치가 적어 기준선으로 보기 좋습니다.",
    items: [
      "행사 영향이 제거된 평시 수요",
      "재고 리스크가 가장 낮음",
      "추천 사유: 과주문 방지 관점에서 안정적",
    ],
  },
  {
    title: "옵션 C · 전월 동요일",
    description: "월간 패턴을 반영하되 배달 회복분을 추가 보정해야 합니다.",
    items: [
      "배달 건수는 현재보다 12% 높았음",
      "커피 동반 구매율이 높았음",
      "추천 사유: 월간 시즌성 반영",
    ],
  },
];

export const orchestrationCards: InsightCard[] = [
  {
    title: "질의 라우팅",
    description: "FAQ, 데이터 조회, 분석, 민감정보 요청 유형별 처리 규칙을 분리합니다.",
    items: [
      "정형 조회는 SQL/API 우선",
      "민감정보 요청은 즉시 다운그레이드 또는 차단",
      "분석형 질의만 요약 문맥과 함께 LLM 전달",
    ],
  },
  {
    title: "보안 정책",
    description: "민감정보 직접 전송 제한과 감사 가능한 로그를 기본 정책으로 둡니다.",
    items: [
      "매출, 손익, 생산량은 마스킹 또는 축약",
      "프롬프트와 응답은 감사 로그에 저장",
      "권한별로 조회 가능한 범위를 구분",
    ],
  },
];
