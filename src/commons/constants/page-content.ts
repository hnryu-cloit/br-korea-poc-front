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

export const salesStats: HighlightStat[] = [
  { label: "응답 유형", value: "SQL/API 우선", tone: "primary" },
  { label: "추천 질문", value: "12개", tone: "success" },
  { label: "출처 포함", value: "92%", tone: "default" },
  { label: "실행 인사이트", value: "3건", tone: "danger" },
];

// 오케스트레이션 정책 항목은 시스템 정책 설명으로 정적 텍스트 유지
export const orchestrationStats: HighlightStat[] = [
  { label: "민감정보 마스킹", value: "적용", tone: "success" },
  { label: "권한 구분", value: "점주/운영/본사", tone: "primary" },
  { label: "프롬프트 로그", value: "감사 가능", tone: "default" },
  { label: "RAG 출처", value: "표시", tone: "success" },
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
