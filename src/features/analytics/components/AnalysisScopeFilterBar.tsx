import { useMemo } from "react";

export type AnalysisScope = {
  gu: string;
  dong: string;
  industry: string;
  year: string;
  quarter: string;
  radiusMeters: number;
};

type Props = {
  value: AnalysisScope;
  onChange: (next: AnalysisScope) => void;
  className?: string;
};

const guOptions = ["전체", "강남구", "광진구", "마포구", "송파구", "영등포구"];
const dongOptionsByGu: Record<string, string[]> = {
  전체: ["전체", "역세권", "주거밀집권"],
  강남구: ["전체", "역삼동", "삼성동", "신사동"],
  광진구: ["전체", "구의동", "화양동", "자양동"],
  마포구: ["전체", "서교동", "합정동", "연남동"],
  송파구: ["전체", "잠실동", "가락동", "문정동"],
  영등포구: ["전체", "여의도동", "문래동", "당산동"],
};
const industryOptions = ["전체", "제과", "커피", "한식", "패스트푸드"];
const yearOptions = ["2026", "2025", "2024"];
const quarterOptions = ["Q1", "Q2", "Q3", "Q4"];
const quickRadius = [500, 750, 1000, 2000];

export function AnalysisScopeFilterBar({ value, onChange, className }: Props) {
  const dongOptions = useMemo(
    () => dongOptionsByGu[value.gu] ?? dongOptionsByGu["전체"],
    [value.gu],
  );

  const setField = <K extends keyof AnalysisScope>(key: K, next: AnalysisScope[K]) => {
    onChange({ ...value, [key]: next });
  };

  return (
    <section
      className={`rounded-2xl border border-border bg-white px-4 py-4 shadow-sm ${className ?? ""}`}
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <label className="space-y-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-600">구</span>
          <select
            value={value.gu}
            onChange={(event) => {
              const nextGu = event.target.value;
              const nextDongOptions = dongOptionsByGu[nextGu] ?? dongOptionsByGu["전체"];
              onChange({ ...value, gu: nextGu, dong: nextDongOptions[0] });
            }}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-700"
          >
            {guOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-600">동</span>
          <select
            value={value.dong}
            onChange={(event) => setField("dong", event.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-700"
          >
            {dongOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-600">업종</span>
          <select
            value={value.industry}
            onChange={(event) => setField("industry", event.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-700"
          >
            {industryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-600">연도</span>
          <select
            value={value.year}
            onChange={(event) => setField("year", event.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-700"
          >
            {yearOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-600">분기</span>
          <select
            value={value.quarter}
            onChange={(event) => setField("quarter", event.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-700"
          >
            {quarterOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-600">반경</span>
          <div className="flex h-9 items-center rounded-lg border border-slate-200 px-2 text-sm text-slate-700">
            {value.radiusMeters.toLocaleString()}m
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {quickRadius.map((radius) => (
          <button
            key={radius}
            type="button"
            onClick={() => setField("radiusMeters", radius)}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              value.radiusMeters === radius
                ? "bg-[#2454C8] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {radius}m
          </button>
        ))}
        <input
          type="range"
          min={100}
          max={3000}
          step={50}
          value={value.radiusMeters}
          onChange={(event) => setField("radiusMeters", Number(event.target.value))}
          className="ml-1 h-2 w-full max-w-xs cursor-pointer rounded-lg accent-[#2454C8]"
          aria-label="분석 반경"
        />
      </div>
    </section>
  );
}