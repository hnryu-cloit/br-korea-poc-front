import { DashboardAlertCard } from "@/features/dashboard/components/DashboardAlertCard";
import type { Product } from "./DashboardAlertSummary";

interface Props {
  products: Product[];
}

export const LowStockProductCard = ({ products }: Props) => {
  return (
    <DashboardAlertCard actionLabel="상품 자세히 보기">
      <>
        <span className="text-md font-bold text-[#0F172B]">품절 임박 상품</span>
        <div className="flex min-w-0 w-full items-center gap-[8px] overflow-hidden">
          <span className="shrink-0 text-[24px] font-semibold text-orange-500">
            {products.length}개
          </span>
          <div className="min-w-0 flex-1 overflow-x-auto">
            <div className="inline-flex min-w-max items-center gap-[6px] pr-2">
              {products.map((el, index) => (
                <Item key={el.name} product={el} hasDivider={index < products.length - 1} />
              ))}
            </div>
          </div>
        </div>
      </>
    </DashboardAlertCard>
  );
};

interface ItemsProps {
  product: Product;
  hasDivider: boolean;
}

const Item = ({ product, hasDivider }: ItemsProps) => {
  return (
    <div
      className={`flex shrink-0 items-center gap-[4px] pr-[6px] ${
        hasDivider ? "border-r border-[#DADADA]" : ""
      }`}
    >
      <span
        className="block max-w-[120px] truncate text-[16px] text-[#653819]"
        title={product.name}
      >
        {product.name}
      </span>
      <span className="shrink-0 text-[18px] font-bold text-brown-700">{product.count}개</span>
    </div>
  );
};
