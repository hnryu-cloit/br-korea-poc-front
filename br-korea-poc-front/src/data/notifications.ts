export type NotificationItem = {
  id: number;
  category: "alert" | "workflow" | "analysis";
  title: string;
  description: string;
  time: string;
  unread: boolean;
};

export const notifications: NotificationItem[] = [
  {
    id: 1,
    category: "alert",
    title: "생산 알림 발송 필요",
    description: "스트로베리 필드 1시간 내 품절 위험이 감지되었습니다.",
    time: "방금 전",
    unread: true,
  },
  {
    id: 2,
    category: "workflow",
    title: "주문 추천 생성 완료",
    description: "전주/전전주/전월 동요일 기준 3개 옵션이 준비되었습니다.",
    time: "4분 전",
    unread: true,
  },
  {
    id: 3,
    category: "analysis",
    title: "매출 질의 응답 준비",
    description: "배달 채널 감소 원인과 액션 아이템이 정리되었습니다.",
    time: "18분 전",
    unread: false,
  },
];
