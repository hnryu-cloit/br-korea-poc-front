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
    <section>
      <button
        type="button"
        onClick={onConfirm}
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-[#2454C8] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1d44a8] disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isSubmitting ? "확정 중..." : "최종 확정"}
      </button>

      <p className="mt-1 text-sm text-slate-500">
        추천안은 참고 자료입니다. 품목과 수량을 충분히 확인한 뒤 확정해 주세요. 주문 확정 후에는
        수정할 수 없습니다.
      </p>

      {errorMessage ? (
        <p className="mt-3 text-sm font-medium text-red-600">{errorMessage}</p>
      ) : null}
    </section>
  );
}
