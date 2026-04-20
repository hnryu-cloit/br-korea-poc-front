export function OrderingConfirmSection({
  onConfirm,
  isSubmitting = false,
  errorMessage,
}: {
  onConfirm: () => void | Promise<void>;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}) {
  return (
    <section className="rounded-[28px] border border-[#dbe6fb] bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <p className="text-lg font-bold text-slate-900">점주 최종 확정</p>
      <p className="mt-1 text-sm text-slate-500">추천안은 참고 자료입니다. 주문 확정 후에는 수정할 수 없으니, 점주가 직접 검토하고 최종 확정합니다.</p>

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
