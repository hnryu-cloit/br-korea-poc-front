import type { ProductionStatus } from "@/features/production/types/production";

const badgeClasses: Record<ProductionStatus, string> = {
  danger: "border border-red-200 bg-red-50 text-red-600",
  warning: "border border-orange-200 bg-orange-50 text-orange-600",
  safe: "border border-green-200 bg-green-50 text-green-600",
};

const badgeLabels: Record<ProductionStatus, string> = {
  danger: "위험",
  warning: "주의",
  safe: "안전",
};

export function StatusBadge({ status }: { status: ProductionStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${badgeClasses[status]}`}
    >
      {badgeLabels[status]}
    </span>
  );
}
