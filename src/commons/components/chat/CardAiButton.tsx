import { Sparkles } from "lucide-react";

import { useFloatingAiChat } from "@/commons/hooks/useFloatingAiChat";
import type { FloatingAiCardContextKey } from "@/commons/types/floating-ai-chat";

export function CardAiButton({ contextKey }: { contextKey: FloatingAiCardContextKey }) {
  const { open } = useFloatingAiChat();

  return (
    <button
      type="button"
      onClick={() => open(contextKey)}
      className="inline-flex items-center gap-1.5 rounded-full border border-[#d8e5ff] bg-[#f7faff] px-3 py-1.5 text-xs font-medium text-[#2454C8] transition-colors hover:bg-[#eef4ff]"
    >
      <Sparkles className="h-3 w-3" />
      AI에게 물어보기
    </button>
  );
}
