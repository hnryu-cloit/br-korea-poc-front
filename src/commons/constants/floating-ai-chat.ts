import type { FloatingAiChatRouteGuide } from "@/commons/types/floating-ai-chat";

export const floatingAiChatRouteGuides: Record<string, FloatingAiChatRouteGuide> = {
  "/": {
    title: "통합 운영 해설",
    subtitle: "현재 화면의 핵심 리스크와 바로 해야 할 조치를 요약합니다.",
    quickActions: [
      { label: "품절 위험", prompt: "지금 가장 먼저 대응해야 할 품절 위험을 알려줘" },
      { label: "주문 검토", prompt: "주문 마감 전에 꼭 봐야 할 포인트를 정리해줘" },
      { label: "분석 요약", prompt: "오늘 매출 분석에서 바로 실행할 인사이트를 알려줘" },
    ],
  },
  "/analytics": {
    title: "질의형 분석 해설",
    subtitle: "SQL/API 우선 처리 경로와 LLM 호출 최소화 구조를 설명합니다.",
    quickActions: [
      { label: "라우팅 설명", prompt: "이 질의가 왜 SQL 우선 처리되는지 설명해줘" },
      { label: "토큰 절감", prompt: "LLM 토큰 사용량을 줄이는 방법을 알려줘" },
      { label: "분석 구조", prompt: "RAG 출처 응답 구조를 짧게 설명해줘" },
    ],
  },
  "/production": {
    title: "생산 관리 해설",
    subtitle: "지금 당장 만들어야 할 메뉴와 우선순위를 정리합니다.",
    quickActions: [
      { label: "뭐부터 만들어?", prompt: "지금 당장 뭐부터 만들어야 해?" },
      { label: "품절되면 얼마야?", prompt: "지금 품절되면 얼마 날리는 거야?" },
      { label: "언제 만들어?", prompt: "오늘 생산 타이밍을 언제로 잡는 게 좋아?" },
    ],
  },
  "/production/status": {
    title: "생산 관리 해설",
    subtitle: "지금 당장 만들어야 할 메뉴와 우선순위를 정리합니다.",
    quickActions: [
      { label: "뭐부터 만들어?", prompt: "지금 당장 뭐부터 만들어야 해?" },
      { label: "품절되면 얼마야?", prompt: "지금 품절되면 얼마 날리는 거야?" },
      { label: "언제 만들어?", prompt: "오늘 생산 타이밍을 언제로 잡는 게 좋아?" },
    ],
  },
  "/production/waste-loss": {
    title: "생산 관리 해설",
    subtitle: "지금 당장 만들어야 할 메뉴와 우선순위를 정리합니다.",
    quickActions: [
      { label: "뭐부터 만들어?", prompt: "지금 당장 뭐부터 만들어야 해?" },
      { label: "품절되면 얼마야?", prompt: "지금 품절되면 얼마 날리는 거야?" },
      { label: "언제 만들어?", prompt: "오늘 생산 타이밍을 언제로 잡는 게 좋아?" },
    ],
  },
  "/production/inventory-diagnosis": {
    title: "생산 관리 해설",
    subtitle: "지금 당장 만들어야 할 메뉴와 우선순위를 정리합니다.",
    quickActions: [
      { label: "뭐부터 만들어?", prompt: "지금 당장 뭐부터 만들어야 해?" },
      { label: "품절되면 얼마야?", prompt: "지금 품절되면 얼마 날리는 거야?" },
      { label: "언제 만들어?", prompt: "오늘 생산 타이밍을 언제로 잡는 게 좋아?" },
    ],
  },
  "/ordering": {
    title: "주문 관리 해설",
    subtitle: "마감 전 놓치지 말아야 할 주문 포인트를 확인합니다.",
    quickActions: [
      { label: "어떤 거 골라?", prompt: "지금 주문 어떤 안으로 하는 게 좋아?" },
      { label: "안 하면 어떻게 돼?", prompt: "지금 주문 안 하면 어떻게 돼?" },
      { label: "지난번이랑 달라?", prompt: "지난번 주문이랑 비교해서 이번에 바뀐 게 있어?" },
    ],
  },
  "/ordering/recommendations": {
    title: "주문 관리 해설",
    subtitle: "마감 전 놓치지 말아야 할 주문 포인트를 확인합니다.",
    quickActions: [
      { label: "어떤 거 골라?", prompt: "지금 주문 어떤 안으로 하는 게 좋아?" },
      { label: "안 하면 어떻게 돼?", prompt: "지금 주문 안 하면 어떻게 돼?" },
      { label: "지난번이랑 달라?", prompt: "지난번 주문이랑 비교해서 이번에 바뀐 게 있어?" },
    ],
  },
  "/ordering/history": {
    title: "발주 이력 해설",
    subtitle: "발주 누락 패턴과 자동/수동 발주 흐름을 점검합니다.",
    quickActions: [
      { label: "누락 패턴", prompt: "최근 발주 누락이 반복되는 패턴이 있나요?" },
      { label: "자동/수동 비교", prompt: "자동 발주와 수동 발주 비중 변화가 어떻게 됐어?" },
      { label: "품목 개선안", prompt: "다음 발주에서 조정해야 할 품목을 알려줘." },
    ],
  },
  "/sales": {
    title: "매출 분석 해설",
    subtitle: "오늘 장사 결과와 다음 액션을 바로 확인합니다.",
    quickActions: [
      { label: "오늘 장사 어때?", prompt: "오늘 장사 잘 된 거야 안 된 거야?" },
      { label: "이대로 가면?", prompt: "이번 달 이 페이스면 얼마 남아?" },
      { label: "뭘 바꿔야 해?", prompt: "매출 올리려면 지금 당장 뭘 바꾸면 돼?" },
    ],
  },
  "/sales/metrics": {
    title: "매출 분석 해설",
    subtitle: "오늘 장사 결과와 다음 액션을 바로 확인합니다.",
    quickActions: [
      { label: "오늘 장사 어때?", prompt: "오늘 장사 잘 된 거야 안 된 거야?" },
      { label: "이대로 가면?", prompt: "이번 달 이 페이스면 얼마 남아?" },
      { label: "뭘 바꿔야 해?", prompt: "매출 올리려면 지금 당장 뭘 바꾸면 돼?" },
    ],
  },
  "/settings": {
    title: "보안 정책 해설",
    subtitle: "질의 라우팅, 민감정보 보호, 감사 로그 기준을 화면 문맥으로 해설합니다.",
    quickActions: [
      { label: "라우팅 설명", prompt: "이 질의는 왜 SQL/API 우선 처리가 맞는지 설명해줘" },
      { label: "마스킹 기준", prompt: "현재 화면에서 마스킹해야 할 민감정보를 정리해줘" },
      { label: "출처 응답", prompt: "RAG 출처 응답 구조를 짧게 설명해줘" },
    ],
  },
};
