import type { CoachingTip } from "@/features/admin/hq-coaching/types/hq-coaching";

type Props = {
  coachingTips: CoachingTip[];
};

export function HQCoachingTipsSection({ coachingTips }: Props) {
  return (
    <section className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <p className="text-base font-semibold text-slate-900">본사 코칭 포인트</p>
      <p className="mt-1 text-sm text-slate-400">AI가 감지한 주의 매장 · 오늘 기준</p>
      <div className="mt-5 space-y-3">
        {coachingTips.length === 0 ? (
          <p className="text-sm text-slate-400">코칭 포인트가 없어요.</p>
        ) : (
          coachingTips.map((tip) => (
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
          ))
        )}
      </div>
    </section>
  );
}
