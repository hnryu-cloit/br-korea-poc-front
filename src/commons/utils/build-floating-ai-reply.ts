import type { FloatingAiCardContextKey, FloatingAiChatMessage } from "@/commons/types/floating-ai-chat";

const cardContextReplies: Record<FloatingAiCardContextKey, FloatingAiChatMessage> = {
  "production:stock-risk": {
    id: 1,
    title: "생산 재고 위험 분석",
    content:
      "스트로베리 필드와 올드패션은 최근 30분 판매 속도가 평시보다 높아 1시간 내 품절 위험이 큽니다. 14:20 전 2차 생산을 등록하고, 주말 대비 상위 3개 품목은 생산량을 20% 이상 높이는 것을 권장합니다.",
    evidence: ["현재고 52개", "1시간 후 예측 8개", "4주 평균 2차 생산 14:15 / 40개"],
  },
  "production:inventory-status": {
    id: 1,
    title: "재고 수준 진단 결과",
    content:
      "부족 품목은 오늘 오후 피크 전까지 추가 생산이 필요합니다. 과잉 품목은 당일 소진을 위해 묶음 판매 또는 할인 행사를 고려할 수 있습니다. 적정 수준은 일 평균 판매량의 1.5배를 기준으로 잡는 게 안전합니다.",
    evidence: ["부족 품목 3건", "과잉 품목 2건", "적정 기준 1.5x 일 평균"],
  },
  "production:waste": {
    id: 1,
    title: "폐기 손실 원인 분석",
    content:
      "폐기가 많은 품목의 공통점은 오후 피크 이후 수요 급감 구간에서 과생산된 경우입니다. 생산 시점을 피크 직전으로 분산하고, 해당 품목의 2차 생산 수량을 10~15% 줄이면 폐기율을 낮출 수 있습니다.",
    evidence: ["17시 이후 수요 급감", "2차 생산 과잉 패턴", "4주 평균 폐기율 8.3%"],
  },
  "ordering:options": {
    id: 1,
    title: "주문 추천안 비교",
    content:
      "현재는 전주 동요일 안이 기본 추천이지만, 이번 주 캠페인 영향으로 과주문 가능성이 있어 전전주 동요일 값을 기준선으로 함께 보는 것이 안전합니다. 지난달 동기 대비 배달 채널 증가 추세를 감안하면 옵션 B가 더 균형 잡혀 있습니다.",
    evidence: ["옵션 A 최근 패턴 일치", "옵션 B 이상치 적음", "옵션 C 월간 시즌성 반영"],
  },
  "sales:summary": {
    id: 1,
    title: "매출 요약 분석",
    content:
      "오늘 매출은 지난주 같은 요일 대비 배달 채널에서 감소세가 확인됩니다. 점심 시간대 전환율 하락과 쿠폰 회수율 저하가 주요 원인으로 보이며, 피크 시간대(11~13시)에 배달 채널 집중 대응이 필요합니다.",
    evidence: ["11시~13시 배달 주문 감소", "앱 쿠폰 사용률 하락", "점심 세트 묶음 전환 저조"],
  },
};

export const buildFloatingAiReply = (
  pathname: string,
  prompt: string,
  cardContextKey?: FloatingAiCardContextKey | null,
): FloatingAiChatMessage => {
  if (cardContextKey && cardContextReplies[cardContextKey]) {
    return cardContextReplies[cardContextKey];
  }

  if (pathname === "/production") {
    return {
      id: 1,
      title: "생산 대응 제안",
      content:
        "스트로베리 필드와 올드패션은 최근 30분 판매 속도가 평시보다 높아 1시간 내 품절 위험이 큽니다. 14:20 전 2차 생산을 등록하고, 알림 메시지에는 현재고와 1시간 후 추정 재고를 같이 노출하는 편이 맞습니다.",
      evidence: ["현재고 52개", "1시간 후 예측 8개", "4주 평균 2차 생산 14:15 / 40개"],
    };
  }

  if (pathname === "/ordering") {
    return {
      id: 1,
      title: "주문 옵션 비교",
      content:
        "현재는 전주 동요일 안이 기본 추천이지만, 캠페인 영향으로 과주문 가능성이 있어 전전주 동요일 값을 기준선으로 함께 보여주는 것이 안전합니다. 점주 선택 화면에는 추천 사유와 반대 사유를 같이 두는 편이 좋습니다.",
      evidence: ["옵션 A 최근 패턴 일치", "옵션 B 이상치 적음", "옵션 C 월간 시즌성 반영"],
    };
  }

  if (pathname === "/sales") {
    return {
      id: 1,
      title: "매출 분석 액션",
      content:
        "배달 채널 감소는 단순 요약보다 점심 시간대 전환율 하락과 쿠폰 회수율 저하를 같이 보여줘야 바로 행동으로 이어집니다. 응답은 원인, 근거, 실행안 3단 구조가 가장 적합합니다.",
      evidence: ["11시~13시 배달 주문 감소", "앱 쿠폰 사용률 하락", "점심 세트 묶음 전환 저조"],
    };
  }

  if (pathname === "/orchestration") {
    return {
      id: 1,
      title: "정책 점검 요약",
      content:
        "매출과 손익 수치는 원문 그대로 LLM에 보내지 말고 집계값과 필요한 컬럼만 전달하는 쪽이 맞습니다. 민감정보 요청은 조회형 응답으로 다운그레이드하고, 최종 응답에는 출처와 로그 식별자를 남겨야 합니다.",
      evidence: ["FAQ/조회/분석/민감정보 요청 분류", "SQL/API 우선 처리", "감사 로그 저장"],
    };
  }

  return {
    id: 1,
    title: "운영 허브 요약",
    content:
      "현재 화면에서는 생산 리스크, 주문 마감 임박, 매출 질문 추천, 보안 정책 상태를 같은 맥락으로 보는 것이 중요합니다. 점주가 가장 먼저 할 일을 카드 단위로 제시하고, 상세 설명은 AI 패널에서 보조하는 구성이 적합합니다.",
    evidence: [prompt, "생산/주문/매출/보안 통합 맥락", "점주 승인형 의사결정 보조"],
  };
};