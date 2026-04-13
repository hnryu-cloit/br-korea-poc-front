import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  DollarSign,
  MessageCircle,
  Package,
  ShoppingCart,
  Target,
  TrendingUp,
  Truck,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

import { PageHero, StatsGrid } from "@/components/common/page";
import { fetchHomeOverview, type HomePriorityAction, type HomeSummaryCard } from "@/lib/api";

type ChatDomain = "production" | "ordering" | "sales";
type ActionType = "production" | "ordering" | "sales";

const priorityIconMap: Record<ActionType, React.ReactNode> = {
  production: <Package className="h-6 w-6 text-red-400" />,
  ordering: <ShoppingCart className="h-6 w-6 text-orange-400" />,
  sales: <TrendingUp className="h-6 w-6 text-green-500" />,
};

const summaryIconMap: Record<ActionType, React.ReactNode> = {
  production: <Package className="h-5 w-5 text-[#2454C8]" />,
  ordering: <ShoppingCart className="h-5 w-5 text-[#2454C8]" />,
  sales: <TrendingUp className="h-5 w-5 text-[#2454C8]" />,
};

const priorityBorderMap: Record<ActionType, string> = {
  production: "border-red-200",
  ordering: "border-orange-200",
  sales: "border-green-200",
};

const urgencyBadgeMap: Record<HomePriorityAction["urgency"], string> = {
  urgent: "bg-red-50 text-red-600",
  important: "bg-orange-50 text-orange-600",
  recommended: "bg-green-50 text-green-600",
};

