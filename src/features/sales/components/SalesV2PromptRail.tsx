export const SalesV2PromptRail = ({
  prompts,
  isLoading,
  sending,
  onSelectPrompt,
}: {
  prompts: { label: string; prompt: string }[];
  isLoading: boolean;
  sending: boolean;
  onSelectPrompt: (prompt: string) => void;
}) => (
  <aside className="rounded-[28px] border border-border bg-white p-4 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
    <p className="px-1 text-sm font-bold text-slate-800">추천 질문</p>
    <div className="mt-3 flex flex-col gap-2">
      {prompts.map((item) => (
        <button
          key={item.prompt}
          type="button"
          onClick={() => onSelectPrompt(item.prompt)}
          disabled={sending}
          className="rounded-2xl border border-[#dce4f3] bg-[#f7faff] px-3 py-2 text-left text-xs font-semibold text-slate-600 transition-colors hover:bg-[#eef4ff] hover:text-[#2454C8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {item.label}
        </button>
      ))}
      {isLoading ? <p className="px-1 py-2 text-xs text-slate-400">불러오는 중...</p> : null}
    </div>
  </aside>
);
