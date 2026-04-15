import { SquareArrowOutUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function SummaryCard({
  icon,
  title,
  description,
  children,
  to,
  cta,
}: {
  icon: ReactNode;
  title: string;
  description: string;
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
        <Link
          to={to}
          aria-label={cta}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#dce4f3] bg-[#f7faff] text-slate-600 transition-colors hover:border-[#bfd1ed] hover:bg-[#eef4ff] hover:text-[#2454C8]"
        >
          <SquareArrowOutUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-5 space-y-5">{children}</div>
    </article>
  );
}
