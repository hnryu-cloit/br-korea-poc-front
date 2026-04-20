import { Bot } from "lucide-react";

export const FloatingAiChatButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,#1f4dbb_0%,#55a0ff_100%)] px-5 py-4 text-white shadow-[0_18px_38px_rgba(31,77,187,0.32)] transition-transform hover:-translate-y-0.5"
  >
    <Bot className="h-5 w-5" />
    <span className="text-sm font-semibold">도움말</span>
  </button>
);
