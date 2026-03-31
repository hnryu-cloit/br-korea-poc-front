import { PageHero } from "./shared";

type StoreOrder = {
  store: string;
  region: string;
  option: string;
  basis: string;
  reason: string;
  submittedAt: string;
  status: "normal" | "review" | "risk";
};

const storeOrders: StoreOrder[] = [
  { store: "강남 1호점", region: "강남구", option: "옵션 A", basis: "전주 동요일", reason: "캠페인 영향 감안", submittedAt: "13:42", status: "normal" },
  { store: "서초 2호점", region: "서초구", option: "옵션 C", basis: "전월 동요일", reason: "시즌 수요 반영", submittedAt: "13:55", status: "review" },
  { store: "마포 3호점", region: "마포구", option: "옵션 B", basis: "전전주 동요일", reason: "과주문 방지", submittedAt: "14:01", status: "normal" },
  { store: "송파 4호점", region: "송파구", option: "-", basis: "-", reason: "-", submittedAt: "-", status: "risk" },
  { store: "용산 5호점", region: "용산구", option: "옵션 A", basis: "전주 동요일", reason: "무난한 선택", submittedAt: "13:38", status: "normal" },
];

const statusConfig = {
  normal: { label: "정상", className: "bg-green-50 text-green-600 border border-green-100" },
  review: { label: "검토 필요", className: "bg-orange-50 text-orange-600 border border-orange-100" },
  risk: { label: "미완료", className: "bg-red-50 text-red-600 border border-red-100" },
};

const coachingTips = [
  { store: "서초 2호점", tip: "전월 동요일 선택 시 배달 회복분 보정 필요. 실제 주문은 -12% 적게 반영됩니다." },
  { store: "송파 4호점", tip: "주문 마감까지 5분 남음. 점주에게 긴급 알림 발송 필요." },
];

export function SVCoachingPage() {
  const normalCount = storeOrders.filter((s) => s.status === "normal").length;
  const reviewCount = storeOrders.filter((s) => s.status === "review").length;
  const riskCount = storeOrders.filter((s) => s.status === "risk").length;

  return (
    <div className="space-y-6">
      <PageHero
        title="담당 매장 주문 현황을 확인합니다."
        description="미완료 매장을 빠르게 파악하고 코칭 포인트를 제공합니다."
      />

      {/* Summary row */}
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "정상 완료", value: `${normalCount}개`, className: "bg-green-50 text-green-600 border border-green-100" },
          { label: "검토 필요", value: `${reviewCount}개`, className: "bg-orange-50 text-orange-600 border border-orange-100" },
          { label: "미완료", value: `${riskCount}개`, className: "bg-red-50 text-red-600 border border-red-100" },
        ].map((item) => (
          <article key={item.label} className="rounded-[26px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
            <div className={`mt-4 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${item.className}`}>{item.value}</div>
          </article>
        ))}
      </section>

      {/* Store orders table */}
      <section className="rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)] overflow-hidden">
        <div className="border-b border-border/60 px-6 py-5">
          <p className="text-base font-semibold text-slate-900">매장별 주문 현황</p>
          <p className="text-xs text-slate-400 mt-0.5">오늘 주문 마감 기준</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-[#f8fbff]">
                <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">매장</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">선택 옵션</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">기준</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">점주 사유</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">등록 시각</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">상태</th>
              </tr>
            </thead>
            <tbody>
              {storeOrders.map((store) => {
                const cfg = statusConfig[store.status];
                return (
                  <tr key={store.store} className={`border-b border-border/30 last:border-0 ${store.status === "risk" ? "bg-red-50/30" : "hover:bg-[#f8fbff]"}`}>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{store.store}</p>
                      <p className="text-xs text-slate-400">{store.region}</p>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-700">{store.option}</td>
                    <td className="px-4 py-4 text-slate-500">{store.basis}</td>
                    <td className="px-4 py-4 text-slate-500">{store.reason}</td>
                    <td className="px-4 py-4 text-center text-slate-500">{store.submittedAt}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.className}`}>
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Coaching tips */}
      <section className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <p className="text-base font-semibold text-slate-900">SV 코칭 포인트</p>
        <p className="mt-1 text-sm text-slate-400">AI가 감지한 주의 매장 · 오늘 기준</p>
        <div className="mt-5 space-y-3">
          {coachingTips.map((tip) => (
            <div key={tip.store} className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3">
              <p className="text-sm font-semibold text-orange-800">{tip.store}</p>
              <p className="mt-1 text-sm text-orange-700 leading-6">{tip.tip}</p>
              <button
                type="button"
                className="mt-2 rounded-xl bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-700 transition-colors hover:bg-orange-200"
              >
                알림 발송
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}