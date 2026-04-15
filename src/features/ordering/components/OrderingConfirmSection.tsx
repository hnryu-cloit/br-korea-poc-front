import { AlertCircle } from "lucide-react";

export function OrderingConfirmSection({
  reason,
  onChangeReason,
  onConfirm,
  isSubmitting = false,
  errorMessage,
}: {
  reason: string;
  onChangeReason: (value: string) => void;
  onConfirm: () => void | Promise<void>;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}) {
  return (
    <section className="rounded-[28px] border border-[#dbe6fb] bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <p className="text-lg font-bold text-slate-900">점주 최종 확정</p>
      <p className="mt-1 text-sm text-slate-500">추천안은 참고 자료입니다. 점주가 직접 검토하고 최종 확정합니다.</p>

      <div className="mt-5">
        <label className="text-sm font-semibold text-slate-700" htmlFor="order-reason">
          선택 사유
        </label>
        <textarea
          id="order-reason"
          value={reason}
          onChange={(event) => onChangeReason(event.target.value)}
          placeholder="이 주문안을 선택한 이유를 입력하세요..."
          className="mt-2 min-h-28 w-full rounded-[24px] border border-[#dce4f3] bg-[#f8fbff] px-4 py-4 text-sm text-slate-700 outline-none focus:border-[#2454C8]"
        />
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-[#f8fbff] px-4 py-4 text-sm text-slate-600">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
          주문 확정 후에는 수정할 수 없습니다. 점주가 직접 검토한 뒤 확정하세요.
        </div>
      </div>

      <button
        type="button"
        onClick={onConfirm}
        disabled={isSubmitting}
        className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-[#2454C8] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1d44a8] disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isSubmitting ? "확정 중..." : "점주가 직접 확정하기"}
      </button>
      {errorMessage ? (
        <p className="mt-3 text-sm font-medium text-red-600">{errorMessage}</p>
      ) : null}
    </section>
  );
}
