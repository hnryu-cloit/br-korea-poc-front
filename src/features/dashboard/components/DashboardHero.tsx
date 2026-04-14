import { PageHero } from "@/commons/components/page/page-layout";
import { Clock } from "lucide-react";

export function DashboardHero({ updatedAt }: { updatedAt?: string }) {
  return (
    <PageHero
      title="오늘의 운영 현황"
      description="오늘 진행 상황 요약, 주요 변경 알림, 손익 인사이트를 한 화면에서 확인해보세요."
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-[#eef4ff] text-sm font-semibold text-[#2454C8]">
        <Clock className="h-4 w-4" />
        마지막 업데이트 {updatedAt ?? "-"}
      </div>
    </PageHero>
  );
}
