import type { FieldCaption, PageCaption } from "@/commons/types/field-caption";

export const PAGE_CAPTIONS: Record<string, PageCaption> = {
  dashboard: {subtitle: "점포 운영 주요 지표를 한눈에 확인합니다."},
  "production:status": {subtitle: "해당 지점에서 생산하는 품목별 현재 재고와 생산 권고량을 제공합니다."},
  "production:inventory": {subtitle: "품목별 재고 수준과 판매 가능 수량을 확인합니다."},
  "production:waste": {subtitle: "기준일자 이전 30일간의 폐기 수량과 손실 금액을 분석합니다."},
  "ordering:recommendations": {subtitle: "AI가 분석한 최적 발주량을 확인합니다."},
  "ordering:history": {subtitle: "과거 발주 내역과 실적을 조회합니다."},
  "analytics:sales": {subtitle: "기간별 매출 흐름과 채널별 성과를 분석합니다."},
  "analytics:market": {subtitle: "상권 내 경쟁 현황과 고객 분포를 확인합니다."},
  "sales:product_revenue_share": {subtitle: "조회 기간 전체 매출을 상품 그룹 단위로 합산해 비중을 계산합니다."}
};

export const FIELD_CAPTIONS: Record<string, FieldCaption> = {
  // 홈 - 운영 현황 업데이트 시간
  "dashboard:summary_update": {
    assumption:
      "운영 현황 데이터는 매장 영업 시간 동안 정시(매시 0분)마다 자동 갱신됩니다.\n" +
      "• 갱신 주기: 오전 7시 ~ 오후 11시 정시 (07:00, 08:00, ..., 23:00)\n" +
      "• 야간(오후 11시 1분 ~ 다음 날 오전 6시 59분): 마지막 갱신 시각인 전날 23:00 데이터로 고정 노출",
    description:
      "표시된 시각은 가장 최근 정시 업데이트 시점입니다. 영업 시간 외에는 마지막 갱신 데이터로 표시됩니다.",
  },
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
    assumption: "기준 일자의 전날을 종료일로 하고, 그 이전 30일간을 폐기 손실 집계 기간으로 사용합니다.",
    description: "폐기 손실 화면이 집계하는 영업일 정의입니다.",
  },
  // 폐기 손실 - 조회 대상 데이터
  "production:waste_dataset": {
    assumption:
      "집계 기간(기준일자 전날까지 최근 30일) 동안 산출된 품목별 폐기 손실 데이터를 합산합니다.",
    description: "폐기 손실 산정 대상이 되는 재고 풀의 정의입니다.",
  },
  // 폐기 손실 - 폐기 대상
  "production:waste_target": {
    assumption: "FIFO 판매 차감 후 잔여분 중 유통기한이 경과한 수량만 폐기로 인식합니다.",
    formula: "폐기 수량 = 최근 30일 각 기준일의 Σ(잔량 - FIFO 판매 차감) | 유통기한 경과",
    description: "최근 30일 동안 FIFO 차감 후 유통기한 경과로 폐기된 수량의 합계입니다.",
  },
  // 폐기 손실 - 폐기한 갯수 (테이블 헤더)
  "production:waste_qty": {
    assumption:
      "산정 절차. (집계 종료일은 기준 일자 전날, 조회 범위는 그 이전 30일)\n" +
      "• 대상 데이터: 최근 30일 동안 일자별로 산출된 품목별 폐기 손실 데이터\n" +
      "• 차감 순서: FIFO(선입선출)로 판매 수량을 먼저 차감\n" +
      "• 폐기 인식: FIFO 차감 후 잔여분 중 유통기한이 경과한 Lot만 폐기 처리\n" +
      "• 집계 단위: 최근 30일 품목별 폐기 수량 합계",
    formula: "폐기 수량 = 최근 30일 각 일자의 Σ(잔량 - FIFO 판매 차감) | 유통기한 경과",
    description: "최근 30일 동안 FIFO 판매 차감 후 유통기한 경과로 폐기 처리된 수량을 품목별로 합산한 값입니다.",
  },
  // 폐기 손실 - 단가
  "production:waste_unit_price": {
    assumption: "원가 데이터가 없으므로 판매가 기준 단가를 사용합니다.",
    formula: "평균 판매가 = 판매금액 ÷ 판매수량",
    description: "폐기 수량 1개당 손실 금액(판매가 기준)입니다.",
  },
  // 폐기 손실 - 손실 금액
  "production:waste_loss_amount": {
    assumption:
      "원가 데이터 부재로 매출액 기준으로 손실 금액을 산정하며, 최근 30일 폐기 수량을 합산해 표시합니다(원가 확보 시 원가 기준으로 전환).",
    formula: "손실 금액 = 최근 30일 폐기 수량 × 판매가",
    description: "최근 30일 폐기 수량을 판매가로 환산한 손실 금액 추정치입니다.",
  },
  // 주문 관리 - AI 추천 발주량 (메인 타이틀)
  "ordering:ai_recommended_qty": {
    assumption:
      "데이터 조회 범위는 해당 지점의 최근 7일 주문 이력이 있는 품목입니다.\n" +
      "• 기준값은 지난주 같은 요일, 2주 전 같은 요일, 지난달 같은 요일의 발주량을 사용합니다.\n" +
      "• 각 품목별로 최근 판매 추세, 현재 재고 수준, 유통기한 정보를 반영해 기준 발주량을 보정합니다.",
    formula:
      "추천 발주량 = 기준 발주량 × 판매 추세 보정 × 재고 보정 × 유통기한 보정\n" +
      "•  판매 추세 보정: 최근 판매가 늘면 가중치를 높이고, 줄면 낮춥니다.\n" +
      "•  재고 보정: 현재 재고가 많으면 줄이고, 적으면 늘립니다.\n" +
      "•  유통기한 보정: 유통기한이 짧을수록 보수적으로 조정합니다.",
    description: "과거 같은 요일 발주 패턴에 최근 운영 상황을 반영해 산출한 권장 발주 수량입니다.",
  },
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
  // 발주 이력 - 이상징후 (목업)
  "ordering:anomalies": {
    assumption:
      "현재 본 이상징후 카드의 항목은 시연용 목업(샘플) 데이터입니다.\n" +
      "• 메시지/심각도(높음/중간/낮음)/추천 조치는 AI(Gemini) + RAG 운영 가이드 응답을 기반으로 생성될 예정\n" +
      "• 일부 항목(예: 미니스트로베리필드 70% 급감, 매장음악서비스 발주(0)/확정(1) 불일치 등)은 실제 데이터와 일치하지 않을 수 있음\n" +
      "• 실제 운영 시 산출 기준:\n" +
      "  - 발주 변동률 ≥ 50%: 심각도 '높음'\n" +
      "  - 자동/수동 비율 이상치: 심각도 '중간'\n" +
      "  - 발주(ord_qty)와 확정(confrm_qty) 차이가 큰 발주건: 심각도 '중간'\n" +
      "• 표시 상한: 최대 8건",
    description:
      "발주 이력에서 패턴 이탈을 자동 탐지하는 영역입니다. 현재 노출 중인 항목은 시연용 샘플로, 실데이터 연동 전까지 수치 일치가 보장되지 않습니다.",
  },
  // 발주 이력 - 주요 변동 품목
  "ordering:top_change_items": {
    assumption:
      "변동률 절대값을 기준으로 내림차순 정렬하며, 평균값은 발주 시점 이전이면 전일 기준 4주, 이후면 당일 포함 4주 데이터를 사용합니다.",
    formula: "변동률 = (당일 발주량 - 4주 평균) ÷ 4주 평균 × 100 · 정렬 = |변동률| DESC",
    description: "4주 평균 대비 변동률 절대값이 큰 순서로 노출되는 품목입니다.",
  },
  // 매출 현황 - 주간 비교 (요일 기준)
  "analytics:weekly_comparison": {
    assumption:
      "비교 기준은 '일자'가 아닌 '요일'입니다.\n" +
      "예) 기준일이 2026-03-12(목) 인 경우, 비교 대상은 7일 전인 2026-03-05(목)이며 동일 요일 1일치 매출과 비교합니다.\n" +
      "기간 조회 시에도 7일 전 동요일 구성 기간과 비교합니다.",
    formula:
      "일자 조회: 비교일 = 기준일 - 7일 (동일 요일)\n기간 조회: 비교 기간 = 각 일자 - 7일 (동요일 구성)",
    description:
      "전주 동일 요일 기준으로 매출을 비교합니다. 요일별 매출 패턴 차이를 제거하기 위해 같은 요일끼리만 매칭합니다.",
  },
  // 매출 현황 - 월간 비교 (요일 기준)
  "analytics:monthly_comparison": {
    assumption:
      "비교 기준은 '일자'가 아닌 '전월 동일 주차의 동일 요일'입니다.\n" +
      "예) 기준일이 2026-03-12(목, 3월 2주차) 인 경우, 비교 대상은 2026-02-12(목, 2월 2주차)이며 전월 동일 주차의 동일 요일 1일치 매출과 비교합니다.\n" +
      "기간 조회 시에도 전월 동일 주차의 동요일 구성 기간과 비교합니다.",
    formula:
      "일자 조회: 비교일 = 전월 동일 주차의 동일 요일\n기간 조회: 비교 기간 = 전월 동일 주차의 동요일 구성 기간",
    description:
      "전월 동일 주차·동일 요일 기준으로 매출을 비교합니다. 시즌성·요일성 변동을 동시에 보정합니다.",
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
  // 손익 분석 - 평균 객단가
  "sales:avg_ticket_index": {
    assumption:
      "• 주문 건수는 매장 일별 집계 데이터가 있으면 그 값을 우선 사용하고, 없으면 채널별 주문 건수를 합산한 값으로 대체합니다.\n" +
      "• 객단가 지수는 동일 매장의 최근 4주(28일) 동안의 일별 객단가 분포 안에서 오늘 객단가가 어느 위치에 있는지를 0~100으로 환산한 상대 지표입니다",
    formula:
      "• 평균 객단가 = 당일 총매출 ÷ 당일 총주문 건수\n" +
      "• 객단가 지수 = (당일 객단가 - 최근 4주 최소 객단가) ÷ (최근 4주 최대 객단가 - 최근 4주 최소 객단가) × 100",
    description:
      "• 당일 평균 객단가와, 그것이 최근 4주 기준에서 얼마나 높은 수준인지 0~100 점수로 함께 보여줍니다. 점수는 절대 금액 자체가 아니라 최근 4주 내 동일 매장의 상대적 위치를 의미합니다.",
  },
  // 생산 현황 테이블
  "production:forecast_1h": {
    assumption: "현재 시간대에서 1시간동안 4주 평균 동일 시간대 판매량의 평균만큼 판매된다고 가정합니다.",
    formula: "예측 재고 = 현재 재고 - (시간당 평균 판매량 × 1)",
    description: "1시간 후 예상 잔여 재고 수량입니다.",
  },
  "production:chance_loss": {
    assumption: "AI 권고 생산을 하지 않았을 때의 기회비용을 기준으로 합니다.",
    formula: "절감비용 = 품절 예상 수량 × 해당제품의 판매가",
    description: "적시 생산으로 방지할 수 있는 찬스 로스 절감 비용입니다.",
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
    assumption: "판매 가능 수량은 기준 시점에 실제로 남아 있는 재고 수량을 의미합니다.\n" +
      "재고 조정·ERP 처리 지연으로 인한 음수 재고는 0으로 처리합니다.",
    formula: "판매 가능 수량 = max(기준 시점 재고 수량, 0)",
    description: "기준 시점에 실제로 남아 있어 판매 가능한 재고 수량입니다.",
  },
  "inventory:sold_qty": {
    description: "해당 기준일의 기준 시간까지의 판매 수량 합계입니다.",
  },
  "inventory:status": {
    assumption: "재고율을 기준으로 세 단계(부족, 적정, 여유)로 구분합니다.",
    formula:
      "재고율 = 판매 가능 수량 ÷ 판매 개수\n" +
      "• 부족: 재고율 ≤ 0\n" +
      "• 적정: 0 < 재고율 ≤ 0.35\n" +
      "• 여유: 0.35 < 재고율",
    description: "품목의 현재 재고 수준 상태입니다.",
  },
  // 발주 이력 테이블
  "ordering:gap_rate": {
    assumption: "AI 추천량 대비 실제 확정량 차이를 절댓값 비율로 나타냅니다.",
    formula: "괴리율 = |확정량 - 발주량| ÷ 발주량 × 100",
    description: "AI 권고와 실제 발주 간의 편차를 나타냅니다.",
  },
  // FIFO 섹션 제목
  "fifo:section_title": {
    assumption:
      "본 테이블의 데이터는 임의 가정 기반의 시뮬레이션 데이터입니다.\n" +
      "• 유통기한: 완제품(production)은 제품명 키워드로 추정 — 샌드/샐러드/크림·도넛/베이글/빵 1일, 케이크/파이 2일, 커피/음료 당일(0일), 기타 1일\n" +
      "• 납품일(delivery): 납품 데이터가 없으므로 생산 이력에서 대리 산출\n" +
      "• 조회 기준: 선택한 기준일(KST)의 lot_date 1일치 데이터만 표시",
    description:
      "각 품목의 기준일 Lot 단위 입고·소진·폐기·잔여 수량을 FIFO 순서로 추적합니다. 실제 ERP·POS 연동 전까지 추정 데이터로 운영됩니다.",
  },
  // FIFO 입고 수량
  "fifo:initial_qty": {
    assumption: "해당 일자에 생산·납품된 Lot의 최초 수량입니다.",
    formula: "입고 수량 = SUM(initial_qty) — 오늘 lot_date 기준",
    description: "오늘 입고된 Lot의 초기 수량 합계입니다.",
  },
  // FIFO 소진 수량
  "fifo:consumed_qty": {
    assumption: "FIFO 순서로 판매·출고된 수량입니다. sold_out 상태 Lot 포함.",
    formula: "소진 수량 = SUM(consumed_qty) — 오늘 lot_date 기준",
    description: "오늘 Lot에서 FIFO 차감으로 소진된 수량 합계입니다.",
  },
  "fifo:active_remaining": {
    assumption: "현재 active 상태인 Lot만 포함합니다. sold_out·expired Lot은 제외합니다.",
    formula: "잔여 수량 = Σ(초기 수량 - 소진 수량) — active Lot 기준",
    description: "유통기한이 남아있는 활성 Lot의 잔여 수량 합계입니다.",
  },
  "fifo:wasted_qty": {
    assumption: "유통기한 만료로 expired 처리된 Lot의 수량만 집계합니다.",
    formula: "폐기 수량 = Σ wasted_qty (expired Lot)",
    description: "기준일 Lot 중 유통기한 만료로 폐기된 총 수량입니다.",
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
  "sales:hourly_channel_sales": {
    assumption: "조회 기간 내 시간대(0~23시)별 매출을 채널 구분으로 집계합니다. 오프라인+투고는 매장·포장 주문, 배달은 배달 주문입니다.",
    formula: "오프라인+투고 = 시간대별 오프라인 채널 매출 합계 · 배달 = 시간대별 온라인 채널 매출 합계 · 판매건수 = 오프라인+투고 건수 + 배달 건수",
    description: "시간대별 채널 매출(누적 막대)과 전체 판매건수(꺾은선)를 함께 표시합니다.",
  },
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
    assumption: "조회 기간 내 판매 금액 기준 상위 10개 상품을 집계합니다.",
    description: "판매 금액 순으로 상위 10개 상품의 매출을 비교합니다.",
  },
  "sales:margin_rate": {
    assumption: "최근 4주간 매출이 발생한 제품의 제품별 마진율 평균을 사용합니다.",
    formula: "마진율 점수 = Avg((판매가 - 원가) ÷ 판매가) × 100",
    description: "판매가 대비 이익 비중을 0~100 점수로 환산합니다.",
  },
  "sales:net_ratio": {
    assumption: "당일 총매출에서 할인·수수료 등 차감 후 남은 순매출 비율을 의미합니다.",
    formula: "순매출 비율 = 순매출 ÷ 총매출 × 100",
    description: "매출 중 실제 매장에 남는 금액의 비중을 점수화합니다.",
  },
  "sales:profitability": {
    assumption: "추정 이익은 오늘 매출에 평균 마진율을 곱해 산출합니다.",
    formula: "수익성 점수 = 추정 이익 ÷ 총매출 × 100",
    description: "매출 대비 추정 이익이 차지하는 비율을 점수로 보여줍니다.",
  },
  "sales:menu_diversity": {
    assumption: "조회 기간 내 매출이 발생한 상위 상품 수를 기준으로 점수를 부여합니다.",
    formula: "메뉴 다양성 점수 = min(100, 상위 상품 수 × 17)",
    description: "매장이 다양한 메뉴를 균형 있게 운영하고 있는지를 점수화합니다.",
  },
  "sales:core_indicators": {
    assumption:
      "핵심 지표는 마진율, 순매출 비율, 수익성, 메뉴 다양성, 객단가를 0~100 범위로 비교할 수 있도록 정리한 값입니다.\n",
    description:
      "매장의 수익 구조와 판매 구성을 5개 핵심 지표로 요약해 비교하는 영역입니다.\n" +
      "• 마진율: 판매 한 건당 남는 이익 비중을 보여 주는 단위 수익성 지표입니다. 가격·원가 구조가 건강한지 확인하는 출발점이 됩니다.\n" +
      "• 순매출 비율: 할인·수수료 차감 후 실제 매장에 남는 매출 비중으로, 외부 비용이 수익을 얼마나 잠식하는지를 보여 줍니다.\n" +
      "• 수익성: 추정 이익이 매출 전체에서 차지하는 비중으로, 마진율과 비용 구조가 결합된 종합 수익 체력을 나타냅니다.\n" +
      "• 메뉴 다양성: 매출이 한두 개 메뉴에 쏠려 있는지를 측정해 매출 안정성과 위험 분산 정도를 평가합니다.\n" +
      "• 평균 객단가: 고객 한 명이 평균 얼마를 지출하는지를 보여 줘, 트래픽 외에 객 단위 매출을 끌어올릴 여지가 있는지 판단하는 데 사용됩니다.\n" +
      "이 5개 축을 함께 보면 '많이 파는가 / 비싸게 파는가 / 효율적으로 파는가 / 안정적으로 파는가'를 한 화면에서 진단할 수 있습니다.",
  },
"sales:product_revenue_share": {
    assumption: "조회 기간 전체 매출을 상품 그룹 단위로 합산해 비중을 계산합니다.",
    formula: "상품 그룹별 매출 비중 = 각 상품 그룹 매출 ÷ 전체 상품 그룹 매출 × 100",
    description: "전체 매출 대비 각 상품 그룹의 매출 비중을 면적으로 보여줍니다."
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
  "page:settings_agents": {
    assumptionLabel: "역할 및 설명",
    descriptionLabel: "근거",
    assumption:
      "운영 중 Agent의 모델/버전/상태를 관리하고 배포 현황을 추적합니다.",
    description:
      "서비스 품질 저하를 조기에 감지하고 안정적인 운영 릴리즈를 유지하기 위해 필요합니다.",
  },
  "page:settings_orchestration": {
    assumptionLabel: "역할 및 설명",
    descriptionLabel: "근거",
    assumption:
      "라우팅, 핸드오프, fallback 규칙을 관리해 질의 처리 흐름을 제어합니다.",
    description:
      "응답 일관성과 실패 복원력을 높여 운영 리스크를 줄이기 위해 필요합니다.",
  },
  "page:settings_connectors": {
    assumptionLabel: "역할 및 설명",
    descriptionLabel: "근거",
    assumption:
      "데이터 원천 커넥터 상태와 동기화 품질, 지연 이슈를 모니터링합니다.",
    description:
      "AI/분석 결과의 신뢰도를 좌우하는 데이터 파이프라인을 안정적으로 유지하기 위해 필요합니다.",
  },
  "page:settings_access": {
    assumptionLabel: "역할 및 설명",
    descriptionLabel: "근거",
    assumption:
      "역할별 권한과 데이터 범위를 통제해 접근 정책을 운영합니다.",
    description:
      "보안/컴플라이언스를 준수하고 사용자 권한 오남용을 방지하기 위해 필요합니다.",
  },
  "page:settings_prompts": {
    assumptionLabel: "역할 및 설명",
    descriptionLabel: "근거",
    assumption:
      "도메인별 시스템 프롬프트와 빠른 질문, 템플릿을 관리합니다.",
    description:
      "응답 품질과 톤을 표준화하고, 운영자가 모델 동작을 통제 가능하게 만들기 위해 필요합니다.",
  },
  "page:settings_golden_queries": {
    assumptionLabel: "역할 및 설명",
    descriptionLabel: "근거",
    assumption:
      "반복 핵심 질의를 골든 쿼리로 관리해 응답 속도와 정확도를 높입니다.",
    description:
      "자주 묻는 운영 질문에 대한 일관된 답변을 빠르게 제공하기 위해 필요합니다.",
  },
  "page:settings_audit_logs": {
    assumptionLabel: "역할 및 설명",
    descriptionLabel: "근거",
    assumption:
      "질의 처리 기록, 차단 이력, 경로 정보를 추적해 감사 가능성을 확보합니다.",
    description:
      "정책 위반 탐지, 장애 분석, 책임 추적을 위한 운영 근거를 남기기 위해 필요합니다.",
  },
  "page:settings_quality_archive": {
    assumptionLabel: "역할 및 설명",
    descriptionLabel: "근거",
    assumption:
      "Agent별 품질 지표와 이슈 상태를 통합 관리합니다.",
    description:
      "품질 저하를 수치 기반으로 관리하고 개선 작업 우선순위를 결정하기 위해 필요합니다.",
  },
  "page:settings_notices": {
    assumptionLabel: "역할 및 설명",
    descriptionLabel: "근거",
    assumption:
      "운영 공지와 점검 일정을 사용자에게 전달하고 이행 상태를 관리합니다.",
    description:
      "변경사항 공유 누락을 줄이고 현장 운영 혼선을 예방하기 위해 필요합니다.",
  },
};
