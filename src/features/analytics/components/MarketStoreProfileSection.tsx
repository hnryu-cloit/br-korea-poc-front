import type { StoreProfileResponse } from "@/features/analytics/types/analytics";
import { formatWonCompact } from "@/features/analytics/utils/market";

type Props = {
  data?: StoreProfileResponse;
  isLoading: boolean;
};

const ProfileRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
    <span className="text-sm text-slate-500 shrink-0">{label}</span>
    <span className="text-sm font-semibold text-slate-800 text-right">{value}</span>
  </div>
);

export function MarketStoreProfileSection({ data, isLoading }: Props) {
  return (
    <section className="rounded-[26px] border border-border bg-white px-6 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <h3 className="text-base font-bold text-slate-900 mb-4">우리 매장 상권</h3>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 rounded-lg bg-slate-100 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && !data && (
        <p className="text-sm text-slate-400 py-4 text-center">매장 정보가 없습니다.</p>
      )}

      {!isLoading && data && (
        <div>
          <ProfileRow label="매장명" value={data.store_nm || "-"} />
          <ProfileRow label="지역" value={`${data.sido} ${data.region}`} />
          <ProfileRow label="매장 유형" value={data.store_type} />
          <ProfileRow label="매장 면적" value={`${data.area_pyeong}평`} />
          <ProfileRow label="업종" value={data.business_type} />
          <ProfileRow label="유사 매장" value={`${data.peer_count}개 매장`} />
          <ProfileRow label="추정 매출" value={formatWonCompact(data.actual_sales_amt)} />
        </div>
      )}
    </section>
  );
}
