import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { CustomerProfileResponse } from "@/features/analytics/types/analytics";

type Props = {
  data?: CustomerProfileResponse;
  isLoading: boolean;
};

const SEGMENT_COLORS = ["#2454C8", "#4C7DE8", "#7AA2F6", "#A9C5FF", "#D6E4FF"];

export function MarketCustomerSection({ data, isLoading }: Props) {
  const sortedSegments = [...(data?.customer_segments ?? [])].sort((a, b) => b.count - a.count);
  const totalSegmentCount = sortedSegments.reduce((acc, segment) => acc + segment.count, 0);

  return (
    <section className="rounded-[28px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <h3 className="text-sm font-bold text-slate-800 mb-4">주요 고객 & 제휴 혜택</h3>

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
          {sortedSegments.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
              <div className="rounded-2xl bg-[#f8fbff] p-3">
                <p className="mb-2 text-[11px] text-slate-400">
                  고객 분포
                </p>
                <div className="h-[190px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sortedSegments}
                        dataKey="count"
                        nameKey="segment_nm"
                        innerRadius={44}
                        outerRadius={72}
                        paddingAngle={2}
                        strokeWidth={0}
                      >
                        {sortedSegments.map((segment, index) => (
                          <Cell
                            key={segment.segment_nm}
                            fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          `${Number(value).toLocaleString("ko-KR")}건`,
                          "건수",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <p className="text-[11px] text-slate-400 mb-3">
                  캠페인 타겟 고객 분포
                </p>
                <div className="space-y-2.5">
                  {sortedSegments.map((segment, index) => {
                    const ratio =
                      totalSegmentCount > 0
                        ? Math.round((segment.count / totalSegmentCount) * 100)
                        : 0;
                    return (
                      <div key={segment.segment_nm}>
                        <div className="mb-1 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
                              }}
                            />
                            <span className="text-sm text-slate-700">{segment.segment_nm}</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-500">
                            {segment.count}건 ({ratio}%)
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${ratio}%`,
                              backgroundColor: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {data.telecom_discounts.length > 0 && (
            <div>
              <p className="text-[11px] text-slate-400 mb-3">
                활성 통신사 제휴 할인
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {data.telecom_discounts.map((discount) => (
                  <div
                    key={`${discount.name}-${discount.value}`}
                    className="rounded-2xl bg-[#f8fbff] px-3 py-3"
                  >
                    <p className="text-sm font-bold text-slate-800">{discount.name}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
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
