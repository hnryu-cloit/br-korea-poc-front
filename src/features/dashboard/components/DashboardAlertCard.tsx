import type { ReactNode } from "react";

export function DashboardAlertCard({
  children,
  actionLabel,
}: {
  children: ReactNode;
  actionLabel: string;
}) {
  return (
    <div className="flex min-w-0 w-full flex-col items-start gap-[16px] rounded-[6px] border border-[#FFD9C7] border-t-[4px] bg-white p-[24px]">
      <div className="flex min-w-0 w-full flex-col gap-[12px]">{children}</div>
      <button
        type="button"
        className="h-[40px] w-[200px] rounded-[4px] bg-[linear-gradient(135deg,#FF6E00_0%,#DA1884_100%)] text-sm font-bold text-white"
      >
        {actionLabel}
      </button>
    </div>
  );
}
