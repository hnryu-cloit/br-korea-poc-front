import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { PageHero } from "@/commons/components/page/page-layout";
import { formatCountWithUnit } from "@/commons/utils/format-count";
import { getSignals } from "@/features/admin/signals/api/signals";
import { SignalsCardsSection } from "@/features/admin/signals/components/SignalsCardsSection";

export function SignalsPage() {
  const signalsQuery = useQuery({
    queryKey: ["signals"],
    queryFn: getSignals,
    refetchInterval: 30_000,
  });

  const signals = signalsQuery.data?.items ?? [];
  const highCount = signalsQuery.data?.high_count ?? 0;

  return (
    <div className="space-y-6">
      <PageHero
        title="전국 매장 매출 이상 신호를 확인합니다."
        description="긴급 대응이 필요한 시그널을 우선순위별로 정리해 보여줍니다."
      >
        {highCount > 0 ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
            <Bell className="h-4 w-4" />
            긴급 시그널 {formatCountWithUnit(highCount, "건")} · 즉시 검토 필요
          </div>
        ) : null}
      </PageHero>

      <SignalsCardsSection signals={signals} isLoading={signalsQuery.isLoading} />
    </div>
  );
}
