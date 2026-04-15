import { Sparkles, X } from "lucide-react";

import type {
  FloatingAiChatMessage,
  FloatingAiChatRouteGuide,
} from "@/commons/types/floating-ai-chat";

export const FloatingAiChatPanel = ({
  guide,
  message,
  onClose,
  onRunAction,
}: {
  guide: FloatingAiChatRouteGuide;
  message: FloatingAiChatMessage;
  onClose: () => void;
  onRunAction: (prompt: string) => void;
}) => (
  <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[28px] border border-[#d8e5ff] bg-white shadow-[0_24px_60px_rgba(31,77,187,0.2)]">
    <div className="flex items-start justify-between gap-4 bg-[linear-gradient(135deg,#1f4dbb_0%,#55a0ff_100%)] px-5 py-5 text-white">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
          <Sparkles className="h-4 w-4" />
          AI 도우미
        </div>
        <p className="mt-3 text-lg font-semibold">{guide.title}</p>
        <p className="mt-2 text-sm leading-6 text-white/80">{guide.subtitle}</p>
      </div>
      <button type="button" onClick={onClose} aria-label="해설 닫기">
        <X className="h-4 w-4 text-white/80" />
      </button>
    </div>

    <div className="space-y-5 px-5 py-5">
      <div>
        <p className="text-xs font-semibold text-slate-400">바로 물어보기</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {guide.quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => onRunAction(action.prompt)}
              className="rounded-full border border-[#d8e5ff] bg-[#f7faff] px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-[#eef4ff]"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-[#f8fbff] px-4 py-4">
        <p className="text-sm font-semibold text-slate-900">{message.title}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{message.content}</p>
        <div className="mt-4 space-y-2">
          {message.evidence.map((item) => (
            <div key={item} className="rounded-2xl bg-white px-3 py-2 text-xs text-slate-500 shadow-sm">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
