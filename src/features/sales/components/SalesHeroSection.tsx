import { MessageCircle, Store } from "lucide-react";

import { PageHero } from "@/commons/components/page/page-layout";

export function SalesHeroSection({
  showChat,
  onToggleChat,
}: {
  showChat: boolean;
  onToggleChat: () => void;
}) {
  return (
    <PageHero
      title="손익분석"
      description="순이익을 기본으로 보여주고 손익분기점, 비용 구성, 상품별 수익성, 매장 맞춤형 AI 분석까지 연결합니다."
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#eef4ff] px-4 py-2 text-sm font-semibold text-[#2454C8]">
          <Store className="h-4 w-4" />
          강남점 맞춤 분석
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
