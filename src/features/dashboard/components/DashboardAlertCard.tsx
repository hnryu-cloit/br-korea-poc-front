import { Link } from "react-router-dom";

import type { DashboardAlertCardProps } from "@/features/dashboard/types/summary-card";

export function DashboardAlertCard({ children, actionLabel, actionPath }: DashboardAlertCardProps) {
  return (
    <div className="overflow-hidden rounded-[6px]">
      <div className="h-[4px] bg-[#FFD9C7]" />
      <div className="flex min-w-0 w-full flex-col items-start gap-[16px] rounded-b-[6px] border border-t-0 border-[#FFD9C7] bg-white p-[24px]">
        <div className="flex min-w-0 w-full flex-col gap-[12px]">{children}</div>
        <Link
          to={actionPath}
          className="h-[40px] w-[200px] rounded-[4px] bg-[linear-gradient(135deg,#FF6E00_0%,#DA1884_100%)] text-sm font-bold text-white transition-colors hover:bg-[#E55A12]"
        >
          <span className="flex h-full items-center justify-center">{actionLabel}</span>
        </Link>
      </div>
    </div>
  );
}
