import type { SalesProductDataItem } from "@/features/sales/types/sales-screen";
import { formatWon } from "@/features/sales/utils/format";

export function SalesProductsTab({ products }: { products: SalesProductDataItem[] }) {
  return (
    <div className="space-y-5">
      <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-sm">
        <p className="text-lg font-bold text-slate-900">상품별 매출 순위</p>
        <div className="mt-4 space-y-3">
          {products.map((product, index) => (
            <div key={product.name} className="rounded-2xl bg-[#f8fbff] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900">{product.name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    매출 {formatWon(product.sales)} · 판매{" "}
                    {Math.round(product.qty).toLocaleString()}개
                  </p>
                </div>
                <div className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-bold text-[#2454C8]">
                  {index + 1}위
                </div>
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
