import { MessageCircle } from "lucide-react";

import { PageHero } from "@/commons/components/page/page-layout";
import dayjs from "dayjs";

export function ProductionHero({
  updatedAt,
  showChat,
  onToggleChat,
  title,
  description,
}: {
  updatedAt?: string;
  showChat: boolean;
  onToggleChat: () => void;
  title: string;
  description: string;
}) {
  const formattedUpdatedAt = updatedAt ? dayjs(updatedAt).format("YYYY-MM-DD HH:mm") : undefined;

  return (
    <PageHero
      title={title}
      description={description}
      updatedAt={formattedUpdatedAt}
    >
      <div className="flex flex-wrap items-center gap-3">
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
