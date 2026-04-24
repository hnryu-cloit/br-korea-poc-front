import type {
  CustomerProfileResponse,
  CustomerSegmentItem,
  DowPoint,
  HourPoint,
  StoreProfileResponse,
} from "@/features/analytics/types/analytics";

export function formatWonCompact(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return "0원";
  if (amount >= 100_000_000) return `${(amount / 100_000_000).toFixed(1)}억원`;
  if (amount >= 10_000) return `${Math.round(amount / 10_000).toLocaleString("ko-KR")}만원`;
  return `${Math.round(amount).toLocaleString("ko-KR")}원`;
}

export function getTopSegment(segments: CustomerSegmentItem[]): {
  segmentName: string;
  ratioPct: number;
} | null {
  if (segments.length === 0) return null;
  const total = segments.reduce((sum, segment) => sum + segment.count, 0);
  if (total <= 0) return null;
  const top = [...segments].sort((a, b) => b.count - a.count)[0];
  return {
    segmentName: top.segment_nm,
    ratioPct: Math.round((top.count / total) * 100),
  };
}

export function buildMarketActionItems(params: {
  storeProfile?: StoreProfileResponse;
  customerProfile?: CustomerProfileResponse;
}): string[] {
  const { storeProfile, customerProfile } = params;
  const items: string[] = [];

  const topSegment = getTopSegment(customerProfile?.customer_segments ?? []);
  if (topSegment) {
    items.push(
      `상위 고객군 '${topSegment.segmentName}' 비중이 ${topSegment.ratioPct}%로 높아 해당 타겟 전용 메시지/쿠폰 문구를 우선 적용하세요.`,
    );
  }

  if ((customerProfile?.telecom_discounts.length ?? 0) > 0) {
    const topDiscount = customerProfile?.telecom_discounts[0];
    if (topDiscount) {
      items.push(
        `제휴 할인 '${topDiscount.name}' 노출을 입구 POP와 주문 동선에 배치해 즉시 전환율을 높이세요.`,
      );
    }
  }

  if (storeProfile && storeProfile.peer_count > 0) {
    items.push(
      `${storeProfile.sido} ${storeProfile.region} 내 유사매장 ${storeProfile.peer_count}개 기준, 주 1회 경쟁매장 가격/행사 점검 루틴을 운영하세요.`,
    );
  }

  if (items.length === 0) {
    items.push(
      "데이터 수집량이 적어 인사이트가 제한됩니다. 최근 2주 기준 데이터 적재 상태를 먼저 점검하세요.",
    );
  }
  return items.slice(0, 3);
}

export function getCompetitionLevel(peerCount: number): {
  label: string;
  score: number;
  description: string;
} {
  if (peerCount >= 60) {
    return {
      label: "매우 높음",
      score: 90,
      description: "동일 상권 내 경쟁이 매우 높은 구간입니다.",
    };
  }
  if (peerCount >= 35) {
    return {
      label: "높음",
      score: 72,
      description: "가격·프로모션 반응 속도가 중요한 구간입니다.",
    };
  }
  if (peerCount >= 15) {
    return {
      label: "보통",
      score: 52,
      description: "고정 고객 유지와 피크 타임 운영 최적화가 중요합니다.",
    };
  }
  return {
    label: "낮음",
    score: 33,
    description: "수요 창출형 프로모션으로 점유율 확대 여지가 있습니다.",
  };
}

export function getTopHourLabels(points: HourPoint[], limit = 3): string[] {
  return [...points]
    .sort((a, b) => b.current_period_avg - a.current_period_avg)
    .slice(0, limit)
    .map((point) => `${point.hour}시`);
}

export function getTopDowLabels(points: DowPoint[], limit = 2): string[] {
  return [...points]
    .sort((a, b) => b.current_period_avg - a.current_period_avg)
    .slice(0, limit)
    .map((point) => point.label);
}
