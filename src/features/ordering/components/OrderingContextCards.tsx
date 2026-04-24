import type { OrderingWeather } from "@/features/ordering/types/ordering";
import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");

interface Props {
  weather?: OrderingWeather | null;
  trend?: string;
  businessDate?: string | null;
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

export function OrderingContextCards({ weather, trend, businessDate }: Props) {
  return (
    <section className="grid gap-4 lg:grid-cols-[320fr_578fr_336fr]">
      <article className="flex min-w-0 w-full flex flex-col gap-3 rounded-[6px] border border-[#FFD9C7] border-t-[4px] bg-white p-[24px]">
        <p className="text-md font-bold text-[#0F172B]">오늘</p>
        <p className="font-medium text-lg text-brown-700">
          {formatBusinessDate(businessDate)}
        </p>
      </article>
      <article className="flex min-w-0 w-full flex flex-col gap-3 rounded-[6px] border border-[#FFD9C7] border-t-[4px] bg-white p-[24px]">
        <p className="text-md font-bold text-[#0F172B]">날씨</p>
        <p className="font-medium text-lg text-brown-700">{formatWeather(weather)}</p>
      </article>
      <article className="flex min-w-0 w-full flex flex-col gap-3 rounded-[6px] border border-[#FFD9C7] border-t-[4px] bg-white p-[24px]">
        <p className="text-md font-bold text-[#0F172B]">최근 트렌드</p>
        <p className="font-bold text-green-600">{trend ?? "--"}</p>
      </article>
    </section>
  );
}
