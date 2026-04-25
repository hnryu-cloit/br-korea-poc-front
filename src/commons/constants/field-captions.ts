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
  // 홈 - 주요 일정
  "home:upcoming_events": {
    assumption:
      "통신사 할인 일정과 캠페인 일정을 동일 큐에 합쳐 마감일자가 가까운 순으로 정렬합니다.",
    formula: "정렬 기준 = 마감일자 ASC · 표시 건수 = 상위 20건",
    description: "기준일자 이후 마감되는 통신사 할인·캠페인을 마감 임박 순으로 보여줍니다.",
  },
  // 생산 현황 - 대상 데이터 정의
  "production:scope": {
    assumption:
      "해당 지점에서 생산하는 제품 중 최근 7일 이내 매출 이력 또는 생산 이력이 있는 SKU만 포함합니다.",
    description: "생산 현황 테이블에 노출되는 SKU 선정 기준입니다.",
  },
  // 생산 현황 - 추천 생산 수량
  "production:recommended_qty": {
    assumption: "4주간 1차·2차 평균 생산량을 기준으로 현재 시점 부족분을 보정합니다.",
    formula: "추천 생산 수량 = 4주 평균 1차 생산량 + 4주 평균 2차 생산량 - 현재 재고 수량",
    description: "현재 재고와 4주 평균 생산량 격차를 보정한 권고 생산 수량입니다.",
  },
  // 생산 현황 - 현재 판매 속도
  "production:sales_velocity": {
    assumption: "최근 30분 동안 발생한 판매 수량을 시간당으로 환산해 평균 판매 속도와 비교합니다.",
    formula: "현재 판매 속도 = 최근 30분 판매 수량 × 2 (시간당 환산)",
    description: "직전 30분 판매량을 시간당으로 환산한 실시간 판매 속도입니다.",
  },
  // 폐기 손실 - 조회 기준일
  "production:waste_reference_date": {
    assumption: "기준 일자의 전날 하루를 폐기 산정 기준일로 사용합니다.",
    description: "폐기 손실 화면이 집계하는 영업일 정의입니다.",
  },
  // 폐기 손실 - 조회 대상 데이터
  "production:waste_dataset": {
    assumption:
      "조회 기준일 전일까지 입고된 미폐기 잔여 재고와 조회 기준일 당일 생산분을 합산합니다.",
    description: "폐기 손실 산정 대상이 되는 재고 풀의 정의입니다.",
  },
  // 폐기 손실 - 폐기 대상
  "production:waste_target": {
    assumption: "FIFO 판매 차감 후 잔여분 중 유통기한이 경과한 수량만 폐기로 인식합니다.",
    formula: "폐기 수량 = Σ(잔량 - FIFO 판매 차감) | 유통기한 < 기준일",
    description: "FIFO 차감 후 유통기한 경과로 폐기되는 수량입니다.",
  },
  // 폐기 손실 - 손실 금액
  "production:waste_loss_amount": {
    assumption:
      "원가 데이터 부재로 매출액 기준으로 손실 금액을 산정합니다(원가 확보 시 원가 기준으로 전환).",
    formula: "손실 금액 = 폐기 수량 × 판매가",
    description: "폐기 수량을 판매가로 환산한 손실 금액 추정치입니다.",
  },
  // 주문 관리 공통
  "ordering:scope": {
    assumption:
      "해당 지점에서 최근 7일 이내 주문(발주) 이력이 있는 품목만 추천 대상으로 사용합니다.",
    description: "주문 추천 화면이 다루는 품목 범위 정의입니다.",
  },
  // 발주 이력 공통
  "ordering:history_scope": {
    assumption:
      "발주 시점은 매일 오후 12시로 가정하며, 기준 시간이 발주 시점 이전이면 전일까지, 이후면 당일까지의 발주 이력을 반영합니다.",
    description: "기준 시간 기준으로 발주 이력 반영 범위를 결정합니다.",
  },
  // 발주 이력 - 주요 변동 품목
  "ordering:top_change_items": {
    assumption:
      "변동률 절대값을 기준으로 내림차순 정렬하며, 평균값은 발주 시점 이전이면 전일 기준 4주, 이후면 당일 포함 4주 데이터를 사용합니다.",
    formula: "변동률 = (당일 발주량 - 4주 평균) ÷ 4주 평균 × 100 · 정렬 = |변동률| DESC",
    description: "4주 평균 대비 변동률 절대값이 큰 순서로 노출되는 품목입니다.",
  },
  // 매출 현황
  "analytics:sales_overview": {
    description: "기간별 매출 흐름과 채널별 성과를 종합해 보여줍니다.",
  },
  // 손익 분석 - 공통 비교 기준
  "sales:comparison_basis": {
    assumption:
      "기준 일자의 전날을 비교 시점으로 삼으며, 일자/기간 조회 모두 전주(7일 전 동요일)와 전월(전월 동일 주차의 동요일) 기준을 제공합니다.",
    formula:
      "일자 전주 = 7일 전 동요일 · 일자 전월 = 전월 동일 주차 동요일 · 기간 전주 = 7일 전 동요일 구성 기간 · 기간 전월 = 전월 동일 주차 동요일 구성 기간",
    description: "손익 분석 화면 전체에서 사용하는 비교 기준 정의입니다.",
  },
  // 손익 분석 - 객단가 지수 (단독 정의)
  "sales:avg_ticket_index": {
    assumption:
      "최근 4주간 동 지점 일별 객단가의 최소·최대 범위를 0~100으로 환산합니다. 유사 상권 지점이 정의되면 비교 기준으로 확장합니다.",
    formula:
      "객단가 = 매출 ÷ 주문건수 · 객단가 지수 = (당일 객단가 - 4주 최소) ÷ (4주 최대 - 4주 최소) × 100",
    description: "최근 4주 객단가 분포에서 현재 객단가의 상대 위치를 0~100으로 표시합니다.",
  },
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
  // 매출 기회 분석 카드
  "sales:opportunity_marketing_roi": {
    description: "캠페인별 마케팅 투자 대비 매출 성과를 분석합니다.",
    formula: "ROI = (매출 기여분 - 마케팅 비용) ÷ 마케팅 비용 × 100",
    assumption: "캠페인 기간 중 발생한 매출 증분을 마케팅 효과로 귀속합니다.",
  },
  "sales:opportunity_channel_payment": {
    description: "채널 및 결제 수단별 수익성과 전환율을 진단합니다.",
    assumption: "채널별 수수료와 결제 수단별 할인율을 반영한 실수익 기준입니다.",
  },
  "sales:opportunity_promotion_efficiency": {
    description: "프로모션·제휴 할인의 매출 기여 대비 비용 효율을 분석합니다.",
    formula: "효율 = 프로모션 기간 추가 매출 ÷ 할인 비용",
    assumption: "프로모션 미적용 기간의 기저 매출을 비교 기준으로 사용합니다.",
  },
  "sales:opportunity_store_benchmark": {
    description: "동일 클러스터 매장과의 매출 및 운영 지표를 비교합니다.",
    assumption: "클러스터는 상권 유형·규모·영업시간 유사도 기준으로 분류됩니다.",
  },
  // 손익분석 차트
  "sales:weekly_revenue_trend": {
    assumption: "조회 기간 내 일별 총 매출과 순매출(할인·수수료 차감 후)을 표시합니다.",
    formula: "순매출 = 총 매출 - 채널 수수료 - 할인 금액",
    description: "기간별 매출과 순매출의 흐름을 비교합니다.",
  },
  "sales:weekly_revenue_composition": {
    assumption: "총 매출을 순매출과 차감비용으로 분리하여 구성비를 표시합니다.",
    formula: "차감비용 = 총 매출 - 순매출 (채널 수수료 + 할인 합계)",
    description: "일별 매출 구성에서 실수익(순매출)과 비용 차감 비중을 보여줍니다.",
  },
  "sales:today_profit_composition": {
    assumption: "마진율은 최근 4주간 매출이 발생한 제품의 제품별 마진율 평균을 적용합니다.",
    formula:
      "마진율 = Avg((판매가 - 원가) / 판매가) · 추정 이익 = 오늘 매출 × 마진율 · 비용 추정 = 오늘 매출 - 추정 이익",
    description: "오늘 매출에서 추정 이익과 비용이 차지하는 비율입니다.",
  },
  "sales:top_products": {
    assumption: "조회 기간 내 판매 금액 기준 상위 6개 상품을 집계합니다.",
    description: "판매 금액 순으로 상위 6개 상품의 매출을 비교합니다.",
  },
  "sales:core_indicators": {
    assumption:
      "각 지표를 0~100으로 정규화합니다. 객단가 지수는 8,000원 기준, 메뉴 다양성은 품목 수 × 17 상한 100입니다.",
    formula:
      "마진율 점수 = avg_margin_rate × 100 · 객단가 지수 = (평균 순이익/건) ÷ 8,000 × 100 · 메뉴 다양성 = 품목 수 × 17",
    description: "마진율·순매출 비율·수익성·메뉴 다양성·객단가 5개 지표를 방사형으로 비교합니다.",
  },
  "sales:product_revenue_share": {
    assumption: "조회 기간 내 판매 금액 기준 상위 6개 상품의 면적 비중을 표시합니다.",
    description: "전체 매출 대비 상품별 매출 비중을 면적으로 시각화합니다.",
  },
  "sales:weekly_net_revenue": {
    assumption: "조회 기간 내 전체 일자의 순매출 합산이며, 할인·수수료 차감 후 기준입니다.",
    formula: "주간 누적 순매출 = Σ 일별 순매출",
    description: "기간 내 누적 순매출 합계와 일 평균 순매출입니다.",
  },
  "sales:weekly_total_revenue": {
    assumption: "할인 차감 전 총 매출 기준이며, 실제 DB에 기록된 원 매출입니다.",
    formula: "주간 총 매출 = Σ 일별 총 매출 (할인 차감 전)",
    description: "기간 내 할인 적용 전 원 매출 합계입니다.",
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
