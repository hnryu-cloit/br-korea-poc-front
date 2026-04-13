import { useState } from "react";
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
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

import { PageHero, StatsGrid } from "@/components/common/page";

type ChatDomain = "production" | "ordering" | "sales";

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

export function DashboardPage() {
  const [activeChat, setActiveChat] = useState<ChatDomain | null>(null);

  const stats = [
    { label: "품절 위험 SKU", value: "3개", tone: "danger" as const },
    { label: "주문 마감까지", value: "17분", tone: "primary" as const },
    { label: "오늘 순이익 추정", value: "+342,000원", tone: "success" as const },
    { label: "알림 상태", value: "긴급 2건", tone: "default" as const },
  ];

  return (
    <div className="space-y-6">
      <PageHero
        title="오늘의 운영 현황"
        description="5분 단위 재고 조회, 주문 마감 알림, 손익 인사이트를 한 화면에서 확인하고 바로 실행하세요."
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-[#eef4ff] px-4 py-2 text-sm font-semibold text-[#2454C8]">
          <Clock className="h-4 w-4" />
          마지막 업데이트 2026-04-06 14:23 · 5분 단위 자동 갱신
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
          <Link
            to="/production"
            className="rounded-[24px] border border-red-200 bg-white px-5 py-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600">긴급 · 재고 소진 1시간 전</div>
                <p className="mt-3 text-lg font-bold text-slate-900">초코 도넛 생산 필요</p>
                <p className="mt-1 text-sm text-slate-500">현재 12개 → 1시간 후 2개 예상 · 지금 생산 시 찬스 로스 18% 감소</p>
              </div>
              <Package className="h-6 w-6 text-red-400" />
            </div>
          </Link>

          <Link
            to="/ordering"
            className="rounded-[24px] border border-orange-200 bg-white px-5 py-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-orange-600">중요 · 주문 마감 임박</div>
                <p className="mt-3 text-lg font-bold text-slate-900">주문 마감 17분 남음</p>
                <p className="mt-1 text-sm text-slate-500">오늘 주문 미완료 · AI 추천 3안 검토 후 점주가 직접 확정</p>
              </div>
              <ShoppingCart className="h-6 w-6 text-orange-400" />
            </div>
          </Link>

          <Link
            to="/sales"
            className="rounded-[24px] border border-green-200 bg-white px-5 py-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-600">권장 · 손익 확인</div>
                <p className="mt-3 text-lg font-bold text-slate-900">오늘 손익 확인 권장</p>
                <p className="mt-1 text-sm text-slate-500">어제 대비 매출 15% 증가 · 손익분기점 초과 달성</p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
          </Link>
        </div>
      </section>

      <StatsGrid stats={stats} />

      <section className="grid gap-5 xl:grid-cols-3">
        <SummaryCard
          icon={<Package className="h-5 w-5 text-[#2454C8]" />}
          title="생산 현황"
          description="실시간 재고 및 1시간 후 예측"
          chatItems={["지금 생산해야 할 품목은?", "찬스 로스가 뭔가요?", "품절 처리 방법은?"]}
          activeChat={activeChat === "production"}
          onToggleChat={() => setActiveChat((current) => (current === "production" ? null : "production"))}
          to="/production"
          cta="생산관리 상세보기"
        >
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-bold text-red-700">초코 도넛 재고 소진 1시간 전</p>
            <p className="mt-1 text-sm text-red-600">현재 재고 12개 · 지금 생산 시 찬스 로스 18% 감소 가능</p>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3">
            <p className="text-sm font-bold text-orange-700">말차 도넛 소진 속도 빠름</p>
            <p className="mt-1 text-sm text-orange-600">평소 대비 30% 빠른 판매 속도 감지</p>
          </div>
          <div className="space-y-3 rounded-2xl bg-[#f8fbff] px-4 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">품절 위험</span>
              <span className="font-bold text-red-600">3개</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">찬스 로스 절감</span>
              <span className="font-bold text-[#2454C8]">23%</span>
            </div>
          </div>
        </SummaryCard>

        <SummaryCard
          icon={<ShoppingCart className="h-5 w-5 text-[#2454C8]" />}
          title="주문 관리"
          description="주문 누락 방지 및 추천 검토"
          chatItems={["추천 주문량은?", "어제와 비교하면?", "날씨 영향은?"]}
          activeChat={activeChat === "ordering"}
          onToggleChat={() => setActiveChat((current) => (current === "ordering" ? null : "ordering"))}
          to="/ordering"
          cta="주문 검토하기"
        >
          <div className="flex items-center justify-between rounded-2xl border border-orange-200 bg-orange-50 px-4 py-4">
            <div>
              <p className="font-bold text-orange-900">주문 마감 임박</p>
              <p className="mt-1 text-2xl font-bold text-orange-700">17분 남음</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
          <div className="rounded-2xl border border-[#dbe6fb] bg-[#edf4ff] px-4 py-3">
            <p className="text-sm font-bold text-[#2454C8]">주문 누락 방지가 목적입니다</p>
            <p className="mt-1 text-sm text-slate-600">최종 결정은 점주님이 하십니다.</p>
          </div>
          <div className="space-y-2 rounded-2xl bg-[#f8fbff] px-4 py-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">주문 상태</span>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">검토 필요</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">AI 추천안</span>
              <span className="font-bold text-slate-800">3개 준비됨</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">추천 기준</span>
              <span className="font-bold text-slate-800">전일 / 전주 / 패턴</span>
            </div>
          </div>
        </SummaryCard>

        <SummaryCard
          icon={<TrendingUp className="h-5 w-5 text-[#2454C8]" />}
          title="손익 분석"
          description="순이익 및 손익분기점 분석"
          chatItems={["오늘 순이익은?", "손익분기점은?", "어제와 비교하면?"]}
          activeChat={activeChat === "sales"}
          onToggleChat={() => setActiveChat((current) => (current === "sales" ? null : "sales"))}
          to="/sales"
          cta="손익분석 상세보기"
        >
          <div className="flex items-center justify-between rounded-2xl border border-green-200 bg-green-50 px-4 py-4">
            <div>
              <p className="text-sm font-medium text-green-700">오늘 순이익</p>
              <p className="mt-1 text-2xl font-bold text-green-900">+342,000원</p>
              <p className="mt-1 text-xs text-green-700">순이익률 18.5%</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
          <div className="rounded-2xl border border-[#dbe6fb] bg-[#edf4ff] px-4 py-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-[#2454C8]" />
              <p className="text-sm font-bold text-[#2454C8]">손익분기점 달성 · +230,000원 초과</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[#eadfff] bg-[#faf6ff] px-4 py-3">
            <p className="text-sm font-bold text-[#6d4db4]">강남점 맞춤 분석</p>
            <p className="mt-1 text-sm text-slate-600">매장 운영 패턴과 최근 성과를 반영한 답변을 제공합니다.</p>
          </div>
          <div className="space-y-2 rounded-2xl bg-[#f8fbff] px-4 py-4 text-sm">
            <div className="flex items-center justify-between"><span className="text-slate-500">매출</span><span className="font-bold text-slate-800">1,850,000원</span></div>
            <div className="flex items-center justify-between"><span className="text-slate-500">원가</span><span className="font-bold text-red-600">-890,000원</span></div>
            <div className="flex items-center justify-between"><span className="text-slate-500">인건비</span><span className="font-bold text-red-600">-520,000원</span></div>
            <div className="flex items-center justify-between"><span className="text-slate-500">기타 비용</span><span className="font-bold text-red-600">-98,000원</span></div>
          </div>
        </SummaryCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
          <p className="text-lg font-bold text-slate-900">오늘의 주요 인사이트</p>
          <div className="mt-4 space-y-3">
            {[
              "주말 매출이 평일 대비 40% 높습니다. 주말 생산량 선반영이 필요합니다.",
              "초코 도넛 순이익률 18.9%로 최고 수익 품목입니다.",
              "말차 도넛 원가율 개선 필요. 현재 순이익률 17.9%입니다.",
            ].map((item) => (
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
