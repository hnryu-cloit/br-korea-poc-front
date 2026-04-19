import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

import type { StoreInspectionItem } from "@/features/admin/hq-inspection/types/hq-inspection";

type ComplianceStatus = StoreInspectionItem["status"];

const statusConfig: Record<ComplianceStatus, { label: string; icon: React.ReactNode; className: string }> = {
  compliant: {
    label: "준수",
    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    className: "bg-green-50 text-green-600 border border-green-100",
  },
  partial: {
    label: "부분 준수",
    icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
    className: "bg-orange-50 text-orange-600 border border-orange-100",
  },
  noncompliant: {
    label: "미준수",
    icon: <XCircle className="h-4 w-4 text-red-500" />,
    className: "bg-red-50 text-red-600 border border-red-100",
  },
};

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-14 text-right text-xs font-medium text-slate-600">{value}/{max}</span>
    </div>
  );
}

type Props = {
  inspections: StoreInspectionItem[];
  isLoading: boolean;
};

export function HQInspectionTableSection({ inspections, isLoading }: Props) {
  return (
    <section className="rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)] overflow-hidden">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-base font-semibold text-slate-900">생산 점검 현황</p>
        <p className="text-xs text-slate-400 mt-0.5">이번 주 기준</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-[#f8fbff]">
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">매장</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">알림 대응률</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">생산 등록</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">찬스 로스 변화</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">준수 여부</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">불러오는 중...</td>
              </tr>
            ) : inspections.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">데이터가 없어요.</td>
              </tr>
            ) : (
              inspections.map((insp) => {
                const cfg = statusConfig[insp.status];
                return (
                  <tr key={insp.store} className={`border-b border-border/30 last:border-0 ${insp.status === "noncompliant" ? "bg-red-50/20" : "hover:bg-[#f8fbff]"}`}>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{insp.store}</p>
                      <p className="text-xs text-slate-400">{insp.region}</p>
                    </td>
                    <td className="px-4 py-4 w-48">
                      <ProgressBar
                        value={insp.alert_response_rate}
                        max={100}
                        color={insp.alert_response_rate >= 90 ? "bg-green-400" : insp.alert_response_rate >= 70 ? "bg-orange-400" : "bg-red-400"}
                      />
                    </td>
                    <td className="px-4 py-4 w-48">
                      <ProgressBar
                        value={insp.production_registered}
                        max={insp.production_total}
                        color={insp.production_registered === insp.production_total ? "bg-green-400" : insp.production_registered >= insp.production_total * 0.75 ? "bg-orange-400" : "bg-red-400"}
                      />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`text-sm font-semibold ${insp.chance_loss_change.startsWith("-") ? "text-green-600" : "text-red-600"}`}>
                        {insp.chance_loss_change}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {cfg.icon}
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.className}`}>{cfg.label}</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
