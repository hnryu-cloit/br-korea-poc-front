import { SquareArrowOutUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import type { DashboardDomain } from "@/features/dashboard/types/dashboard";

const domainAccentClassMap: Record<DashboardDomain, string> = {
  production: "bg-[#eff5ff] text-[#2454C8]",
  ordering: "bg-[#eefaf4] text-[#0f766e]",
  sales: "bg-[#fff6ee] text-[#c2410c]",
};

export function SummaryCard({
  domain,
  icon,
  title,
  description,
  statusLabel,
  deadlineMinutes,
  deliveryScheduled,
  children,
  to,
  cta,
}: {
  domain: DashboardDomain;
  icon: ReactNode;
  title: string;
  description: string;
  statusLabel?: string;
  deadlineMinutes?: number;
  deliveryScheduled?: boolean;
  children: ReactNode;
  to: string;
  cta: string;
}) {
  const statusItems = [
    statusLabel,
    typeof deadlineMinutes === "number" ? `마감 ${deadlineMinutes}분` : undefined,
    typeof deliveryScheduled === "boolean"
      ? deliveryScheduled
        ? "배송 예약 완료"
        : "배송 예약 미완료"
      : undefined,
  ].filter(Boolean) as string[];

  return (
    <article className="relative rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
            {icon}
            {title}
          </div>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
          {statusItems.length > 0 ? (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {statusItems.map((item) => (
                <span
                  key={item}
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${domainAccentClassMap[domain]}`}
                >
                  {item}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <Link
          to={to}
          aria-label={cta}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#dce4f3] bg-[#f7faff] text-slate-600 transition-colors hover:border-[#bfd1ed] hover:bg-[#eef4ff] hover:text-[#2454C8]"
        >
          <SquareArrowOutUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-5 space-y-5">{children}</div>
    </article>
  );
}
