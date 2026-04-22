import { Clock, DollarSign, Target } from "lucide-react";

import type {
  DashboardHighlightItem,
  DashboardUrgency,
} from "@/features/dashboard/types/dashboard";

export const urgencyStyleMap: Record<DashboardUrgency, string> = {
  urgent: "bg-red-50 text-red-600",
  important: "bg-orange-50 text-orange-600",
  recommended: "bg-green-50 text-green-600",
};

export function getHighlightToneClasses(tone: DashboardHighlightItem["tone"] = "neutral") {
  switch (tone) {
    case "danger":
      return "border-red-200 bg-red-50 text-red-700";
    case "warning":
      return "border-orange-200 bg-orange-50 text-orange-700";
    case "success":
      return "border-green-200 bg-green-50 text-green-700";
    case "info":
      return "border-[#dbe6fb] bg-[#edf4ff] text-[#2454C8]";
    default:
      return "border-border bg-[#f8fbff] text-slate-700";
  }
}

export { Clock, DollarSign, Target };
