import { formatWonCompact } from "@/features/analytics/utils/market";
import type { MarketIntelligenceResponse } from "@/features/analytics/types/analytics";

type Props = {
  data?: MarketIntelligenceResponse;
  isLoading: boolean;
};

function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "미제공";
  return `${value.toFixed(1)}%`;
}

export function MarketIntelligenceSection({ data, isLoading }: Props) {
  const unavailableCustomerRatio =
    data?.customer_characteristics.new_customer_ratio == null ||
    data?.customer_characteristics.regular_customer_ratio == null;
  const unavailableVisitTrait =
    !data?.customer_characteristics.top_age_group || !data?.customer_characteristics.top_visit_time;
  const unavailableReasons = (data?.data_sources ?? []).filter(
    (source) => source.includes("미식별") || source.includes("미제공"),
  );

  return (
    <section className="rounded-[28px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-slate-800">
            반경 {data?.radius_km ?? 3}km 상권·고객 종합 분석
          </p>
          <span className="rounded-full bg-[linear-gradient(135deg,#FF6E00_0%,#DA1884_100%)] px-2.5 py-1 text-[10px] font-bold text-white">
            상권 인텔리전스
          </span>
        </div>
        <p className="text-xs text-slate-400">업종·매출·인구·지역현황·고객특성 실데이터 기준</p>
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-3">
          <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-44 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-44 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      ) : null}

      {!isLoading && data ? (
        <div className="mt-4 space-y-5">
          <article className="rounded-2xl bg-[#f8fbff] p-4">
            <p className="text-sm font-bold text-slate-800">1. 업종 분석</p>
            <div className="mt-3 grid gap-4 lg:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-slate-700">최근 업소수 변화추이</p>
                <div className="mt-2 space-y-2">
                  {data.industry_analysis.business_count_trend.map((point) => (
                    <div
                      key={point.period}
                      className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs text-slate-600"
                    >
                      <span>{point.period}</span>
                      <span className="font-semibold text-slate-900">
                        {point.business_count.toLocaleString()}개
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">5년 업력현황</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {data.industry_analysis.business_age_5y.map((item) => (
                    <div
                      key={item.bucket}
                      className="rounded-lg bg-white px-3 py-2 text-xs text-slate-600"
                    >
                      <p>{item.bucket}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {item.business_count.toLocaleString()}개
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-2xl bg-[#f8fbff] p-4">
            <p className="text-sm font-bold text-slate-800">2. 매출 분석</p>
            <div className="mt-3 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="text-xs font-semibold text-slate-700">매출건수 및 월평균 매출추이</p>
                <div className="mt-2 space-y-2">
                  {data.sales_analysis.monthly_sales_trend.map((point) => (
                    <div
                      key={point.period}
                      className="grid grid-cols-3 rounded-lg bg-white px-3 py-2 text-xs text-slate-600"
                    >
                      <span>{point.period}</span>
                      <span className="text-center">{point.sales_count.toLocaleString()}건</span>
                      <span className="text-right font-semibold text-slate-900">
                        {formatWonCompact(point.sales_amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-1">
                <div className="rounded-xl bg-white px-3 py-2">
                  <p className="text-[11px] text-slate-500">월 평균 매출</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatWonCompact(data.sales_analysis.monthly_average_sales)}
                  </p>
                </div>
                <div className="rounded-xl bg-white px-3 py-2">
                  <p className="text-[11px] text-slate-500">월 추정매출</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatWonCompact(data.estimated_sales_summary.monthly_estimated_sales)}
                  </p>
                </div>
                <div className="rounded-xl bg-white px-3 py-2">
                  <p className="text-[11px] text-slate-500">주말 매출 비중</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {data.estimated_sales_summary.weekend_ratio.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-2xl bg-[#f8fbff] p-4">
            <p className="text-sm font-bold text-slate-800">3. 인구 분석</p>
            <div className="mt-3 grid gap-4 lg:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-slate-700">유동·주거·직장 인구 추이</p>
                <div className="mt-2 space-y-2">
                  {data.population_analysis.population_trend.map((point) => (
                    <div
                      key={point.period}
                      className="rounded-lg bg-white px-3 py-2 text-xs text-slate-600"
                    >
                      <p className="font-semibold text-slate-800">{point.period}</p>
                      <p className="mt-1">
                        유동 {point.floating_population.toLocaleString()}명 · 주거{" "}
                        {point.residential_population.toLocaleString()}명 · 직장{" "}
                        {point.worker_population.toLocaleString()}명
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">
                  주거/직장 인구 소득소비(추정)
                </p>
                <div className="mt-2 space-y-2">
                  {data.population_analysis.income_consumption.map((item) => (
                    <div key={item.segment}>
                      <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                        <span>{item.segment}</span>
                        <span>
                          {item.estimated_customers.toLocaleString()}명 ·{" "}
                          {item.sales_share_ratio.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-[linear-gradient(90deg,#285ed3_0%,#5aa3ff_100%)]"
                          style={{ width: `${item.sales_share_ratio}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-slate-500">{data.floating_population_analysis}</p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl bg-[#f8fbff] p-4">
            <p className="text-sm font-bold text-slate-800">4. 지역현황</p>
            <div className="mt-3 grid gap-2 md:grid-cols-4">
              <div className="rounded-xl bg-white px-3 py-2 text-xs">
                <p className="text-slate-500">세대수(추정)</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {data.regional_status.household_count.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl bg-white px-3 py-2 text-xs">
                <p className="text-slate-500">공동주택(추정)</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {data.regional_status.apartment_household_count.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl bg-white px-3 py-2 text-xs">
                <p className="text-slate-500">주요시설 수(프록시)</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {data.regional_status.major_facilities_count.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl bg-white px-3 py-2 text-xs">
                <p className="text-slate-500">교통 접근지수(프록시)</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {data.regional_status.transport_access_index.toFixed(1)}
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {data.estimated_residence_regions.map((region) => (
                <div
                  key={region.region_name}
                  className="rounded-lg bg-white px-3 py-2 text-xs text-slate-600"
                >
                  {region.region_name} · {region.share_ratio.toFixed(1)}% ·{" "}
                  {region.estimated_customers.toLocaleString()}명
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl bg-[#f8fbff] p-4">
            <p className="text-sm font-bold text-slate-800">5. 고객특성</p>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              <div className="rounded-xl bg-white px-3 py-2 text-xs">
                <p className="text-slate-500">남/여 비율</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  남 {formatPercent(data.customer_characteristics.male_ratio)} / 여{" "}
                  {formatPercent(data.customer_characteristics.female_ratio)}
                </p>
              </div>
              <div className="rounded-xl bg-white px-3 py-2 text-xs">
                <p
                  className="text-slate-500"
                  title="고객 식별 원천(customer_id/member_id 등) 또는 신규/재방문 분류 지표가 있어야 계산됩니다."
                >
                  신규/단골 비율
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  신규 {formatPercent(data.customer_characteristics.new_customer_ratio)} / 단골{" "}
                  {formatPercent(data.customer_characteristics.regular_customer_ratio)}
                </p>
                {unavailableCustomerRatio ? (
                  <p className="mt-1 text-[11px] text-amber-700">
                    원천 분류 데이터가 없어 현재는 미제공입니다.
                  </p>
                ) : null}
              </div>
              <div className="rounded-xl bg-white px-3 py-2 text-xs">
                <p
                  className="text-slate-500"
                  title="연령/시간대 분포 집계가 없으면 미제공으로 표시됩니다."
                >
                  주요 방문 특성
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {data.customer_characteristics.top_age_group ?? "미제공"} ·{" "}
                  {data.customer_characteristics.top_visit_time ?? "미제공"}
                </p>
                {unavailableVisitTrait ? (
                  <p className="mt-1 text-[11px] text-amber-700">
                    방문 특성 산출에 필요한 원천 집계가 없어 미제공입니다.
                  </p>
                ) : null}
              </div>
            </div>

            {unavailableReasons.length > 0 ? (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
                <p className="font-semibold">미제공 항목 안내</p>
                <ul className="mt-1 list-disc pl-4">
                  {unavailableReasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>

          <article className="rounded-2xl bg-[#f8fbff] p-4">
            <p className="text-sm font-bold text-slate-800">데이터 출처</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-600">
              {data.data_sources.map((source) => (
                <li key={source}>{source}</li>
              ))}
            </ul>
          </article>
        </div>
      ) : null}
    </section>
  );
}
