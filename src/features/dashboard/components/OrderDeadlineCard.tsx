import { RotateCw } from "lucide-react";
import { DashboardAlertCard } from "@/features/dashboard/components/DashboardAlertCard";

export const OrderDeadlineCard = () => {
  return (
    <DashboardAlertCard actionLabel="발주 자세히 보기">
      <>
        <div className="flex gap-[12px] items-center">
          <span className="text-md font-bold text-[#0F172B]">발주 마감</span>
          <span className="text-md text-[#314158]">현재 시간: 18:54</span>
        </div>
        <div className="flex items-center gap-[8px]">
          <div className="text-[24px] text-orange-500 font-semibold flex gap-[8px] items-center">
            <span>19:00</span>
            <span>•</span>
            <span>6분 남음</span>
          </div>
          <button>
            <RotateCw />
          </button>
        </div>
      </>
    </DashboardAlertCard>
  );
};
