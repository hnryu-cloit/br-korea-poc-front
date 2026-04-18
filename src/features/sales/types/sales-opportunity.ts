import type { SalesPrompt } from "@/features/sales/types/sales";

export interface SalesMarketingRoiMock {
  campaignName: string;
  campaignCode?: string;
  benefitType?: string;
  periodLabelBefore?: string;
  periodLabelDuring?: string;
  periodLabelAfter?: string;
  baselineRevenue: number;
  campaignRevenue: number;
  postCampaignRevenue?: number;
  promoCost: number;
  upliftRevenue: number;
  roiRate: number;
  paybackDays?: number | null;
  nextAction: string;
}

export interface SalesChannelOptimizationMock {
  onlineSharePct: number;
  offlineSharePct: number;
  paymentMix: {
    label: string;
    sharePct: number;
    feeRatePct: number;
    netContribution: number;
  }[];
  recommendation: string;
}

export interface SalesPromotionEfficiencyMock {
  partnerName: string;
  discountCost: number;
  beforeAov: number;
  afterAov: number;
  beforeVisitors: number;
  afterVisitors: number;
  marginImpactPct: number;
  recommendation: string;
}

export interface SalesBenchmarkMock {
  clusterName: string;
  clusterSize: number;
  clusterReason?: string;
  peakSalesStore: number;
  peakSalesCluster: number;
  donutMixStorePct: number;
  donutMixClusterPct: number;
  beverageMixStorePct: number;
  beverageMixClusterPct: number;
  bestStoreName: string;
  recommendation: string;
}

export interface SalesBenchmarkData {
  clusterName: string;
  clusterSize: number;
  clusterReason?: string;
  bestStoreName: string;
  bestStoreRevenue: number;
  currentStoreRevenue: number;
  peerAvgRevenue: number;
  currentPeakRevenue: number;
  peerPeakRevenue: number;
  currentDonutMixPct: number;
  peerDonutMixPct: number;
  currentBeverageMixPct: number;
  peerBeverageMixPct: number;
}

export interface SalesOpportunityMock {
  marketingRoi: SalesMarketingRoiMock;
  channelOptimization: SalesChannelOptimizationMock;
  promotionEfficiency: SalesPromotionEfficiencyMock;
  benchmark: SalesBenchmarkMock;
  promptSuggestions: SalesPrompt[];
}

export type SalesOpportunityTabKey =
  | "marketing_roi"
  | "channel_payment"
  | "promotion_efficiency"
  | "store_benchmark";
