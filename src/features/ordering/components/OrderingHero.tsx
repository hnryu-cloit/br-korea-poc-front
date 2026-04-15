import { Clock, MessageCircle } from "lucide-react";

import { PageHero } from "@/commons/components/page/page-layout";

export function OrderingHero({
  timeText,
  showChat,
  onToggleChat,
}: {
  timeText: string;
  showChat: boolean;
  onToggleChat: () => void;
}) {
  return (
    <PageHero
      title="주문관리"
      description="주문 누락 방지를 목적으로 추천 3안을 비교합니다. 예측과 권고는 최소 범위로 제공하며 최종 의사결정은 점주가 수행합니다."
    >
      <div className="flex flex-wrap items-center gap-3">
        {/* <div className="inline-flex items-center gap-2 rounded-full bg-[#eef4ff] px-4 py-2 text-sm font-semibold text-[#2454C8]">
          <Clock className="h-4 w-4" />
          주문 마감까지 {timeText}
        </div> */}
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
