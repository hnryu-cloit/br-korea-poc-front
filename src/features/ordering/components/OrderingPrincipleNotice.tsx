import { Info } from "lucide-react";

interface Props {
  purpose?: string;
  caution?: string;
}

export function OrderingPrincipleNotice({ purpose, caution }: Props) {
  return (
    <section className="rounded-[24px] border border-[#dbe6fb] bg-[#edf4ff] px-5 py-4 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
      <div className="flex items-start gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#2454C8]" />
        <div>
          <p className="text-base font-bold text-[#2454C8]">{purpose ?? "주문 누락 방지 원칙"}</p>
          <p className="mt-1 text-sm text-slate-600">
            {caution ?? "AI 추천은 참고 자료입니다. 최종 주문 결정은 점주님께서 직접 하십니다."}
          </p>
        </div>
      </div>
    </section>
  );
}
