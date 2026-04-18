import type { CustomerProfileResponse } from "@/features/analytics/types/analytics";

type Props = {
  data?: CustomerProfileResponse;
  isLoading: boolean;
};

export function MarketCustomerSection({ data, isLoading }: Props) {
  const totalSegmentCount = data?.customer_segments.reduce((acc, s) => acc + s.count, 0) ?? 0;

  return (
    <section className="rounded-[26px] border border-border bg-white px-6 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <h3 className="text-base font-bold text-slate-900 mb-4">주요 고객 & 제휴 혜택</h3>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 rounded-lg bg-slate-100 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && !data && (
        <p className="text-sm text-slate-400 py-4 text-center">고객 분석 데이터가 없습니다.</p>
      )}

      {!isLoading && data && (
        <div className="space-y-6">
          {data.customer_segments.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 mb-3">
                캠페인 타겟 고객 분포
              </p>
              <div className="space-y-2.5">
                {data.customer_segments.map((seg) => {
                  const ratio = totalSegmentCount > 0 ? Math.round((seg.count / totalSegmentCount) * 100) : 0;
                  return (
                    <div key={seg.segment_nm}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-700">{seg.segment_nm}</span>
                        <span className="text-xs font-semibold text-slate-500">
                          {seg.count}건 ({ratio}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#2454C8]"
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {data.telecom_discounts.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 mb-3">
                활성 통신사 제휴 할인
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {data.telecom_discounts.map((discount) => (
                  <div
                    key={`${discount.name}-${discount.value}`}
                    className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-slate-800">{discount.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {discount.type_nm} · {discount.value} {discount.method_nm}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.customer_segments.length === 0 && data.telecom_discounts.length === 0 && (
            <p className="text-sm text-slate-400 py-4 text-center">고객 분석 데이터가 없습니다.</p>
          )}
        </div>
      )}
    </section>
  );
}