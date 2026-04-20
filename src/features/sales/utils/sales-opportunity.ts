import type {
  SalesInsightsResponse,
  SalesPrompt,
  SalesSummaryResponse,
} from "@/features/sales/types/sales";
import type { SalesCampaignEffectResponse } from "@/features/sales/types/sales";
import type {
  SalesBenchmarkData,
  SalesOpportunityMock,
} from "@/features/sales/types/sales-opportunity";

function extractPercent(value: string | undefined) {
  if (!value) return 0;
  const parsed = Number.parseFloat(value.replace(/[^0-9.-]/g, ""));
  if (!Number.isFinite(parsed)) return 0;
  return parsed;
}

function extractAmount(detail: string | null | undefined) {
  if (!detail) return 0;
  const matched = detail.match(/([0-9,]+)원/);
  if (!matched) return 0;
  return Number.parseInt(matched[1].replace(/,/g, ""), 10);
}

function extractOrderCount(detail: string | null | undefined) {
  if (!detail) return 0;
  const matched = detail.match(/주문\s*([0-9,]+)건/);
  if (!matched) return 0;
  return Number.parseInt(matched[1].replace(/,/g, ""), 10);
}

function getPaymentFeeRate(label: string) {
  if (label.includes("통신") || label.includes("할인")) return 3.4;
  if (label.includes("네이버") || label.includes("간편")) return 1.8;
  if (label.includes("현금")) return 0.0;
  return 2.2;
}

