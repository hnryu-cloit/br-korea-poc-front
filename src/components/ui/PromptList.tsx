import type { PromptCard } from "@/data/page-content";

export function PromptList({ prompts }: { prompts: PromptCard[] }) {
  return (
    <section className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <p className="text-lg font-semibold text-slate-900">추천 질문 세트</p>
      <div className="mt-5 space-y-3">
        {prompts.map((prompt) => (
          <div key={prompt.label} className="rounded-2xl border border-[#dbe6fb] bg-[#f8fbff] px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{prompt.label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{prompt.prompt}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
