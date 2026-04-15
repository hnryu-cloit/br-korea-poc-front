import type { FloatingAiChatMessage } from "@/commons/types/floating-ai-chat";

export const buildFloatingAiReply = (
  pathname: string,
  prompt: string,
): FloatingAiChatMessage => {
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
