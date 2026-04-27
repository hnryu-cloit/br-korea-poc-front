import type { OrderingOption } from "@/features/ordering/types/ordering";

const ORDERING_REASONING_VARIANTS = {
  lastWeek: [
    "지난주 같은 요일 흐름이 안정적으로 이어질 때 참고하기 좋은 기준입니다.",
    "최근 운영 패턴이 크게 바뀌지 않았다면 지난주 기준으로 맞추기 적합합니다.",
    "직전 주 판매 감각을 그대로 반영해 무리 없이 발주하려는 상황에 어울립니다.",
    "행사나 날씨 변동이 크지 않은 주간에는 지난주 수요를 따르는 판단이 안전합니다.",
    "평소와 비슷한 고객 흐름이 예상될 때 가장 설명하기 쉬운 기준안입니다.",
    "현장 감각과 데이터 기준을 함께 맞추고 싶을 때 지난주 패턴이 활용도가 높습니다.",
    "최근 판매 리듬이 유지되는 매장이라면 우선 검토하기 좋은 기본 추천안입니다.",
    "급격한 증감 요인이 없을 때 직전 동일 요일 실적을 따라가는 선택에 적합합니다.",
    "보수적이되 현실적인 발주가 필요할 때 지난주 기준안이 운영 부담을 줄여줍니다.",
    "점포 운영이 평시 흐름에 가까운 날에는 지난주 동일 요일 기준이 잘 맞습니다.",
  ],
  twoWeeksAgo: [
    "직전 주 변동이 일시적이었다고 판단될 때 비교 기준으로 쓰기 좋습니다.",
    "지난주 실적에 흔들림이 있었다면 2주 전 패턴으로 균형을 잡는 데 적합합니다.",
    "단기 이벤트 영향을 한 번 덜어낸 기준으로 보고 싶을 때 활용하기 좋습니다.",
    "최근 수요가 출렁였을 때 평균적인 발주 감각을 찾는 용도로 적합합니다.",
    "지난주보다 안정적인 비교 시점을 찾고 있다면 2주 전 기준안이 유효합니다.",
    "한 주 전 노이즈를 피하고 조금 더 차분한 기준으로 판단할 때 어울립니다.",
    "특정 프로모션이나 돌발 요인을 제외하고 싶을 때 검토하기 좋은 선택지입니다.",
    "최근 변동성을 완화한 기준으로 발주하려면 2주 전 동일 요일 패턴이 적합합니다.",
    "직전 주 과다·과소 발주 가능성을 점검하면서 보정할 때 유용한 안입니다.",
    "평균 회귀 관점에서 무난한 발주 수준을 잡고 싶을 때 잘 맞는 기준입니다.",
  ],
  lastMonth: [
    "월간 반복 패턴과 시즌 흐름을 함께 보려면 지난달 동일 요일 기준이 적합합니다.",
    "주간 등락보다 더 넓은 흐름을 반영해 발주하고 싶을 때 참고하기 좋습니다.",
    "최근 몇 주보다 월 단위 리듬을 중시하는 상황에서 활용도가 높은 안입니다.",
    "시즌성이나 월초·월말 패턴을 고려해 판단하려면 지난달 기준이 잘 맞습니다.",
    "단기 수치보다 조금 더 긴 호흡의 수요 흐름을 반영하고 싶을 때 적합합니다.",
    "월간 판매 사이클을 의식해 발주 기준을 잡는 날에 검토하기 좋은 선택입니다.",
    "최근 주간 변동보다 정기적인 월 패턴을 우선 보고 싶을 때 어울립니다.",
    "캠페인 주기나 급여일 영향처럼 월 단위 반복성이 있을 때 참고하기 좋습니다.",
    "주 단위 편차를 줄이고 장기 패턴으로 발주량을 판단하려는 경우 적합합니다.",
    "월간 기준으로 수요를 다시 맞춰보고 싶을 때 안정적인 비교안으로 사용할 수 있습니다.",
  ],
} as const;

type OrderingReasoningGroup = keyof typeof ORDERING_REASONING_VARIANTS;

function normalizeLabel(value: string) {
  return value.trim().toLowerCase().replaceAll(/\s+/g, " ");
}

function resolveReasoningGroup(option: OrderingOption): OrderingReasoningGroup | null {
  const optionId = normalizeLabel(option.option_id);
  const title = normalizeLabel(option.title);
  const basis = normalizeLabel(option.basis);
  const source = `${title} ${basis}`;

  if (optionId === "opt-a" || optionId === "last_week" || source.includes("지난주")) {
    return "lastWeek";
  }
  if (
    optionId === "opt-b" ||
    optionId === "two_weeks_ago" ||
    source.includes("2주 전") ||
    source.includes("2주전")
  ) {
    return "twoWeeksAgo";
  }
  if (optionId === "opt-c" || optionId === "last_month" || source.includes("지난달")) {
    return "lastMonth";
  }
  return null;
}

export function getRandomOrderingReasoningText(option: OrderingOption) {
  const group = resolveReasoningGroup(option);
  if (!group) {
    return option.reasoning_text;
  }

  const phrases = ORDERING_REASONING_VARIANTS[group];
  return phrases[Math.floor(Math.random() * phrases.length)];
}
