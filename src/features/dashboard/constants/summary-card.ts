import orderIcon from "@/assets/order.svg";
import productionIcon from "@/assets/production.svg";
import saleIcon from "@/assets/sale.svg";
import type { DashboardDomain } from "@/features/dashboard/types/dashboard";

export const SUMMARY_CARD_ICON_MAP: Record<DashboardDomain, string> = {
  production: productionIcon,
  ordering: orderIcon,
  sales: saleIcon,
};
