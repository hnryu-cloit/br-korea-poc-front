import { useQuery } from "@tanstack/react-query";

import { getSalesSummary } from "@/features/sales/api/sales";
import { salesQueryKeys } from "@/features/sales/queries/salesQueryKeys";
import type { SalesBenchmarkData } from "@/features/sales/types/sales-opportunity";
import type { SalesSummaryResponse } from "@/features/sales/types/sales";
import { getStores } from "@/features/stores/api/stores";

type StoreSummary = {
  storeId: string;
  storeName: string;
  region: string;
  summary: SalesSummaryResponse;
};

const DONUT_KEYWORDS = ["도넛", "던킨", "donut", "doughnut"];
const BEVERAGE_KEYWORDS = ["커피", "라떼", "음료", "아메리카노", "tea", "콜드브루", "에이드"];

function includesAnyKeyword(target: string, keywords: string[]) {
  const lower = target.toLowerCase();
  return keywords.some((keyword) => lower.includes(keyword.toLowerCase()));
}

function getPeakRevenue(summary: SalesSummaryResponse) {
  return Math.max(...summary.weekly_data.map((item) => item.revenue), summary.today_revenue, 0);
}

function toAreaBand(areaRaw?: number | string) {
  const area = Number(areaRaw ?? 0);
  if (!Number.isFinite(area) || area <= 0) return "unknown";
  if (area < 20) return "small";
  if (area < 35) return "medium";
  return "large";
}

function getMix(summary: SalesSummaryResponse) {
  const donutSales = summary.top_products
    .filter((item) => includesAnyKeyword(item.name, DONUT_KEYWORDS))
    .reduce((acc, item) => acc + item.sales, 0);
  const beverageSales = summary.top_products
    .filter((item) => includesAnyKeyword(item.name, BEVERAGE_KEYWORDS))
    .reduce((acc, item) => acc + item.sales, 0);
  const total = donutSales + beverageSales;
  if (total <= 0) {
    return {
      donutPct: 0,
      beveragePct: 0,
    };
  }
  return {
    donutPct: Math.round((donutSales / total) * 100),
    beveragePct: Math.round((beverageSales / total) * 100),
  };
}

export const useGetSalesBenchmarkQuery = (storeId?: string, dateFrom?: string, dateTo?: string) =>
  useQuery({
    queryKey: salesQueryKeys.benchmark(`${storeId ?? "all"}:${dateFrom ?? ""}:${dateTo ?? ""}`),
    queryFn: async (): Promise<SalesBenchmarkData | null> => {
      if (!storeId) return null;

      const stores = await getStores();
      const currentStore = stores.find((store) => store.store_id === storeId);
      if (!currentStore) return null;

      const currentAreaBand = toAreaBand(currentStore.store_area_pyeong);
      const sameClusterStores = stores
        .filter((store) => {
          if (store.store_id === storeId) return false;
          const storeAreaBand = toAreaBand(store.store_area_pyeong);
          return (
            store.region === currentStore.region &&
            (store.store_type ?? "") === (currentStore.store_type ?? "") &&
            (store.business_type ?? "") === (currentStore.business_type ?? "") &&
            storeAreaBand === currentAreaBand
          );
        })
        .slice(0, 6);
      const sameRegionStores = stores
        .filter((store) => store.store_id !== storeId && store.region === currentStore.region)
        .slice(0, 6);
      const peerStores =
        sameClusterStores.length > 0
          ? sameClusterStores
          : sameRegionStores.length > 0
            ? sameRegionStores
            : [];
      if (peerStores.length === 0) {
        return null;
      }
      const targetStores = [currentStore, ...peerStores];

      const summaryResults = await Promise.all(
        targetStores.map(async (store): Promise<StoreSummary | null> => {
          try {
            const summary = await getSalesSummary({
              store_id: store.store_id,
              date_from: dateFrom,
              date_to: dateTo,
            });
            return {
              storeId: store.store_id,
              storeName: store.store_name,
              region: store.region,
              summary,
            };
          } catch {
            return null;
          }
        }),
      );
      const summaryList = summaryResults.filter((item): item is StoreSummary => Boolean(item));

      const currentSummary = summaryList.find((item) => item.storeId === storeId);
      if (!currentSummary) return null;
      const peers = summaryList.filter((item) => item.storeId !== storeId);
      if (peers.length === 0) return null;

      const bestPeer = [...peers].sort(
        (a, b) => b.summary.today_revenue - a.summary.today_revenue,
      )[0];
      const peerAvgRevenue = Math.round(
        peers.reduce((acc, item) => acc + item.summary.today_revenue, 0) / peers.length,
      );
      const peerPeakRevenue = Math.round(
        peers.reduce((acc, item) => acc + getPeakRevenue(item.summary), 0) / peers.length,
      );

      const currentMix = getMix(currentSummary.summary);
      const peerMix = peers.reduce(
        (acc, item) => {
          const mix = getMix(item.summary);
          return {
            donutPct: acc.donutPct + mix.donutPct,
            beveragePct: acc.beveragePct + mix.beveragePct,
          };
        },
        { donutPct: 0, beveragePct: 0 },
      );

      const peerDonutMixPct = Math.round(peerMix.donutPct / peers.length);
      const peerBeverageMixPct = Math.round(peerMix.beveragePct / peers.length);
      const clusterReason =
        sameClusterStores.length > 0
          ? `지역(${currentStore.region})·운영타입(${currentStore.store_type})·업태(${currentStore.business_type ?? "-"})·규모(${currentAreaBand})`
          : `지역(${currentStore.region}) 중심 유사군`;

      return {
        clusterName:
          sameClusterStores.length > 0
            ? `${currentStore.region} ${currentStore.store_type} 유사군`
            : `${currentStore.region} 유사 상권`,
        clusterSize: peers.length + 1,
        clusterReason,
        bestStoreName: bestPeer.storeName,
        bestStoreRevenue: Math.round(bestPeer.summary.today_revenue),
        currentStoreRevenue: Math.round(currentSummary.summary.today_revenue),
        peerAvgRevenue,
        currentPeakRevenue: Math.round(getPeakRevenue(currentSummary.summary)),
        peerPeakRevenue,
        currentDonutMixPct: currentMix.donutPct,
        peerDonutMixPct,
        currentBeverageMixPct: currentMix.beveragePct,
        peerBeverageMixPct,
      };
    },
    staleTime: 60_000,
    enabled: Boolean(storeId),
  });
