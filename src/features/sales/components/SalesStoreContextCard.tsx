import { Store } from "lucide-react";

export function SalesStoreContextCard({ storeName }: { storeName: string }) {
  return (
    <section className="rounded-[24px] border border-[rgba(109,77,180,0.18)] bg-[rgba(250,246,255,0.92)] px-5 py-4 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
      <div className="flex items-start gap-3">
        <Store className="mt-0.5 h-5 w-5 shrink-0 text-[#6d4db4]" />
        <div>
          <p className="text-base font-bold text-[#6d4db4]">{storeName} 맞춤 분석</p>
          <p className="mt-1 text-sm text-slate-600">
            최근 4주 운영 패턴, 상권 특성, 고객 선호도를 반영한 매장 맞춤형 답변을 제공합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
