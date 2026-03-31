import { AlertTriangle, Clock, BarChart3, Shield, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";

import { dashboardStats } from "@/data/page-content";
import { PageHero, StatsGrid } from "@/pages/shared";
import { useDemoSession } from "@/contexts/useDemoSession";

const agentCards = [
  {
    title: "생산 현황",
    description: "지금 만들어야 할 도넛이 있어요",
    icon: "bakery_dining",
    to: "/production",
    urgency: "danger",
    items: ["스트로베리 필드 — 55분 후 다 떨어져요", "올드패션 — 65분 후 다 떨어져요", "2차 생산 권장 시점 14:20"],
  },
  {
    title: "주문 관리",
    description: "주문 마감까지 20분 남았어요",
    icon: "shopping_cart",
    to: "/ordering",
    urgency: "warning",
    items: ["지난주 같은 요일 기준 추천", "2주 전 기준 — 재고 남을 위험 낮음", "지난달 기준 — 배달 많았던 시기"],
  },
  {
    title: "매출 현황",
    description: "배달 -14% · 재방문 +12%",
    icon: "query_stats",
    to: "/sales",
    urgency: "normal",
    items: ["배달 주문 감소 원인 확인 필요", "행사 후 재방문 손님 증가", "커피 세트 구매 늘고 있어요"],
  },
  {
    title: "시스템 현황",
    description: "보안 정책 정상 적용 중",
    icon: "shield_lock",
    to: "/orchestration",
    urgency: "normal",
    items: ["민감 정보 보호 정상", "오늘 차단 2건 처리", "운영 로그 정상 수집"],
  },
];

const urgencyConfig = {
  danger: { badge: "bg-red-50 text-red-600", border: "border-red-200", header: "from-red-50 to-red-50/30" },
  warning: { badge: "bg-orange-50 text-orange-600", border: "border-orange-200", header: "from-orange-50 to-orange-50/30" },
  normal: { badge: "bg-[#eef4ff] text-[#2454C8]", border: "border-border", header: "from-[#edf4ff] to-[#f8fbff]" },
};

export function DashboardPage() {
  const { user } = useDemoSession();

  return (
    <div className="space-y-6">
      <PageHero
        title={`${user.name}님, 오늘 매장은 어떤가요?`}
        description="생산, 주문, 매출 현황을 한눈에 확인하세요. 카드를 누르면 자세히 볼 수 있어요."
      >
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
            <AlertTriangle className="h-3.5 w-3.5" />
            품절 위험 3건
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
            <Clock className="h-3.5 w-3.5" />
            주문 마감 20분
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#eef4ff] px-3 py-1.5 text-xs font-semibold text-[#2454C8]">
            <BarChart3 className="h-3.5 w-3.5" />
            추천 질문 12개
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600">
            <Shield className="h-3.5 w-3.5" />
            보안 정책 정상
          </div>
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
