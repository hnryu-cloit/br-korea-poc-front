import { formatWonCompact } from "@/features/analytics/utils/market";
import type { MarketIntelligenceResponse } from "@/features/analytics/types/analytics";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Props = {
  data?: MarketIntelligenceResponse;
  isLoading: boolean;
};

function trendColor(trend: string): string {
  if (trend === "up") return "text-emerald-600 bg-emerald-50";
  if (trend === "down") return "text-rose-600 bg-rose-50";
  return "text-slate-600 bg-slate-100";
}

function trendLabel(trend: string): string {
  if (trend === "up") return "상승";
  if (trend === "down") return "하락";
  return "보합";
}

function heatmapCellColor(index: number): string {
  if (index >= 85) return "bg-[#1d4ed8] text-white";
  if (index >= 70) return "bg-[#3b82f6] text-white";
  if (index >= 55) return "bg-[#93c5fd] text-[#0f172a]";
  return "bg-[#e2e8f0] text-[#475569]";
}

export function MarketIntelligenceSection({ data, isLoading }: Props) {
  const maxFloatingPopulation = data
    ? Math.max(...data.floating_population_trend.map((point) => point.floating_population), 1)
    : 1;
  const householdPieColors = ["#2b62d7", "#89afff"];

  return (
    <section className="rounded-3xl border border-border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.08em] text-[#2c61d6]">상권 인텔리전스</p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">반경 {data?.radius_km ?? 3}km 경쟁·유동인구 종합 분석</h3>
        </div>
        <p className="text-xs text-slate-500">지점별 상권/경쟁 데이터 + 오픈업 결제건 + 서울시 공공데이터 기준</p>
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
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-[#e5ecfa] bg-[#fbfdff] p-4">
              <p className="text-sm font-semibold text-slate-900">외식업 매출 파이 (제과·커피)</p>
              <div className="mt-3 space-y-2">
                {data.category_sales_pie.map((slice) => (
                  <div key={slice.category}>
                    <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                      <span>{slice.category}</span>
                      <span>{slice.share_ratio.toFixed(1)}% · {formatWonCompact(slice.sales_amount)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-[linear-gradient(90deg,#285ed3_0%,#5aa3ff_100%)]" style={{ width: `${slice.share_ratio}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-[#e5ecfa] bg-[#fbfdff] p-4">
              <p className="text-sm font-semibold text-slate-900">서울시 공공데이터 유동인구 vs 매출 추세</p>
              <div className="mt-3 grid grid-cols-6 gap-2">
                {data.floating_population_trend.map((point) => (
                  <div key={point.month} className="space-y-1 text-center">
                    <div className="mx-auto flex h-20 w-6 items-end rounded-md bg-slate-100">
                      <div
                        className="w-full rounded-md bg-[linear-gradient(180deg,#7cb6ff_0%,#285ed3_100%)]"
                        style={{ height: `${Math.max(12, (point.floating_population / maxFloatingPopulation) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500">{point.month.slice(5)}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">{data.floating_population_analysis}</p>
            </article>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-[#e5ecfa] bg-[#fbfdff] p-4">
              <p className="text-sm font-semibold text-slate-900">주거인구 상세(연령대별 남/여)</p>
              <div className="mt-3 h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={data.residential_population_radar}>
                    <PolarGrid stroke="#d8e3fb" />
                    <PolarAngleAxis dataKey="age_group" tick={{ fontSize: 11, fill: "#64748b" }} />
                    <Radar
                      name="남"
                      dataKey="male_population"
                      stroke="#2b62d7"
                      fill="#2b62d7"
                      fillOpacity={0.28}
                    />
                    <Radar
                      name="여"
                      dataKey="female_population"
                      stroke="#f472b6"
                      fill="#f472b6"
                      fillOpacity={0.2}
                    />
                    <Legend />
                    <Tooltip formatter={(value) => `${Number(value).toLocaleString()}명`} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="rounded-2xl border border-[#e5ecfa] bg-[#fbfdff] p-4">
              <p className="text-sm font-semibold text-slate-900">가구 구성 비중(1인가구, 3인가족)</p>
              <div className="mt-3 h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.household_composition_pie}
                      dataKey="share_ratio"
                      nameKey="household_type"
                      innerRadius={52}
                      outerRadius={88}
                      paddingAngle={2}
                      strokeWidth={0}
                    >
                      {data.household_composition_pie.map((item, index) => (
                        <Cell key={item.household_type} fill={householdPieColors[index % householdPieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, _name, payload) => {
                        const item = payload?.payload as { household_count?: number } | undefined;
                        return [`${Number(value).toFixed(1)}% (${Number(item?.household_count ?? 0).toLocaleString()}가구)`, "비중"];
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </article>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
            <article className="rounded-2xl border border-[#e5ecfa] bg-[#fbfdff] p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">소비자 추정 거주 지역 데이터</p>
                <p className="text-[11px] text-slate-500">상위 {data.estimated_residence_regions.length}개 권역</p>
              </div>
              <div className="mt-3 space-y-2">
                {data.estimated_residence_regions.map((region) => (
                  <div key={region.region_name}>
                    <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                      <span>{region.region_name}</span>
                      <span>{region.share_ratio.toFixed(1)}% · {region.estimated_customers.toLocaleString()}명</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-[linear-gradient(90deg,#1d4ed8_0%,#60a5fa_100%)]"
                        style={{ width: `${region.share_ratio}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-[#e5ecfa] bg-[#fbfdff] p-4">
              <p className="text-sm font-semibold text-slate-900">추정 매출 데이터</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl bg-white px-3 py-2">
                  <p className="text-[11px] text-slate-500">월 추정매출</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatWonCompact(data.estimated_sales_summary.monthly_estimated_sales)}
                  </p>
                </div>
                <div className="rounded-xl bg-white px-3 py-2">
                  <p className="text-[11px] text-slate-500">주 추정매출</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatWonCompact(data.estimated_sales_summary.weekly_estimated_sales)}
                  </p>
                </div>
                <div className="rounded-xl bg-white px-3 py-2">
                  <p className="text-[11px] text-slate-500">주말 매출 비중</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {data.estimated_sales_summary.weekend_ratio.toFixed(1)}%
                  </p>
                </div>
              </div>
            </article>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
            <article className="rounded-2xl border border-[#e5ecfa] bg-[#fbfdff] p-4">
              <p className="text-sm font-semibold text-slate-900">매출 히트맵</p>
              <p className="mt-1 text-xs text-slate-500">요일 × 시간대 판매 강도(지수)</p>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-center text-xs">
                  <thead>
                    <tr className="text-slate-500">
                      <th className="px-2 py-1 text-left">시간대</th>
                      {["월", "화", "수", "목", "금", "토", "일"].map((dow) => (
                        <th key={dow} className="px-1 py-1">{dow}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {["08-11", "11-14", "14-18", "18-22"].map((hourBand) => (
                      <tr key={hourBand}>
                        <td className="px-2 py-1 text-left font-medium text-slate-600">{hourBand}</td>
                        {["월", "화", "수", "목", "금", "토", "일"].map((dow) => {
                          const cell = data.sales_heatmap.find(
                            (item) => item.dow_label === dow && item.hour_band === hourBand,
                          );
                          const index = cell?.sales_index ?? 0;
                          return (
                            <td key={`${hourBand}-${dow}`} className="px-1 py-1">
                              <div className={`rounded-md px-1.5 py-1 font-semibold ${heatmapCellColor(index)}`}>
                                {index}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="rounded-2xl border border-[#e5ecfa] bg-[#fbfdff] p-4">
              <p className="text-sm font-semibold text-slate-900">매장 보고서 조회</p>
              <div className="mt-3 space-y-2">
                {data.store_reports.map((report) => (
                  <div key={report.report_id} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <p className="text-xs font-semibold text-slate-800">{report.title}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {report.period} · 생성일 {report.generated_at}
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[11px] text-[#1d4ed8]">{report.report_id}</span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        {report.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <article className="rounded-2xl border border-[#e5ecfa] bg-[#fbfdff] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">경쟁사 10곳 매출 트렌드 + 결제건 연령/성별 분포</p>
              <p className="text-xs text-slate-500">거리 기준 3km 이내</p>
            </div>
            <div className="space-y-3">
              {data.competitors.map((competitor) => {
                const maxSales = Math.max(...competitor.sales_trend.map((point) => point.sales_amount), 1);
                const ageTop = competitor.payment_demographics[0];
                const ageTotal = ageTop ? ageTop.male_payment_count + ageTop.female_payment_count : 0;
                return (
                  <div key={`${competitor.rank}-${competitor.store_name}`} className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {competitor.rank}. {competitor.store_name}
                        </p>
                        <p className="text-xs text-slate-500">{competitor.brand_name} · {competitor.distance_km.toFixed(2)}km</p>
                      </div>
                      <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${trendColor(competitor.trend_direction)}`}>
                        매출 {trendLabel(competitor.trend_direction)}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-3 lg:grid-cols-[1.8fr_1fr]">
                      <div className="grid grid-cols-6 gap-1">
                        {competitor.sales_trend.map((point) => (
                          <div key={point.month} className="space-y-1 text-center">
                            <div className="mx-auto flex h-12 w-4 items-end rounded bg-slate-100">
                              <div
                                className="w-full rounded bg-[#2c61d6]"
                                style={{ height: `${Math.max(10, (point.sales_amount / maxSales) * 100)}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-slate-500">{point.month.slice(5)}</p>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-lg bg-[#f6f9ff] px-3 py-2">
                        <p className="text-[11px] font-semibold text-slate-700">오픈업 결제건(상위 연령)</p>
                        <p className="mt-1 text-xs text-slate-600">{ageTop?.age_group ?? "-"} · 총 {ageTotal.toLocaleString()}건</p>
                        <p className="text-xs text-slate-500">
                          남 {ageTop?.male_payment_count.toLocaleString() ?? 0}건 / 여 {ageTop?.female_payment_count.toLocaleString() ?? 0}건
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="rounded-2xl border border-[#e5ecfa] bg-[#fbfdff] p-4">
            <p className="text-sm font-semibold text-slate-900">데이터 출처</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.data_sources.map((source) => (
                <span key={source} className="rounded-full bg-[#edf3ff] px-3 py-1 text-xs text-[#214faf]">
                  {source}
                </span>
              ))}
            </div>
          </article>
        </div>
      ) : null}
    </section>
  );
}
