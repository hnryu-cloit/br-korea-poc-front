import { useState } from "react";
import { RotateCw } from "lucide-react";
import { DashboardAlertCard } from "@/features/dashboard/components/DashboardAlertCard";
import type { DashboardOrderDeadline } from "@/features/dashboard/types/dashboard";
import { formatOrderDeadlineDisplay } from "@/features/dashboard/utils/dashboard-alerts";

export function OrderDeadlineCard({ orderDeadline }: { orderDeadline: DashboardOrderDeadline | null }) {
  const [now, setNow] = useState(() => new Date());
  const display = formatOrderDeadlineDisplay(orderDeadline, now);

  if (!display) {
    return (
      <DashboardAlertCard actionLabel="발주 자세히 보기" actionPath="/ordering">
        <>
          <div className="flex gap-[12px] items-center">
            <span className="text-md font-bold text-[#0F172B]">발주 마감</span>
          </div>
          <p className="text-sm text-[#314158]">발주 마감 데이터가 없습니다.</p>
        </>
      </DashboardAlertCard>
    );
  }

  return (
    <DashboardAlertCard actionLabel="발주 자세히 보기" actionPath={display.cta_path}>
      <>
        <div className="flex gap-[12px] items-center">
          <span className="text-md font-bold text-[#0F172B]">발주 마감</span>
          <span className="text-md text-[#314158]">현재 시간: {display.currentTimeLabel}</span>
        </div>
        <div className="flex items-center gap-[8px]">
          <div className="text-[24px] text-orange-500 font-semibold flex gap-[8px] items-center">
            <span>{display.deadlineTimeLabel}</span>
            <span>•</span>
            <span>{display.remainingTimeLabel}</span>
          </div>
          <button type="button" onClick={() => setNow(new Date())}>
            <RotateCw />
          </button>
        </div>
      </>
    </DashboardAlertCard>
  );
}
