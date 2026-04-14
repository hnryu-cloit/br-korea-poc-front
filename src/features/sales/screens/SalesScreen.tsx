import { useMemo, useState } from "react";
import {
  Calendar,
  DollarSign,
  MessageCircle,
  Send,
  Store,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { PageHero, StatsGrid } from "@/components/common/page/page-layout";

type QueryResponse = {
  query: string;
  answer: string;
  insights: string[];
  storeContext: string;
  dataSource: string;
  comparisonBasis: string;
  calculationDate: string;
};

const suggestedQuestions = [
  "오늘 순이익은 얼마인가요?",
  "손익분기점까지 얼마나 남았나요?",
  "어제와 비교하면 어떤가요?",
  "이번 주 매출 추이는?",
  "가장 많이 팔린 상품은?",
  "원가율이 높은 품목은?",
  "인건비 비중은 적정한가요?",
  "날씨가 매출에 영향을 주었나요?",
  "작년 같은 기간과 비교하면?",
  "손익을 개선하려면?",
  "우리 매장 특성에 맞는 개선 방법은?",
  "직영점과 비교하면 어떤가요?",
];

const weeklyData = [
  { day: "월", revenue: 1850000, profit: 342000, cost: 1508000 },
  { day: "화", revenue: 2100000, profit: 420000, cost: 1680000 },
  { day: "수", revenue: 1950000, profit: 380000, cost: 1570000 },
  { day: "목", revenue: 2300000, profit: 510000, cost: 1790000 },
  { day: "금", revenue: 2800000, profit: 680000, cost: 2120000 },
  { day: "토", revenue: 3200000, profit: 850000, cost: 2350000 },
  { day: "일", revenue: 2900000, profit: 720000, cost: 2180000 },
];

const productData = [
  { name: "초코 도넛", sales: 450000, profit: 85000, profitRate: 18.9 },
  { name: "딸기 도넛", sales: 380000, profit: 72000, profitRate: 18.9 },
  { name: "글레이즈드 도넛", sales: 520000, profit: 98000, profitRate: 18.8 },
  { name: "크림 도넛", sales: 320000, profit: 60000, profitRate: 18.8 },
  { name: "말차 도넛", sales: 280000, profit: 50000, profitRate: 17.9 },
];

type TabKey = "profit" | "breakdown" | "products" | "query";

function formatWon(value: number) {
  return `${value.toLocaleString()}원`;
}

export function SalesPage() {
  const [tab, setTab] = useState<TabKey>("profit");
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState<QueryResponse[]>([]);
  const [showChat, setShowChat] = useState(false);

  const todayRevenue = 1850000;
  const todayCost = 1508000;
  const todayProfit = 342000;
  const breakEvenPoint = 1620000;
  const targetProfit = 500000;
  const itemsNeeded = Math.ceil((targetProfit - todayProfit) / 6800);

  const stats = useMemo(() => [
    { label: "오늘 매출", value: formatWon(todayRevenue), tone: "default" as const },
    { label: "오늘 순이익", value: `+${todayProfit.toLocaleString()}원`, tone: "success" as const },
    { label: "총 비용", value: formatWon(todayCost), tone: "danger" as const },
    { label: "손익분기점", value: "달성", tone: "primary" as const },
  ], []);

  const handleSubmit = () => {
    const value = query.trim();
    if (!value) return;

    setResponses((current) => [
      {
        query: value,
        answer: `강남점의 최근 4주 운영 패턴과 비용 구조를 기준으로 분석한 결과입니다. "${value}"에 대해 현재는 목업 응답을 보여주고 있으며, 실제 연동 시에는 매장 실데이터와 비교군 기준을 반영해 답변합니다.`,
        insights: [
          "강남점 특성상 주말 매출이 평일 대비 40% 높으므로 금요일 오후 생산량을 선반영하세요.",
          "초코 도넛 순이익률이 18.9%로 가장 높습니다. 상단 노출 비중 확대가 유효합니다.",
          "말차 도넛 원가율이 높아 레시피 또는 프로모션 구조 조정이 필요합니다.",
        ],
        storeContext: "강남점 · 최근 4주 운영 패턴 기준",
        dataSource: "POS 데이터, 재고 데이터, 주문 이력",
        comparisonBasis: "전주 동요일, 직영점 평균",
        calculationDate: "2026-04-06 기준",
      },
      ...current,
    ]);
    setQuery("");
  };

  return (
    <div className="space-y-6">
      <PageHero
        title="손익분석"
        description="순이익을 기본으로 보여주고 손익분기점, 비용 구성, 상품별 수익성, 매장 맞춤형 AI 분석까지 연결합니다."
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#eef4ff] px-4 py-2 text-sm font-semibold text-[#2454C8]">
            <Store className="h-4 w-4" />
            강남점 맞춤 분석
          </div>
          <button
            type="button"
            onClick={() => setShowChat((value) => !value)}
            className="inline-flex items-center gap-2 rounded-full border border-[#dce4f3] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-[#bfd1ed] hover:text-[#2454C8]"
          >
            <MessageCircle className="h-4 w-4" />
            AI 질문하기
          </button>
        </div>
      </PageHero>

      {showChat ? (
        <section className="rounded-[28px] border border-[#dbe6fb] bg-white px-6 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
          <p className="text-sm font-bold text-slate-900">손익 관련 빠른 질문</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["오늘 순이익은?", "손익분기점은?", "개선 방법은?", "우리 매장 특성은?"].map((item) => (
              <button
                key={item}
                type="button"
                className="rounded-full border border-[#dce4f3] bg-[#f7faff] px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-[#eef4ff] hover:text-[#2454C8]"
              >
                {item}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <StatsGrid stats={stats} />

      <section className="rounded-[28px] border border-[#dbe6fb] bg-[#edf4ff] px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <div className="flex items-start gap-3">
          <Target className="mt-0.5 h-5 w-5 shrink-0 text-[#2454C8]" />
          <div>
            <p className="text-lg font-bold text-[#2454C8]">손익분기점 분석</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              오늘 손익분기점 {formatWon(breakEvenPoint)}을 달성했습니다. 현재 순이익은 {formatWon(todayProfit)}이며 손익분기점 대비 {formatWon(todayRevenue - breakEvenPoint)} 초과 달성했습니다.
            </p>
            <div className="mt-4 rounded-2xl bg-white px-4 py-4">
              <p className="text-sm font-bold text-slate-900">목표 순이익 달성 계획</p>
              <p className="mt-1 text-sm text-slate-600">하루 목표 순이익 {formatWon(targetProfit)}에 도달하려면 도넛 {itemsNeeded}개를 더 판매하면 됩니다. (평균 개당 순이익 6,800원 기준)</p>
            </div>
            <p className="mt-3 text-xs text-slate-500">계산 기준: 2026-04-06 강남점 평균 순이익률 및 품목별 원가 반영</p>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-[rgba(109,77,180,0.18)] bg-[rgba(250,246,255,0.92)] px-5 py-4 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
        <div className="flex items-start gap-3">
          <Store className="mt-0.5 h-5 w-5 shrink-0 text-[#6d4db4]" />
          <div>
            <p className="text-base font-bold text-[#6d4db4]">강남점 맞춤 분석</p>
            <p className="mt-1 text-sm text-slate-600">최근 4주 운영 패턴, 상권 특성, 고객 선호도를 반영한 매장 맞춤형 답변을 제공합니다.</p>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-border bg-white p-2 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <div className="flex flex-wrap gap-2 p-3">
          {[
            { key: "profit", label: "순이익 분석" },
            { key: "breakdown", label: "비용 구성" },
            { key: "products", label: "상품별 분석" },
            { key: "query", label: "AI 질의" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key as TabKey)}
              className={`rounded-2xl px-4 py-2 text-sm font-bold transition-colors ${
                tab === item.key ? "bg-[#2454C8] text-white" : "bg-[#f7faff] text-slate-600 hover:bg-[#eef4ff] hover:text-[#2454C8]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="px-4 pb-4">
          {tab === "profit" ? (
            <div className="space-y-5">
              <article className="rounded-[24px] border border-border bg-[#f8fbff] px-5 py-5">
                <p className="text-lg font-bold text-slate-900">주간 매출 및 순이익 추이</p>
                <div className="mt-4 grid gap-3 lg:grid-cols-7">
                  {weeklyData.map((day) => (
                    <div key={day.day} className="rounded-2xl bg-white px-4 py-4 shadow-sm">
                      <p className="text-xs font-semibold text-slate-400">{day.day}</p>
                      <p className="mt-2 text-sm font-bold text-slate-800">매출 {Math.round(day.revenue / 10000)}만</p>
                      <p className="mt-1 text-sm font-bold text-green-600">순이익 {Math.round(day.profit / 1000)}천</p>
                      <p className="mt-1 text-xs text-slate-500">비용 {Math.round(day.cost / 10000)}만</p>
                    </div>
                  ))}
                </div>
              </article>
              <div className="grid gap-5 md:grid-cols-2">
                <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-sm">
                  <p className="text-base font-bold text-slate-900">주간 누적 순이익</p>
                  <p className="mt-3 text-3xl font-bold text-green-600">+3,902,000원</p>
                  <p className="mt-2 text-sm text-slate-500">7일 누적 순이익 · 평균 일 순이익 557,000원</p>
                </article>
                <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-sm">
                  <p className="text-base font-bold text-slate-900">손익분기점 달성 현황</p>
                  <p className="mt-3 text-3xl font-bold text-[#2454C8]">7/7일</p>
                  <p className="mt-2 text-sm text-slate-500">이번 주 모든 영업일에 손익분기점을 달성했습니다.</p>
                </article>
              </div>
            </div>
          ) : null}

          {tab === "breakdown" ? (
            <div className="grid gap-5 lg:grid-cols-2">
              <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-sm">
                <p className="text-lg font-bold text-slate-900">비용 구성</p>
                <div className="mt-4 space-y-3">
                  {[
                    ["원가", "890,000원"],
                    ["인건비", "520,000원"],
                    ["카드 수수료", "55,500원"],
                    ["기타 고정비", "42,500원"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-4 py-4">
                      <span className="font-semibold text-slate-700">{label}</span>
                      <span className="font-bold text-red-600">{value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between border-t border-border/60 pt-4 text-base font-bold text-slate-900">
                    <span>총 비용</span>
                    <span className="text-red-600">1,508,000원</span>
                  </div>
                </div>
              </article>

              <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-sm">
                <p className="text-lg font-bold text-slate-900">비용 비율</p>
                <div className="mt-4 space-y-4">
                  {[
                    ["원가율", "48.1%", "bg-red-500"],
                    ["인건비율", "28.1%", "bg-orange-500"],
                    ["기타 비용", "5.3%", "bg-yellow-500"],
                    ["순이익률", "18.5%", "bg-green-500"],
                  ].map(([label, value, bar]) => (
                    <div key={label}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className={label === "순이익률" ? "font-bold text-slate-900" : "text-slate-600"}>{label}</span>
                        <span className={label === "순이익률" ? "font-bold text-green-600" : "font-semibold text-slate-700"}>{value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div className={`h-2 rounded-full ${bar}`} style={{ width: value }} />
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          ) : null}

          {tab === "products" ? (
            <div className="space-y-5">
              <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-sm">
                <p className="text-lg font-bold text-slate-900">상품별 판매 및 순이익</p>
                <div className="mt-4 space-y-3">
                  {productData.map((product) => (
                    <div key={product.name} className="rounded-2xl bg-[#f8fbff] px-4 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-slate-900">{product.name}</p>
                          <p className="mt-1 text-sm text-slate-500">매출 {formatWon(product.sales)} · 순이익 {formatWon(product.profit)}</p>
                        </div>
                        <div className={`rounded-full px-3 py-1 text-xs font-bold ${product.profitRate >= 18.5 ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}>
                          {product.profitRate}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          ) : null}

          {tab === "query" ? (
            <div className="space-y-5">
              <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-sm">
                <p className="text-lg font-bold text-slate-900">AI 손익 분석</p>
                <p className="mt-1 text-sm text-slate-500">자연어 질의로 강남점 맞춤형 인사이트를 제공합니다.</p>
                <div className="mt-4 flex gap-2">
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleSubmit();
                    }}
                    placeholder="예: 오늘 순이익은 얼마인가요?"
                    className="flex-1 rounded-2xl border border-[#dce4f3] bg-[#f8fbff] px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#2454C8]"
                  />
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center justify-center rounded-2xl bg-[#2454C8] px-4 py-3 text-white transition-colors hover:bg-[#1d44a8]"
                    aria-label="질문 전송"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-bold text-slate-700">추천 질문 (10개 이상)</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {suggestedQuestions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setQuery(item)}
                        className="rounded-full border border-[#dce4f3] bg-[#f7faff] px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-[#eef4ff] hover:text-[#2454C8]"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </article>

              {responses.map((response) => (
                <article key={`${response.query}-${response.calculationDate}`} className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#2454C8] px-3 py-1 text-xs font-bold text-white">질문</span>
                    <p className="font-semibold text-slate-900">{response.query}</p>
                  </div>

                  <div className="mt-4 rounded-2xl border border-[rgba(109,77,180,0.18)] bg-[rgba(250,246,255,0.92)] px-4 py-4">
                    <div className="flex items-center gap-2 text-[#6d4db4]">
                      <Store className="h-4 w-4" />
                      <p className="text-xs font-bold">{response.storeContext}</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{response.answer}</p>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-bold text-slate-700">실행 가능한 인사이트</p>
                    <div className="mt-3 space-y-2">
                      {response.insights.map((insight) => (
                        <div key={insight} className="flex items-start gap-3 rounded-2xl bg-[#edf4ff] px-4 py-3 text-sm text-slate-700">
                          <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-[#2454C8]" />
                          {insight}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 border-t border-border/60 pt-4 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      계산 기준일: {response.calculationDate}
                    </div>
                    <p className="mt-1">데이터 출처: {response.dataSource}</p>
                    <p className="mt-1">비교 기준: {response.comparisonBasis}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
          <div className="flex items-center gap-3">
            <DollarSign className="h-7 w-7 text-[#2454C8]" />
            <div>
              <p className="text-sm text-slate-500">오늘 매출</p>
              <p className="font-bold text-slate-900">1,850,000원</p>
            </div>
          </div>
        </article>
        <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-7 w-7 text-green-600" />
            <div>
              <p className="text-sm text-slate-500">오늘 순이익</p>
              <p className="font-bold text-green-600">+342,000원</p>
            </div>
          </div>
        </article>
        <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
          <div className="flex items-center gap-3">
            <TrendingDown className="h-7 w-7 text-red-600" />
            <div>
              <p className="text-sm text-slate-500">총 비용</p>
              <p className="font-bold text-red-600">1,508,000원</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
