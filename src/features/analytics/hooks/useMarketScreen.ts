import { useState } from "react";

import { getAnalyticsWeeklyReport } from "@/features/analytics/api/analytics";
import type { AnalysisScope } from "@/features/analytics/components/AnalysisScopeFilterBar";

export function useMarketScreen(scope: AnalysisScope, storeId: string) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadWeeklyReport = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const { blob, filename } = await getAnalyticsWeeklyReport({
        store_id: storeId,
        gu: scope.gu,
        dong: scope.dong,
        industry: scope.industry,
        year: Number(scope.year),
        quarter: scope.quarter,
        radius_m: scope.radiusMeters,
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  return { isDownloading, handleDownloadWeeklyReport };
}
