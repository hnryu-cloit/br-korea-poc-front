import { Link } from "react-router-dom";

import type { DashboardAlertCardProps } from "@/features/dashboard/types/summary-card";

export function DashboardAlertCard({ children, actionLabel, actionPath }: DashboardAlertCardProps) {
  return (
    <div className="flex min-w-0 w-full flex-col items-start gap-[16px] rounded-[6px] border border-[#FFD9C7] border-t-[4px] bg-white p-[24px]">
      <div className="flex min-w-0 w-full flex-col gap-[12px]">{children}</div>
      <Link
        to={actionPath}
        className="h-[40px] w-[200px] rounded-[4px] bg-[linear-gradient(135deg,#FF6E00_0%,#DA1884_100%)] text-sm font-bold text-white"
      >
        <span className="flex h-full items-center justify-center">{actionLabel}</span>
      </Link>
    </div>
  );
}
