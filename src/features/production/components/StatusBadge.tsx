import type { ProductionStatus } from "@/features/production/types/production";

const badgeClasses: Record<ProductionStatus, string> = {
  danger: "border-[#DA1884] text-[#DA1884]",
  warning: "border-[#FF671F] text-[#FF671F]",
  safe: "border-[#00BBA7] text-[#00BBA7]",
};

const badgeLabels: Record<ProductionStatus, string> = {
  danger: "위험",
  warning: "주의",
  safe: "안전",
};

export function StatusBadge({ status }: { status: ProductionStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-sm font-bold bg-white border ${badgeClasses[status]}`}
    >
      {badgeLabels[status]}
    </span>
  );
}
