import type { FieldCaption, PageCaption } from "@/commons/types/field-caption";

export const PAGE_CAPTIONS: Record<string, PageCaption> = {
  dashboard: { subtitle: "점포 운영 주요 지표를 한눈에 확인합니다." },
  "production:status": { subtitle: "품목별 현재 재고와 생산 권고량을 제공합니다." },
  "production:inventory": { subtitle: "품목별 재고 수준과 판매 가능 수량을 확인합니다." },
  "production:waste": { subtitle: "기간별 폐기 수량과 손실 금액을 분석합니다." },
  "ordering:recommendations": { subtitle: "AI가 분석한 최적 발주량을 확인합니다." },
  "ordering:history": { subtitle: "과거 발주 내역과 실적을 조회합니다." },
  "analytics:sales": { subtitle: "기간별 매출 흐름과 채널별 성과를 분석합니다." },
  "analytics:market": { subtitle: "상권 내 경쟁 현황과 고객 분포를 확인합니다." },
};

export const FIELD_CAPTIONS: Record<string, FieldCaption> = {
  // 생산 현황 테이블
  "production:forecast_1h": {
    assumption: "현재 시간대 판매 속도가 이후 1시간 동안 유지된다고 가정합니다.",
    formula: "예측 재고 = 현재 재고 - (시간당 평균 판매량 × 1)",
    description: "1시간 후 예상 잔여 재고 수량입니다.",
  },
  "production:chance_loss": {
    assumption: "AI 권고 생산을 하지 않았을 때의 기회비용을 기준으로 합니다.",
    formula: "절감율 = 품절 예상 수량 × 단가 대비 생산 조치 기여분",
    description: "적시 생산으로 방지할 수 있는 찬스 로스 절감 비율입니다.",
  },
  "production:avg_first_prod_4w": {
    assumption: "최근 4주 영업일 기준 첫 번째 생산이 발생한 날만 포함합니다.",
    formula: "평균 = 4주 합계 1차 생산량 ÷ 생산 발생 일수",
    description: "최근 4주 1차 생산량의 평균값입니다.",
  },
  "production:avg_second_prod_4w": {
    assumption: "최근 4주 영업일 기준 두 번째 생산이 발생한 날만 포함합니다.",
    formula: "평균 = 4주 합계 2차 생산량 ÷ 생산 발생 일수",
    description: "최근 4주 2차 생산량의 평균값입니다.",
  },
  // 재고 현황 테이블
  "inventory:orderable_qty": {
    assumption: "재고 조정·ERP 처리 지연으로 인한 음수 재고는 0으로 처리합니다.",
    formula: "판매 가능 수량 = max(현재고 + 당일 판매량, 0)",
    description: "현재 시점에서 실제로 판매 가능한 수량입니다.",
  },
  "inventory:sold_qty": {
    description: "해당 기준일의 판매 수량입니다.",
  },
  "inventory:status": {
    assumption: "재고율(재고 ÷ 판매량)을 기준으로 세 단계로 분류합니다.",
    formula: "부족: 재고율 < 0 또는 품절 / 적정: 0 ≤ 재고율 < 0.35 / 여유: 재고율 ≥ 0.35",
    description: "품목의 현재 재고 수준 상태입니다.",
  },
  // 발주 이력 테이블
  "ordering:gap_rate": {
    assumption: "AI 추천량 대비 실제 확정량 차이를 절댓값 비율로 나타냅니다.",
    formula: "괴리율 = |확정량 - 발주량| ÷ 발주량 × 100",
    description: "AI 권고와 실제 발주 간의 편차를 나타냅니다.",
  },
  // FIFO 섹션
  "fifo:active_remaining": {
    assumption: "현재 active 상태인 Lot만 포함합니다. sold_out·expired Lot은 제외합니다.",
    formula: "잔여 수량 = Σ(초기 수량 - 소진 수량) — active Lot 기준",
    description: "유통기한이 남아있는 활성 Lot의 잔여 수량 합계입니다.",
  },
  "fifo:wasted_qty": {
    assumption: "유통기한 만료로 expired 처리된 Lot의 수량만 집계합니다.",
    formula: "폐기 수량 = Σ wasted_qty (expired Lot)",
    description: "기간 내 유통기한 만료로 폐기된 총 수량입니다.",
  },
  // 대시보드 카드
  "dashboard:production_summary": {
    description: "현재 시점 기준 생산 위험 품목 수와 주요 생산 지표를 요약합니다.",
  },
  "dashboard:sales_summary": {
    description: "오늘 매출 현황과 전일 대비 증감을 보여줍니다.",
  },
  "dashboard:ordering_summary": {
    description: "AI 발주 추천 대상과 마감 임박 품목을 요약합니다.",
  },
};
