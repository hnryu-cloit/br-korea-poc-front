export function DomainChat({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="absolute right-0 top-12 z-20 w-72 rounded-[24px] border border-[#dbe6fb] bg-white p-4 shadow-[0_20px_40px_rgba(16,32,51,0.14)]">
      <p className="text-sm font-bold text-slate-900">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">현재 카드 문맥에 맞는 질문만 우선 제안합니다.</p>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className="w-full rounded-2xl border border-[#dce4f3] bg-[#f7faff] px-3 py-2 text-left text-xs font-medium text-slate-600 transition-colors hover:bg-[#eef4ff] hover:text-[#2454C8]"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
