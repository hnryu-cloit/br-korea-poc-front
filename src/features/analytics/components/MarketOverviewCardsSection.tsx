import { Building2, CreditCard, MapPin, Users } from "lucide-react";

import type {
  CustomerProfileResponse,
  StoreProfileResponse,
} from "@/features/analytics/types/analytics";
import { formatWonCompact, getTopSegment } from "@/features/analytics/utils/market";

type Props = {
  storeProfile?: StoreProfileResponse;
  customerProfile?: CustomerProfileResponse;
  isLoading: boolean;
};

const CARD_CLASS =
  "rounded-[28px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]";

export function MarketOverviewCardsSection({ storeProfile, customerProfile, isLoading }: Props) {
  const topSegment = getTopSegment(customerProfile?.customer_segments ?? []);

  if (isLoading) {
    return (
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={`${CARD_CLASS} h-[104px] animate-pulse bg-slate-100`} />
        ))}
      </section>
    );
  }

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <article className={CARD_CLASS}>
        <div className="mb-2 flex items-center gap-2 text-slate-500">
          <MapPin className="h-4 w-4" />
          <p className="text-xs font-semibold tracking-[0.08em]">입지</p>
        </div>
        <p className="text-lg font-bold text-slate-900">
          {storeProfile ? `${storeProfile.sido} ${storeProfile.region}` : "-"}
        </p>
        <p className="mt-1 text-xs text-slate-500">매장 유형 {storeProfile?.store_type ?? "-"}</p>
      </article>

      <article className={CARD_CLASS}>
        <div className="mb-2 flex items-center gap-2 text-slate-500">
          <Building2 className="h-4 w-4" />
          <p className="text-xs font-semibold tracking-[0.08em]">유사 매장</p>
        </div>
        <p className="text-lg font-bold text-slate-900">
          {storeProfile ? `${storeProfile.peer_count.toLocaleString("ko-KR")}개` : "-"}
        </p>
        <p className="mt-1 text-xs text-slate-500">{storeProfile?.business_type ?? "-"}</p>
      </article>

      <article className={CARD_CLASS}>
        <div className="mb-2 flex items-center gap-2 text-slate-500">
          <Users className="h-4 w-4" />
          <p className="text-xs font-semibold tracking-[0.08em]">주요 고객군</p>
        </div>
        <p className="text-lg font-bold text-slate-900">{topSegment?.segmentName ?? "-"}</p>
        <p className="mt-1 text-xs text-slate-500">
          {topSegment ? `전체 대비 ${topSegment.ratioPct}%` : "집계 없음"}
        </p>
      </article>

      <article className={CARD_CLASS}>
        <div className="mb-2 flex items-center gap-2 text-slate-500">
          <CreditCard className="h-4 w-4" />
          <p className="text-xs font-semibold tracking-[0.08em]">제휴/매출</p>
        </div>
        <p className="text-lg font-bold text-slate-900">
          {storeProfile ? formatWonCompact(storeProfile.actual_sales_amt) : "-"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          제휴 할인 {customerProfile?.telecom_discounts.length ?? 0}종
        </p>
      </article>
    </section>
  );
}
