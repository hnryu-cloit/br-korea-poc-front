import { Clock, MessageCircle } from "lucide-react";

import { PageHero } from "@/commons/components/page/page-layout";
import dayjs from "dayjs";

export function ProductionHero({
  updatedAt,
  showChat,
  onToggleChat,
}: {
  updatedAt?: string;
  showChat: boolean;
  onToggleChat: () => void;
}) {
  return (
    <PageHero
      title="생산관리"
      description="5분 단위 자동 갱신 재고와 1시간 후 예측, 4주 평균 생산 패턴을 기준으로 생산 필요 시점을 자동 감지합니다."
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#eef4ff] px-4 py-2 text-sm font-semibold text-[#2454C8]">
          <Clock className="h-4 w-4" />
          마지막 업데이트 {dayjs(updatedAt).format("YYYY-MM-DD HH:mm") ?? "-"}
        </div>
        <button
          type="button"
          onClick={onToggleChat}
          className="inline-flex items-center gap-2 rounded-full border border-[#dce4f3] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-[#bfd1ed] hover:text-[#2454C8]"
        >
          <MessageCircle className="h-4 w-4" />
          {showChat ? "AI 질문 닫기" : "AI 질문하기"}
        </button>
      </div>
    </PageHero>
  );
}
