import { MessageCircle, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { DomainChat } from "@/features/dashboard/components/DomainChat";

export function SummaryCard({
  icon,
  title,
  description,
  chatItems,
  activeChat,
  onToggleChat,
  children,
  to,
  cta,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  chatItems: string[];
  activeChat: boolean;
  onToggleChat: () => void;
  children: ReactNode;
  to: string;
  cta: string;
}) {
  return (
    <article className="relative rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
            {icon}
            {title}
          </div>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <button
          type="button"
          onClick={onToggleChat}
          className="rounded-2xl border border-[#dce4f3] bg-[#f7faff] p-2 text-slate-500 transition-colors hover:border-[#bfd1ed] hover:text-[#2454C8]"
          aria-label={`${title} 질문 열기`}
        >
          <MessageCircle className="h-4 w-4" />
        </button>
      </div>

      {activeChat ? <DomainChat title={`${title} AI 질문`} items={chatItems} /> : null}

      <div className="mt-5 space-y-4">{children}</div>

      <Link
        to={to}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#dce4f3] bg-[#f7faff] px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-[#bfd1ed] hover:bg-[#eef4ff] hover:text-[#2454C8]"
      >
        {cta}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