function DomainChat({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="absolute right-0 top-12 z-20 w-72 rounded-[24px] border border-[#dbe6fb] bg-white p-4 shadow-[0_20px_40px_rgba(16,32,51,0.14)]">
      <p className="text-sm font-bold text-slate-900">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">현재 카드 문맥에 맞는 질문만 우선 제안합니다.</p>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className="w-full rounded-2xl border border-[#dce4f3] bg-[#f7faff] px-3 py-2 text-left text-xs font-medium text-slate-600 transition-colors hover:bg-[#eef4ff] hover:text-[#2454C8]"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  title,
  description,
  chatItems,
  activeChat,
  onToggleChat,
  children,
  to,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  chatItems: string[];
  activeChat: boolean;
  onToggleChat: () => void;
  children: React.ReactNode;
  to: string;
  cta: string;
}) {
  return (
    <article className="relative rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
            {icon}
            {title}
          </div>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <button
          type="button"
          onClick={onToggleChat}
          className="rounded-2xl border border-[#dce4f3] bg-[#f7faff] p-2 text-slate-500 transition-colors hover:border-[#bfd1ed] hover:text-[#2454C8]"
          aria-label={`${title} 질문 열기`}
        >
          <MessageCircle className="h-4 w-4" />
        </button>
      </div>

      {activeChat ? <DomainChat title={`${title} AI 질문`} items={chatItems} /> : null}

      <div className="mt-5 space-y-4">{children}</div>

      <Link
        to={to}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#dce4f3] bg-[#f7faff] px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-[#bfd1ed] hover:bg-[#eef4ff] hover:text-[#2454C8]"
      >
        {cta}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}

function formatConfidenceScore(score?: number | null) {
  if (typeof score !== "number") {
    return null;
  }
  return `AI 신뢰도 ${Math.round(score * 100)}%`;
}

function metricToneClass(tone: "danger" | "primary" | "success" | "default") {
  if (tone === "danger") return "text-red-600";
  if (tone === "primary") return "text-[#2454C8]";
  if (tone === "success") return "text-green-600";
  return "text-slate-800";
}

function findCard(cards: HomeSummaryCard[], domain: ActionType) {
  return cards.find((card) => card.domain === domain);
}

export function DashboardPage() {
  const [activeChat, setActiveChat] = useState<ChatDomain | null>(null);
  const homeOverviewQuery = useQuery({
    queryKey: ["home-overview"],
    queryFn: () => fetchHomeOverview({}),
    refetchInterval: 30_000,
  });

  const overview = homeOverviewQuery.data;
  const stats = overview?.stats ?? [];
  const priorityActions = overview?.priority_actions ?? [];
  const cards = overview?.cards ?? [];
  const productionCard = findCard(cards, "production");
  const orderingCard = findCard(cards, "ordering");
  const salesCard = findCard(cards, "sales");

  return (
    <div className="space-y-6">
      <PageHero
        title="오늘의 운영 현황"
        description="5분 단위 재고 조회, 주문 마감 알림, 손익 인사이트를 한 화면에서 확인하고 바로 실행하세요."
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-[#eef4ff] px-4 py-2 text-sm font-semibold text-[#2454C8]">
          <Clock className="h-4 w-4" />
          마지막 업데이트 {overview?.updated_at ?? "-"} · 30초 단위 자동 갱신
        </div>
      </PageHero>

      <section className="rounded-[28px] border border-orange-200 bg-[linear-gradient(135deg,#fff8ef_0%,#ffffff_100%)] px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">지금 해야 할 일</p>
            <p className="mt-1 text-sm text-slate-500">즉시 액션이 필요한 항목 3개를 우선순위대로 보여줍니다.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          {homeOverviewQuery.isLoading ? (
            <div className="rounded-[24px] border border-dashed border-orange-200 bg-white px-5 py-10 text-center text-sm text-slate-400 xl:col-span-3">
              대시보드 데이터를 불러오는 중입니다...
            </div>
          ) : homeOverviewQuery.isError ? (
            <div className="rounded-[24px] border border-dashed border-red-200 bg-white px-5 py-10 text-center text-sm text-red-500 xl:col-span-3">
              홈 대시보드 API 연결에 실패했습니다.
            </div>
          ) : (
            priorityActions.map((action) => {
              const confidenceLabel = formatConfidenceScore(action.confidence_score);
              return (
                <article
                  key={action.id}
                  className={`rounded-[24px] border bg-white px-5 py-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${priorityBorderMap[action.type]}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${urgencyBadgeMap[action.urgency]}`}>
                        {action.badge_label}
                      </div>
                      <p className="mt-3 text-lg font-bold text-slate-900">{action.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{action.description}</p>
                      {action.ai_reasoning ? <p className="mt-3 text-xs leading-5 text-slate-400">{action.ai_reasoning}</p> : null}
                    </div>
                    {priorityIconMap[action.type]}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    {confidenceLabel ? (
                      <span className="inline-flex items-center rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#2454C8]">
                        {confidenceLabel}
                      </span>
                    ) : (
                      <span />
                    )}

                    {action.type === "production" && action.is_finished_good ? (
                      <button
                        type="button"
                        disabled
                        className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-400"
                      >
                        생산하기 비활성
                      </button>
                    ) : (
                      <Link
                        to={action.cta_path}
                        className="inline-flex items-center gap-2 rounded-2xl border border-[#dce4f3] bg-[#f7faff] px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:border-[#bfd1ed] hover:bg-[#eef4ff] hover:text-[#2454C8]"
                      >
                        {action.cta_label}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      <StatsGrid stats={stats} />

      <section className="grid gap-5 xl:grid-cols-3">
        <SummaryCard
          icon={summaryIconMap.production}
          title={productionCard?.title ?? "생산 현황"}
          description={productionCard?.description ?? "실시간 재고 및 1시간 후 예측"}
          chatItems={productionCard?.prompts ?? ["지금 생산해야 할 품목은?", "찬스 로스가 뭔가요?", "품절 처리 방법은?"]}
          activeChat={activeChat === "production"}
          onToggleChat={() => setActiveChat((current) => (current === "production" ? null : "production"))}
          to={productionCard?.cta_path ?? "/production"}
          cta={productionCard?.cta_label ?? "생산관리 상세보기"}
        >
          {(productionCard?.highlights ?? []).map((highlight, index) => (
            <div key={highlight} className={`rounded-2xl px-4 py-3 ${index === 0 ? "border border-red-200 bg-red-50" : "border border-orange-200 bg-orange-50"}`}>
              <p className={`text-sm font-bold ${index === 0 ? "text-red-700" : "text-orange-700"}`}>{highlight}</p>
            </div>
          ))}
          <div className="space-y-3 rounded-2xl bg-[#f8fbff] px-4 py-4">
            {(productionCard?.metrics ?? []).map((metric) => (
              <div key={metric.label} className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{metric.label}</span>
                <span className={`font-bold ${metricToneClass(metric.tone)}`}>{metric.value}</span>
              </div>
            ))}
          </div>
        </SummaryCard>

        <SummaryCard
          icon={summaryIconMap.ordering}
          title={orderingCard?.title ?? "주문 관리"}
          description={orderingCard?.description ?? "주문 누락 방지 및 추천 검토"}
          chatItems={orderingCard?.prompts ?? ["추천 주문량은?", "어제와 비교하면?", "날씨 영향은?"]}
          activeChat={activeChat === "ordering"}
          onToggleChat={() => setActiveChat((current) => (current === "ordering" ? null : "ordering"))}
          to={orderingCard?.cta_path ?? "/ordering"}
          cta={orderingCard?.cta_label ?? "주문 검토하기"}
        >
          <div className="flex items-center justify-between rounded-2xl border border-orange-200 bg-orange-50 px-4 py-4">
            <div>
              <p className="font-bold text-orange-900">주문 마감 임박</p>
              <p className="mt-1 text-2xl font-bold text-orange-700">{orderingCard?.deadline_minutes ?? "-"}분 남음</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
          {orderingCard?.delivery_scheduled ? (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              <Truck className="h-4 w-4" />
              배송 예정 주문이 있습니다.
            </div>
          ) : null}
          <div className="rounded-2xl border border-[#dbe6fb] bg-[#edf4ff] px-4 py-3">
            <p className="text-sm font-bold text-[#2454C8]">주문 누락 방지가 목적입니다</p>
            <p className="mt-1 text-sm text-slate-600">최종 결정은 점주님이 하십니다.</p>
          </div>
          <div className="space-y-2 rounded-2xl bg-[#f8fbff] px-4 py-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">주문 상태</span>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">{orderingCard?.status_label ?? "-"}</span>
            </div>
            {(orderingCard?.metrics ?? []).map((metric) => (
              <div key={metric.label} className="flex items-center justify-between">
                <span className="text-slate-500">{metric.label}</span>
                <span className="font-bold text-slate-800">{metric.value}</span>
              </div>
            ))}
          </div>
        </SummaryCard>

        <SummaryCard
          icon={summaryIconMap.sales}
          title={salesCard?.title ?? "손익 분석"}
          description={salesCard?.description ?? "순이익 및 손익분기점 분석"}
          chatItems={salesCard?.prompts ?? ["오늘 순이익은?", "손익분기점은?", "어제와 비교하면?"]}
          activeChat={activeChat === "sales"}
          onToggleChat={() => setActiveChat((current) => (current === "sales" ? null : "sales"))}
          to={salesCard?.cta_path ?? "/sales"}
          cta={salesCard?.cta_label ?? "손익분석 상세보기"}
        >
          <div className="flex items-center justify-between rounded-2xl border border-green-200 bg-green-50 px-4 py-4">
            <div>
              <p className="text-sm font-medium text-green-700">오늘 순이익</p>
              <p className="mt-1 text-2xl font-bold text-green-900">{salesCard?.metrics?.[0]?.value ?? "+342,000원"}</p>
              <p className="mt-1 text-xs text-green-700">순이익률 18.5%</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
          <div className="rounded-2xl border border-[#dbe6fb] bg-[#edf4ff] px-4 py-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-[#2454C8]" />
              <p className="text-sm font-bold text-[#2454C8]">{salesCard?.metrics?.[1]?.label ?? "손익분기점"} · {salesCard?.metrics?.[1]?.value ?? "초과 달성"}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[#eadfff] bg-[#faf6ff] px-4 py-3">
            <p className="text-sm font-bold text-[#6d4db4]">강남점 맞춤 분석</p>
            <p className="mt-1 text-sm text-slate-600">{salesCard?.highlights?.join(" · ") ?? "매장 운영 패턴과 최근 성과를 반영한 답변을 제공합니다."}</p>
          </div>
          <div className="space-y-2 rounded-2xl bg-[#f8fbff] px-4 py-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">손익 상태</span>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-green-700">{salesCard?.status_label ?? "흑자"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">추천 액션</span>
              <span className="font-bold text-slate-800">피크타임 재고 유지</span>
            </div>
          </div>
        </SummaryCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
          <p className="text-lg font-bold text-slate-900">오늘의 주요 인사이트</p>
          <div className="mt-4 space-y-3">
            {(productionCard?.highlights ?? ["현재 위험 품목이 없습니다.", "주문 검토 상태를 확인해 주세요.", "손익 인사이트가 곧 반영됩니다."]).map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl bg-[#f8fbff] px-4 py-3 text-sm text-slate-600">
                <Zap className="mt-0.5 h-4 w-4 shrink-0 text-[#2454C8]" />
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
          <p className="text-lg font-bold text-slate-900">빠른 실행 가이드</p>
          <div className="mt-4 space-y-3">
            {[
              { label: "생산 관리", to: "/production" },
              { label: "주문 관리", to: "/ordering" },
              { label: "손익 분석", to: "/sales" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-4 py-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-[#eef4ff] hover:text-[#2454C8]"
              >
                {item.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
