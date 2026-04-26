import ai_pencil from "@/assets/ai-pencil.svg";
import type { SalesCampaignEffectResponse } from "@/features/sales/types/sales";

type Props = {
  data?: SalesCampaignEffectResponse;
  isLoading?: boolean;
  errorMessage?: string;
};

export const SalesV2CampaignActivitySection = ({ data, isLoading, errorMessage }: Props) => {
  const title = data?.title ?? "활성 캠페인 효과";
  const summary = data?.summary ?? "캠페인 효과 데이터를 불러오는 중입니다.";
  const metrics = data?.metrics ?? [];
  const actions = data?.actions ?? [];

  return (
    <section className="rounded-[28px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)] flex flex-col gap-4">
      <header className="flex flex-col gap-2">
        <p className="text-md font-bold text-brown-700">{title}</p>
        <p className="text-sm leading-5 text-[#653819]">{summary}</p>
      </header>

      {errorMessage ? (
        <div className="rounded-[8px] bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {isLoading && metrics.length === 0 ? (
        <div className="rounded-[8px] bg-[#DADADA66] px-3 py-4 text-sm text-slate-500">
          캠페인 효과를 불러오는 중...
        </div>
      ) : null}

      {metrics.length > 0 ? (
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-[8px] bg-[#DADADA66] px-3 py-2 flex flex-col gap-1"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#653819]">{metric.label}</p>
                <p className="text-sm font-bold text-orange-500">{metric.value}</p>
              </div>
              {metric.detail ? (
                <p className="text-xs text-[#653819]">{metric.detail}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {actions.length > 0 ? (
        <div className="flex flex-col gap-2">
          {actions.slice(0, 3).map((action) => (
            <div
              key={action}
              className="flex items-center gap-2 border border-[#FFB38F] rounded-xl bg-[#FFD9C71A] px-3 py-2 text-sm font-medium text-[#41352E]"
            >
              <img src={ai_pencil} className="w-4 h-4" />
              {action}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
};
