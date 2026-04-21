import dayjs from "dayjs";
import { Calendar, CloudRain, TrendingUp } from "lucide-react";
import type { OrderingWeather } from "@/features/ordering/types/ordering";
import "dayjs/locale/ko";
dayjs.locale("ko");

interface Props {
  weather?: OrderingWeather | null;
  trend?: string;
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

  return `${weather.region} ${weather.forecast_date} 예보 · ${weather.weather_type}, 최고 ${maxTemperature} / 최저 ${minTemperature}, 강수확률 ${precipitationProbability}`;
}

export function OrderingContextCards({ weather, trend }: Props) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
        <div className="flex items-center gap-3">
          <Calendar className="h-7 w-7 text-[#2454C8]" />
          <div>
            <p className="text-sm text-slate-500">오늘</p>
            <p className="font-bold text-slate-900">{dayjs().format("YYYY년 M월 D일 dddd")}</p>
          </div>
        </div>
      </article>
      <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
        <div className="flex items-center gap-3">
          <CloudRain className="h-7 w-7 text-slate-500" />
          <div>
            <p className="text-sm text-slate-500">날씨 예보</p>
            <p className="font-bold text-slate-900">{formatWeather(weather)}</p>
          </div>
        </div>
      </article>
      <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-7 w-7 text-green-600" />
          <div>
            <p className="text-sm text-slate-500">최근 트렌드</p>
            <p className="font-bold text-green-600">{trend ?? "-"}</p>
          </div>
        </div>
      </article>
    </section>
  );
}
