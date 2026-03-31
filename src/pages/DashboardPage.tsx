import { useMemo } from "react";
import { AlertTriangle, Clock, BarChart3, Shield, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { PageHero, StatsGrid } from "@/pages/shared";
import { useDemoSession } from "@/contexts/useDemoSession";
import {
  fetchAnalyticsMetrics,
  fetchAuditLogs,
  fetchOrderSelectionSummary,
  fetchProductionOverview,
  fetchProductionRegistrationSummary,
} from "@/lib/api";

const urgencyConfig = {
  danger: { badge: "bg-red-50 text-red-600", border: "border-red-200", header: "from-red-50 to-red-50/30" },
  warning: { badge: "bg-orange-50 text-orange-600", border: "border-orange-200", header: "from-orange-50 to-orange-50/30" },
  normal: { badge: "bg-[#eef4ff] text-[#2454C8]", border: "border-border", header: "from-[#edf4ff] to-[#f8fbff]" },
};

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function DashboardPage() {
  const { user } = useDemoSession();
  const today = getTodayString();
  const productionOverviewQuery = useQuery({
    queryKey: ["dashboard-production-overview"],
    queryFn: fetchProductionOverview,
  });
  const productionSummaryQuery = useQuery({
    queryKey: ["dashboard-production-summary", user.storeId, today, today],
    queryFn: () => fetchProductionRegistrationSummary({ storeId: user.storeId, dateFrom: today, dateTo: today }),
  });
  const orderingSummaryQuery = useQuery({
    queryKey: ["dashboard-ordering-summary", user.storeId, today, today],
    queryFn: () => fetchOrderSelectionSummary({ storeId: user.storeId, dateFrom: today, dateTo: today }),
  });
  const analyticsMetricsQuery = useQuery({
    queryKey: ["analytics-metrics"],
    queryFn: fetchAnalyticsMetrics,
  });
  const auditLogsQuery = useQuery({
    queryKey: ["audit-logs-sales"],
    queryFn: () => fetchAuditLogs("sales", 20),
  });

  const dashboardStats = useMemo(() => {
    const dangerCount = productionOverviewQuery.data?.danger_count ?? 0;
    const orderingSummary = orderingSummaryQuery.data;
    const productionSummary = productionSummaryQuery.data;
    return [
      { label: "품절 위험 SKU", value: `${dangerCount}건`, tone: dangerCount > 0 ? ("danger" as const) : ("default" as const) },
      {
        label: "주문 검토 필요",
        value: orderingSummary?.latest ? "처리됨" : "1건",
        tone: orderingSummary?.latest ? ("success" as const) : ("primary" as const),
      },
      {
        label: "오늘 생산 등록",
        value: `${productionSummary?.recent_registration_count_7d ?? 0}건`,
        tone: (productionSummary?.recent_registration_count_7d ?? 0) > 0 ? ("success" as const) : ("default" as const),
      },
      { label: "정책 로그 수집", value: "정상", tone: "default" as const },
    ];
  }, [orderingSummaryQuery.data, productionOverviewQuery.data?.danger_count, productionSummaryQuery.data]);

  const heroBadges = useMemo(() => {
    const dangerCount = productionOverviewQuery.data?.danger_count ?? 0;
    const orderingSummary = orderingSummaryQuery.data;
    return [
      {
        icon: AlertTriangle,
        className: "bg-red-50 text-red-600",
        text: `품절 위험 ${dangerCount}건`,
      },
      {
        icon: Clock,
        className: "bg-orange-50 text-orange-600",
        text: orderingSummary?.latest ? "주문 선택 완료" : "주문 마감 20분",
      },
      {
        icon: BarChart3,
        className: "bg-[#eef4ff] text-[#2454C8]",
        text: `오늘 생산 등록 ${productionSummaryQuery.data?.recent_registration_count_7d ?? 0}건`,
      },
      {
        icon: Shield,
        className: "bg-green-50 text-green-600",
        text: "보안 정책 정상",
      },
    ];
  }, [orderingSummaryQuery.data, productionOverviewQuery.data?.danger_count, productionSummaryQuery.data?.recent_registration_count_7d]);

  const agentCards = useMemo(() => {
    const productionItems = productionOverviewQuery.data?.items ?? [];
    const riskyItems = productionItems.filter((item) => item.status === "danger").slice(0, 3);
    const latestOrdering = orderingSummaryQuery.data?.latest;
    const orderingOptionCount = Object.keys(orderingSummaryQuery.data?.option_counts ?? {}).length;

    const salesMetrics = analyticsMetricsQuery.data?.items ?? [];
    const salesDesc = salesMetrics.length >= 2
      ? `${salesMetrics[0].label} ${salesMetrics[0].change} · ${salesMetrics[2]?.label ?? ""} ${salesMetrics[2]?.change ?? ""}`
      : "매출 분석 결과를 확인하세요";
    const salesItems = salesMetrics.slice(0, 3).map((m) => `${m.label} ${m.value} (${m.change})`);

    const auditLogs = auditLogsQuery.data?.items ?? [];
    const blockedCount = auditLogs.filter((l) => l.outcome === "blocked").length;
    const orchestrationItems = [
      "민감 정보 보호 정상",
      `오늘 차단 ${blockedCount}건 처리`,
      `운영 로그 ${auditLogs.length}건 수집`,
    ];

    return [
      {
        title: "생산 현황",
        description:
          (productionOverviewQuery.data?.danger_count ?? 0) > 0
            ? `지금 만들어야 할 도넛이 ${(productionOverviewQuery.data?.danger_count ?? 0)}개 있어요`
            : "지금 급한 생산 품목은 없어요",
        icon: "bakery_dining",
        to: "/production",
        urgency: ((productionOverviewQuery.data?.danger_count ?? 0) > 0 ? "danger" : "normal") as "danger" | "normal",
        items:
          riskyItems.length > 0
            ? riskyItems.map((item) =>
                item.depletion_time !== "-"
                  ? `${item.name} — ${item.depletion_time} 전 소진 가능성`
                  : `${item.name} — 생산 상태 확인 필요`,
              )
            : ["모든 품목 재고가 안정적이에요", "추가 생산 등록 없이 운영 가능해요", "상세 현황은 생산 현황에서 확인하세요"],
      },
      {
        title: "주문 관리",
        description: latestOrdering ? "오늘 주문 선택이 저장되었어요" : "주문 마감까지 20분 남았어요",
        icon: "shopping_cart",
        to: "/ordering",
        urgency: (latestOrdering ? "normal" : "warning") as "warning" | "normal",
        items: latestOrdering
          ? [
              `최근 선택 옵션 — ${latestOrdering.option_id}`,
              latestOrdering.reason ? `선택 사유 — ${latestOrdering.reason}` : "선택 사유 없이 저장되었어요",
              `조회 기간 내 저장 ${orderingSummaryQuery.data?.recent_selection_count_7d ?? 0}건`,
            ]
          : [
              `추천 옵션 ${orderingOptionCount || 3}개가 준비되어 있어요`,
              "주문 이력과 추천 기준을 비교해 선택하세요",
              "상세 옵션은 주문 관리에서 확인하세요",
            ],
      },
      {
        title: "매출 현황",
        description: salesDesc,
        icon: "query_stats",
        to: "/sales",
        urgency: "normal" as const,
        items: salesItems.length > 0 ? salesItems : ["매출 분석 데이터를 불러오는 중이에요"],
      },
      {
        title: "시스템 현황",
        description: "보안 정책 정상 적용 중",
        icon: "shield_lock",
        to: "/orchestration",
        urgency: "normal" as const,
        items: orchestrationItems,
      },
    ];
  }, [analyticsMetricsQuery.data, auditLogsQuery.data, orderingSummaryQuery.data, productionOverviewQuery.data]);

  return (
    <div className="space-y-6">
      <PageHero
        title={`${user.name}님, 오늘 매장은 어떤가요?`}
        description="생산, 주문, 매출 현황을 한눈에 확인하세요. 카드를 누르면 자세히 볼 수 있어요."
      >
        <div className="flex flex-wrap gap-2">
          {heroBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.text} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${badge.className}`}>
                <Icon className="h-3.5 w-3.5" />
                {badge.text}
              </div>
            );
          })}
        </div>
      </PageHero>

      <StatsGrid stats={dashboardStats} />

      {/* Agent cards */}
      <section className="grid gap-5 xl:grid-cols-2">
        {agentCards.map((card) => {
          const uc = urgencyConfig[card.urgency as keyof typeof urgencyConfig];
          return (
            <NavLink
              key={card.to}
              to={card.to}
              className={`group rounded-[28px] border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)] overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(16,32,51,0.10)] ${uc.border}`}
            >
              <div className={`bg-gradient-to-r ${uc.header} px-6 py-5`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xl font-bold text-slate-900">{card.title}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[28px] text-slate-300">{card.icon}</span>
                    <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
                <div className={`mt-3 inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold ${uc.badge}`}>
                  {card.description}
                </div>
              </div>
              <div className="px-6 py-4 space-y-2">
                {card.items.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-slate-500">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-200" />
                    {item}
                  </div>
                ))}
              </div>
            </NavLink>
          );
        })}
      </section>
    </div>
  );
}
