export function SalesQuickQuestionsPanel({
  questions,
}: {
  questions: string[];
}) {
  return (
    <section className="rounded-[28px] border border-[#dbe6fb] bg-white px-6 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <p className="text-sm font-bold text-slate-900">손익 관련 빠른 질문</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {questions.map((item) => (
          <button
            key={item}
            type="button"
            className="rounded-full border border-[#dce4f3] bg-[#f7faff] px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-[#eef4ff] hover:text-[#2454C8]"
          >
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}
