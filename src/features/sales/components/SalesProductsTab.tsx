import type { SalesProductDataItem } from "@/features/sales/types/sales-screen";
import { formatWon } from "@/features/sales/utils/format";

export function SalesProductsTab({
  products,
}: {
  products: SalesProductDataItem[];
}) {
  return (
    <div className="space-y-5">
      <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-sm">
        <p className="text-lg font-bold text-slate-900">상품별 판매 및 순이익</p>
        <div className="mt-4 space-y-3">
          {products.map((product) => (
            <div key={product.name} className="rounded-2xl bg-[#f8fbff] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900">{product.name}</p>
                  <p className="mt-1 text-sm text-slate-500">매출 {formatWon(product.sales)} · 순이익 {formatWon(product.profit)}</p>
                </div>
                <div className={`rounded-full px-3 py-1 text-xs font-bold ${product.profitRate >= 18.5 ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}>
                  {product.profitRate}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
