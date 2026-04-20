import { SalesV2OpportunityTabs } from "@/features/sales/components/SalesV2OpportunityTabs";
import type {
  SalesOpportunityMock,
  SalesOpportunityTabKey,
} from "@/features/sales/types/sales-opportunity";

const formatWon = (value: number) => `${value.toLocaleString()}원`;

const MarketingRoiCard = ({ data }: { data: SalesOpportunityMock }) => {
  const maxCampaignRevenue = Math.max(
    data.marketingRoi.baselineRevenue,
    data.marketingRoi.campaignRevenue,
    1,
  );
  const campaignBars = [
    {
      label: "캠페인 전",
      value: data.marketingRoi.baselineRevenue,
      tone: "bg-[#bfd5ff]",
    },
    {
      label: "캠페인 중",
      value: data.marketingRoi.campaignRevenue,
      tone: "bg-[#2454C8]",
    },
    {
      label: "캠페인 후",
      value: data.marketingRoi.postCampaignRevenue ?? 0,
      tone: "bg-[#7ea7ff]",
    },
  ];

  return (
    <article className="rounded-[28px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-800">마케팅 성과 및 ROI 분석</p>
          <p className="mt-1 text-xs text-slate-400">{data.marketingRoi.campaignName}</p>
        </div>
        <span className="rounded-full bg-[#eef4ff] px-2.5 py-1 text-[10px] font-bold text-[#2454C8]">
          실행안
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-[#f8fbff] px-3 py-3">
          <p className="text-[11px] text-slate-400">순 업리프트</p>
          <p className="mt-1 text-sm font-bold text-slate-800">
            {formatWon(data.marketingRoi.upliftRevenue)}
          </p>
        </div>
        <div className="rounded-2xl bg-[#f8fbff] px-3 py-3">
          <p className="text-[11px] text-slate-400">ROI</p>
          <p
            className={`mt-1 text-sm font-bold ${
              data.marketingRoi.roiRate >= 0 ? "text-[#2454C8]" : "text-red-500"
            }`}
          >
            {data.marketingRoi.roiRate >= 0 ? "+" : ""}
            {data.marketingRoi.roiRate}%
          </p>
        </div>
        <div className="rounded-2xl bg-[#f8fbff] px-3 py-3">
          <p className="text-[11px] text-slate-400">회수기간</p>
          <p className="mt-1 text-sm font-bold text-slate-800">
            {data.marketingRoi.paybackDays ? `${data.marketingRoi.paybackDays}일` : "산출 불가"}
          </p>
        </div>
        <div className="rounded-2xl bg-[#f8fbff] px-3 py-3">
          <p className="text-[11px] text-slate-400">캠페인 혜택 유형</p>
          <p className="mt-1 text-sm font-bold text-slate-800">
            {data.marketingRoi.benefitType ?? "-"}
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {campaignBars.map((bar) => {
          const height = Math.max(14, Math.round((bar.value / maxCampaignRevenue) * 88));
          return (
            <div key={bar.label} className="rounded-2xl bg-[#f8fbff] px-3 py-3">
              <p className="text-[11px] text-slate-400">{bar.label}</p>
              <div className="mt-2 flex h-[92px] items-end">
                <div className={`w-full rounded ${bar.tone}`} style={{ height: `${height}px` }} />
              </div>
              <p className="mt-2 text-xs font-semibold text-slate-700">{formatWon(bar.value)}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-4 rounded-xl bg-[#EDF3FF] px-3 py-2 text-xs font-medium text-[#2454C8]">
        {data.marketingRoi.nextAction}
      </p>
    </article>
  );
};

const ChannelPaymentCard = ({ data }: { data: SalesOpportunityMock }) => {
  const maxPaymentContribution = Math.max(
    ...data.channelOptimization.paymentMix.map((item) => item.netContribution),
    1,
  );

  return (
    <article className="rounded-[28px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-800">채널 및 결제 수단 최적화</p>
          <p className="mt-1 text-xs text-slate-400">채널/결제 수단별 수익성 진단</p>
        </div>
        <span className="rounded-full bg-[#eef4ff] px-2.5 py-1 text-[10px] font-bold text-[#2454C8]">
          점포별
        </span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-[#f8fbff] px-3 py-3">
          <p className="text-[11px] text-slate-400">온라인/오프라인 비중</p>
          <div
            className="mx-auto mt-3 h-24 w-24 rounded-full"
            style={{
              background: `conic-gradient(#2454C8 0 ${data.channelOptimization.onlineSharePct}%, #bfd5ff ${data.channelOptimization.onlineSharePct}% 100%)`,
            }}
          />
          <div className="mt-3 text-xs text-slate-600">
            <p>온라인 {data.channelOptimization.onlineSharePct}%</p>
            <p>오프라인 {data.channelOptimization.offlineSharePct}%</p>
          </div>
        </div>
        <div className="space-y-2 rounded-2xl bg-[#f8fbff] px-3 py-3">
          <p className="text-[11px] text-slate-400">결제수단 순기여도</p>
          {data.channelOptimization.paymentMix.map((item) => {
            const width = Math.max(
              10,
              Math.round((item.netContribution / maxPaymentContribution) * 100),
            );
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>{item.label}</span>
                  <span>수수료 {item.feeRatePct}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-[#2454C8]" style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-4 rounded-xl bg-[#EDF3FF] px-3 py-2 text-xs font-medium text-[#2454C8]">
        {data.channelOptimization.recommendation}
      </p>
    </article>
  );
};

const PromotionEfficiencyCard = ({ data }: { data: SalesOpportunityMock }) => {
  return (
    <article className="rounded-[28px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-800">프로모션/제휴 할인 효율 분석</p>
          <p className="mt-1 text-xs text-slate-400">{data.promotionEfficiency.partnerName}</p>
        </div>
        <span className="rounded-full bg-[#eef4ff] px-2.5 py-1 text-[10px] font-bold text-[#2454C8]">
          실험안
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-[#f8fbff] px-3 py-3">
          <p className="text-[11px] text-slate-400">객단가 변화</p>
          <p className="mt-1 text-sm font-bold text-slate-800">
            {formatWon(data.promotionEfficiency.beforeAov)} →{" "}
            {formatWon(data.promotionEfficiency.afterAov)}
          </p>
        </div>
        <div className="rounded-2xl bg-[#f8fbff] px-3 py-3">
          <p className="text-[11px] text-slate-400">할인 비용</p>
          <p className="mt-1 text-sm font-bold text-slate-800">
            {formatWon(data.promotionEfficiency.discountCost)}
          </p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-[#f8fbff] px-3 py-3">
        <p className="text-[11px] text-slate-400">유입/마진 변화</p>
        <div className="mt-2 grid grid-cols-2 gap-3 text-xs text-slate-600">
          <p>
            방문객: {data.promotionEfficiency.beforeVisitors.toLocaleString()}명 →{" "}
            {data.promotionEfficiency.afterVisitors.toLocaleString()}명
          </p>
          <p>
            마진 영향: {data.promotionEfficiency.marginImpactPct >= 0 ? "+" : ""}
            {data.promotionEfficiency.marginImpactPct}%
          </p>
        </div>
      </div>
      <p className="mt-4 rounded-xl bg-[#EDF3FF] px-3 py-2 text-xs font-medium text-[#2454C8]">
        {data.promotionEfficiency.recommendation}
      </p>
    </article>
  );
};

const StoreBenchmarkCard = ({ data }: { data: SalesOpportunityMock }) => {
  const maxBenchmarkPeak = Math.max(
    data.benchmark.peakSalesStore,
    data.benchmark.peakSalesCluster,
    1,
  );

  return (
    <article className="rounded-[28px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-800">매장 간 벤치마킹 분석</p>
          <p className="mt-1 text-xs text-slate-400">
            {data.benchmark.clusterName} ({data.benchmark.clusterSize}개 매장)
          </p>
          {data.benchmark.clusterReason ? (
            <p className="mt-1 text-[11px] text-slate-400">{data.benchmark.clusterReason}</p>
          ) : null}
        </div>
        <span className="rounded-full bg-[#eef4ff] px-2.5 py-1 text-[10px] font-bold text-[#2454C8]">
          클러스터
        </span>
      </div>
      <div className="mt-4 rounded-2xl bg-[#f8fbff] px-3 py-3">
        <p className="text-[11px] text-slate-400">피크 시간대 매출 비교</p>
        <div className="mt-2 space-y-2">
          {[
            {
              label: "현재 매장",
              value: data.benchmark.peakSalesStore,
              tone: "bg-[#2454C8]",
            },
            {
              label: "그룹 평균",
              value: data.benchmark.peakSalesCluster,
              tone: "bg-[#bfd5ff]",
            },
          ].map((item) => {
            const width = Math.max(12, Math.round((item.value / maxBenchmarkPeak) * 100));
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>{item.label}</span>
                  <span>{formatWon(item.value)}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100">
                  <div className={`h-2 rounded-full ${item.tone}`} style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 rounded-2xl bg-[#f8fbff] px-3 py-3 text-xs text-slate-600">
        <p>
          도넛 비중 {data.benchmark.donutMixStorePct}% (평균 {data.benchmark.donutMixClusterPct}%)
        </p>
        <p>
          음료 비중 {data.benchmark.beverageMixStorePct}% (평균{" "}
          {data.benchmark.beverageMixClusterPct}%)
        </p>
      </div>
      <p className="mt-4 rounded-xl bg-[#EDF3FF] px-3 py-2 text-xs font-medium text-[#2454C8]">
        {data.benchmark.bestStoreName} 운영 패턴 기준: {data.benchmark.recommendation}
      </p>
    </article>
  );
};

const renderOpportunityCard = (activeTab: SalesOpportunityTabKey, data: SalesOpportunityMock) => {
  if (activeTab === "marketing_roi") {
    return <MarketingRoiCard data={data} />;
  }

  if (activeTab === "channel_payment") {
    return <ChannelPaymentCard data={data} />;
  }

  if (activeTab === "promotion_efficiency") {
    return <PromotionEfficiencyCard data={data} />;
  }

  return <StoreBenchmarkCard data={data} />;
};

export const SalesV2OpportunitySection = ({
  data,
  activeTab,
  onChangeTab,
}: {
  data: SalesOpportunityMock;
  activeTab: SalesOpportunityTabKey;
  onChangeTab: (tab: SalesOpportunityTabKey) => void;
}) => {
  return (
    <section className="space-y-3">
      <SalesV2OpportunityTabs activeTab={activeTab} onChangeTab={onChangeTab} />
      {renderOpportunityCard(activeTab, data)}
    </section>
  );
};
