import { costBreakdownRows, costRatioRows } from "@/features/sales/constants/sales-breakdown";

export function SalesBreakdownTab() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-sm">
        <p className="text-lg font-bold text-slate-900">비용 구성</p>
        <div className="mt-4 space-y-3">
          {costBreakdownRows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-4 py-4">
              <span className="font-semibold text-slate-700">{label}</span>
              <span className="font-bold text-red-600">{value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-border/60 pt-4 text-base font-bold text-slate-900">
            <span>총 비용</span>
            <span className="text-red-600">1,508,000원</span>
          </div>
        </div>
      </article>

      <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-sm">
        <p className="text-lg font-bold text-slate-900">비용 비율</p>
        <div className="mt-4 space-y-4">
          {costRatioRows.map(([label, value, bar]) => (
            <div key={label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className={label === "순이익률" ? "font-bold text-slate-900" : "text-slate-600"}>{label}</span>
                <span className={label === "순이익률" ? "font-bold text-green-600" : "font-semibold text-slate-700"}>{value}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className={`h-2 rounded-full ${bar}`} style={{ width: value }} />
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
