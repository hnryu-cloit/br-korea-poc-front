import dayjs from "dayjs";
import "dayjs/locale/ko";

import type { ActiveCampaignItem, OrderingWeather } from "@/features/ordering/types/ordering";

dayjs.locale("ko");

interface Props {
  weather?: OrderingWeather | null;
  businessDate?: string | null;
  campaigns: ActiveCampaignItem[];
  referenceDate: string;
  onChangeReferenceDate: (value: string) => void;
  isCampaignsLoading?: boolean;
}

function formatWeather(weather?: OrderingWeather | null) {
  if (!weather) return "-";

  const maxTemperature =
    weather.max_temperature_c === null || weather.max_temperature_c === undefined
      ? "-"
      : `${weather.max_temperature_c}도`;
  const minTemperature =
    weather.min_temperature_c === null || weather.min_temperature_c === undefined
      ? "-"
      : `${weather.min_temperature_c}도`;
  const precipitationProbability =
    weather.precipitation_probability === null || weather.precipitation_probability === undefined
      ? "-"
      : `${weather.precipitation_probability}%`;

  return `${weather.region} · ${weather.weather_type}, 최고 ${maxTemperature} · 최저 ${minTemperature}, 강수확률 ${precipitationProbability}`;
}

function formatBusinessDate(businessDate?: string | null) {
  if (!businessDate) return "-";
  return dayjs(businessDate).format("YYYY년 M월 D일 dddd");
}

function formatCampaignPeriod(item: ActiveCampaignItem) {
  const start = dayjs(item.start_date).format("MM.DD");
  const end = dayjs(item.end_date).format("MM.DD");
  return `${start} ~ ${end}`;
}

export function OrderingContextCards({
  weather,
  businessDate,
  campaigns,
  referenceDate,
  onChangeReferenceDate,
  isCampaignsLoading = false,
}: Props) {
  const visibleCampaigns = campaigns.slice(0, 3);

  return (
    <section className="grid gap-4 lg:grid-cols-[320fr_578fr_336fr]">
      <article className="flex min-w-0 w-full flex flex-col gap-3 rounded-[6px] border border-[#FFD9C7] border-t-[4px] bg-white p-[24px]">
        <p className="text-md font-bold text-[#0F172B]">오늘</p>
        <p className="font-medium text-lg text-brown-700">{formatBusinessDate(businessDate)}</p>
      </article>
      <article className="flex min-w-0 w-full flex flex-col gap-3 rounded-[6px] border border-[#FFD9C7] border-t-[4px] bg-white p-[24px]">
        <p className="text-md font-bold text-[#0F172B]">날씨</p>
        <p className="font-medium text-lg text-brown-700">{formatWeather(weather)}</p>
      </article>
      <article className="flex min-w-0 w-full flex flex-col gap-2 rounded-[6px] border border-[#FFD9C7] border-t-[4px] bg-white p-[24px]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-md font-bold text-[#0F172B]">캠페인</p>
          <input
            type="date"
            value={referenceDate}
            onChange={(event) => onChangeReferenceDate(event.target.value)}
            className="rounded-md border border-[#FFD9C7] bg-white px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#FF7A4D]"
            aria-label="캠페인 기준일자"
          />
        </div>
        {isCampaignsLoading ? (
          <ul className="space-y-1">
            <li className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
            <li className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
            <li className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
          </ul>
        ) : visibleCampaigns.length === 0 ? (
          <p className="text-sm text-slate-500">진행 중인 캠페인 없음</p>
        ) : (
          <ul className="space-y-1">
            {visibleCampaigns.map((item) => (
              <li
                key={item.code}
                className="flex items-baseline gap-2 text-sm text-brown-700"
                title={`${item.name} (${formatCampaignPeriod(item)})`}
              >
                <span className="text-[#FF7A4D]">•</span>
                <span className="truncate font-medium">{item.name}</span>
                <span className="ml-auto shrink-0 text-xs text-slate-400">
                  {formatCampaignPeriod(item)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
}
