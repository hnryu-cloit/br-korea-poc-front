import { LowStockProductCard } from "@/features/dashboard/components/LowStockProductCard";
import { OrderDeadlineCard } from "@/features/dashboard/components/OrderDeadlineCard";
import type {
  DashboardLowStockProduct,
  DashboardOrderDeadline,
} from "@/features/dashboard/types/dashboard";

export function DashboardAlertSummary({
  lowStockProducts,
  orderDeadline,
}: {
  lowStockProducts: DashboardLowStockProduct[];
  orderDeadline: DashboardOrderDeadline | null;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-[16px]">
      <LowStockProductCard products={lowStockProducts} />
      <OrderDeadlineCard orderDeadline={orderDeadline} />
    </div>
  );
}