export function buildSalesOpportunityFromLiveData(params: {
  storeName: string;
  summary?: SalesSummaryResponse;
  insights?: SalesInsightsResponse;
  campaignEffect?: SalesCampaignEffectResponse;
  benchmark?: SalesBenchmarkData | null;
  fallbackPrompts?: SalesPrompt[];
}): SalesOpportunityMock {
  const { storeName, summary, insights, campaignEffect, benchmark, fallbackPrompts } = params;
  const safeSummary = summary ?? {
    data_date: null,
    today_revenue: 0,
    today_net_revenue: 0,
    weekly_data: [],
    top_products: [],
    avg_margin_rate: 0,
    avg_net_profit_per_item: 0,
    estimated_today_profit: 0,
  };

  const weekly = safeSummary.weekly_data;
  const recentWeekly = weekly.slice(Math.max(weekly.length - 7, 0));
  const priorWeekly = weekly.slice(Math.max(weekly.length - 14, 0), Math.max(weekly.length - 7, 0));
  const currentRevenue = recentWeekly.reduce((acc, item) => acc + item.revenue, 0);
  const baselineRevenue =
    priorWeekly.length > 0
      ? priorWeekly.reduce((acc, item) => acc + item.revenue, 0)
      : Math.max(0, Math.round(currentRevenue * 0.9));
  const upliftRevenue = Math.max(0, currentRevenue - baselineRevenue);
  const discountRatio = extractPercent(
    insights?.payment_mix.metrics.find((item) => item.label.includes("할인"))?.value,
  );
  const promoCost = Math.round(currentRevenue * (discountRatio / 100) * 0.35);
  const roiRate = promoCost > 0 ? Math.round(((upliftRevenue - promoCost) / promoCost) * 100) : 0;
  const campaignBefore = campaignEffect?.periods.find((period) => period.label === "캠페인 전");
  const campaignDuring = campaignEffect?.periods.find((period) => period.label === "캠페인 중");
  const campaignAfter = campaignEffect?.periods.find((period) => period.label === "캠페인 후");
  const campaignBaselineRevenue = Math.round(campaignBefore?.revenue ?? baselineRevenue);
  const campaignDuringRevenue = Math.round(campaignDuring?.revenue ?? currentRevenue);
  const campaignAfterRevenue = Math.round(campaignAfter?.revenue ?? currentRevenue);
  const campaignUpliftRevenue = campaignDuringRevenue - campaignBaselineRevenue;
  const campaignPromoCost = Math.round(campaignEffect?.discount_cost ?? promoCost);
  const campaignRoiRate = Number.isFinite(campaignEffect?.roi_pct)
    ? Math.round(campaignEffect?.roi_pct ?? roiRate)
    : roiRate;

  const channelMetrics = insights?.channel_mix.metrics ?? [];
  const onlineMetric = channelMetrics.find((item) => item.label.includes("온라인"));
  const offlineMetric = channelMetrics.find((item) => item.label.includes("오프라인"));
  const onlineSharePct = onlineMetric
    ? extractPercent(onlineMetric.value)
    : Math.round((safeSummary.today_net_revenue / Math.max(safeSummary.today_revenue, 1)) * 100);
  const offlineSharePct = offlineMetric
    ? extractPercent(offlineMetric.value)
    : Math.max(0, 100 - onlineSharePct);

  const paymentMetrics = (insights?.payment_mix.metrics ?? [])
    .filter((item) => !item.label.includes("할인 결제 비중") && item.value.includes("%"))
    .slice(0, 4);
  const paymentMix = paymentMetrics.map((metric) => {
    const sharePct = extractPercent(metric.value);
    const feeRatePct = getPaymentFeeRate(metric.label);
    const amount = extractAmount(metric.detail);
    const netContribution =
      amount > 0
        ? Math.round(amount * (1 - feeRatePct / 100))
        : Math.round(sharePct * (100 - feeRatePct) * 1_000);
    return {
      label: metric.label,
      sharePct,
      feeRatePct,
      netContribution,
    };
  });

  const beforeAov =
    priorWeekly.length > 0
      ? Math.round(
          priorWeekly.reduce((acc, item) => acc + item.net_revenue, 0) /
            Math.max(priorWeekly.length, 1),
        )
      : Math.round(safeSummary.avg_net_profit_per_item * 20);
  const afterAov =
    recentWeekly.length > 0
      ? Math.round(
          recentWeekly.reduce((acc, item) => acc + item.net_revenue, 0) /
            Math.max(recentWeekly.length, 1),
        )
      : Math.round(safeSummary.avg_net_profit_per_item * 22);
  const channelOrders = channelMetrics.reduce(
    (acc, metric) => acc + extractOrderCount(metric.detail),
    0,
  );
  const beforeVisitors =
    priorWeekly.length > 0
      ? Math.max(1, Math.round(channelOrders * 0.9))
      : Math.max(1, channelOrders);
  const afterVisitors = Math.max(beforeVisitors, channelOrders);
  const marginImpactPct =
    beforeAov > 0 ? Math.round(((afterAov - beforeAov) / beforeAov) * 100) : 0;

  const benchmarkData = benchmark ?? {
    clusterName: "유사 상권",
    clusterSize: 1,
    bestStoreName: "비교 매장 없음",
    bestStoreRevenue: safeSummary.today_revenue,
    currentStoreRevenue: safeSummary.today_revenue,
    peerAvgRevenue: safeSummary.today_revenue,
    currentPeakRevenue: Math.max(
      ...safeSummary.weekly_data.map((item) => item.revenue),
      safeSummary.today_revenue,
    ),
    peerPeakRevenue: Math.max(
      ...safeSummary.weekly_data.map((item) => item.revenue),
      safeSummary.today_revenue,
    ),
    currentDonutMixPct: 50,
    peerDonutMixPct: 50,
    currentBeverageMixPct: 50,
    peerBeverageMixPct: 50,
  };

  const dominantChannel = onlineSharePct >= offlineSharePct ? "온라인" : "오프라인";
  const opportunityPrompts: SalesPrompt[] = [
    {
      label: `${dominantChannel} 채널 실행안`,
      category: "channel",
      prompt: `${storeName} ${dominantChannel} 채널 비중을 반영해서 다음 주 매출 개선 액션을 제안해줘.`,
    },
    {
      label: `${benchmarkData.clusterName} 벤치마크`,
      category: "benchmark",
      prompt: `${storeName}를 ${benchmarkData.clusterName}과 비교해 피크 시간대 운영과 상품믹스 개선안을 알려줘.`,
    },
  ];
  if (campaignEffect?.campaign_name) {
    opportunityPrompts.unshift({
      label: `${campaignEffect.campaign_name} 효과`,
      category: "roi",
      prompt: `${storeName}의 ${campaignEffect.campaign_name} 캠페인 전/중/후 업리프트와 ROI를 해석해줘.`,
    });
  }

  const promptSuggestions = [...(fallbackPrompts ?? []), ...opportunityPrompts];
  const uniquePromptSuggestions = Array.from(
    new Map(promptSuggestions.map((item) => [item.prompt, item])).values(),
  );

  return {
    marketingRoi: {
      campaignName:
        campaignEffect?.campaign_name ??
        insights?.campaign_seasonality?.metrics.find((item) => item.label.includes("대표 캠페인"))
          ?.value ??
        `${storeName} 실적 기반 캠페인`,
      campaignCode: campaignEffect?.campaign_code,
      benefitType: campaignEffect?.benefit_type,
      periodLabelBefore:
        campaignBefore?.start_date && campaignBefore?.end_date
          ? `${campaignBefore.start_date} ~ ${campaignBefore.end_date}`
          : undefined,
      periodLabelDuring:
        campaignDuring?.start_date && campaignDuring?.end_date
          ? `${campaignDuring.start_date} ~ ${campaignDuring.end_date}`
          : undefined,
      periodLabelAfter:
        campaignAfter?.start_date && campaignAfter?.end_date
          ? `${campaignAfter.start_date} ~ ${campaignAfter.end_date}`
          : undefined,
      baselineRevenue: campaignBaselineRevenue,
      campaignRevenue: campaignDuringRevenue,
      postCampaignRevenue: campaignAfterRevenue,
      promoCost: campaignPromoCost,
      upliftRevenue: campaignUpliftRevenue,
      roiRate: campaignRoiRate,
      paybackDays: campaignEffect?.payback_days,
      nextAction:
        campaignRoiRate >= 0
          ? "캠페인 대상 상품군과 채널 믹스를 유지하면서 고효율 시간대를 확장하세요."
          : "할인강도를 낮추고 번들구성으로 객단가를 방어하는 방향이 필요합니다.",
    },
    channelOptimization: {
      onlineSharePct: Math.round(onlineSharePct),
      offlineSharePct: Math.round(offlineSharePct),
      paymentMix:
        paymentMix.length > 0
          ? paymentMix
          : [
              { label: "카드", sharePct: 60, feeRatePct: 2.2, netContribution: 58_000 },
              { label: "현금", sharePct: 20, feeRatePct: 0.0, netContribution: 20_000 },
            ],
      recommendation:
        onlineSharePct >= 50
          ? "온라인 채널 비중이 높아 수수료 민감도가 큽니다. 고수수료 결제수단의 프로모션 의존도를 낮추세요."
          : "오프라인 강세입니다. 피크 시간대 결제 대기 분산과 즉시픽업 전환을 함께 운영하세요.",
    },
    promotionEfficiency: {
      partnerName:
        insights?.payment_mix.metrics.find((item) => item.label.includes("대표 제휴 할인"))
          ?.value ?? "통신사 제휴 할인",
      discountCost: promoCost,
      beforeAov,
      afterAov,
      beforeVisitors,
      afterVisitors,
      marginImpactPct,
      recommendation:
        marginImpactPct >= 0
          ? "제휴 할인이 유입과 객단가를 동시에 개선했습니다. 동일 조건 유지 후 고마진 상품 비중을 높이세요."
          : "유입 대비 객단가 개선이 약합니다. 제휴 조건 재설계와 최소 주문금액 상향이 필요합니다.",
    },
    benchmark: {
      clusterName: benchmarkData.clusterName,
      clusterSize: benchmarkData.clusterSize,
      clusterReason: benchmarkData.clusterReason,
      peakSalesStore: benchmarkData.currentPeakRevenue,
      peakSalesCluster: benchmarkData.peerPeakRevenue,
      donutMixStorePct: benchmarkData.currentDonutMixPct,
      donutMixClusterPct: benchmarkData.peerDonutMixPct,
      beverageMixStorePct: benchmarkData.currentBeverageMixPct,
      beverageMixClusterPct: benchmarkData.peerBeverageMixPct,
      bestStoreName: benchmarkData.bestStoreName,
      recommendation:
        benchmarkData.currentStoreRevenue >= benchmarkData.peerAvgRevenue
          ? "현재 매출은 유사군 대비 우위입니다. 피크타임 재고/진열 운영을 표준화해 재현성을 높이세요."
          : "유사군 평균 대비 매출 격차가 있습니다. 우수 매장 피크 운영패턴과 상품구성 전략을 벤치마킹하세요.",
    },
    promptSuggestions: uniquePromptSuggestions.slice(0, 10),
  };
}
