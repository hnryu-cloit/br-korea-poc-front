import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  CloudRain,
  Clock,
  Info,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

import { PageHero, StatsGrid } from "@/pages/shared";

type OrderItem = { name: string; quantity: number };
type OrderOption = {
  id: string;
  title: string;
  basis: string;
  description: string;
  items: OrderItem[];
  reasoning: string;
  metrics: { key: string; value: string }[];
  specialFactors?: string[];
  recommended?: boolean;
};

const options: OrderOption[] = [
  {
    id: "yesterday",
    title: "전일 기준",
    basis: "어제 판매량 기반",
    description: "어제와 동일한 수량으로 주문합니다.",
    items: [
      { name: "초코 도넛", quantity: 120 },
      { name: "딸기 도넛", quantity: 90 },
      { name: "글레이즈드 도넛", quantity: 150 },
      { name: "크림 도넛", quantity: 100 },
      { name: "말차 도넛", quantity: 70 },
    ],
    reasoning: "어제 월요일 판매량과 잔여 재고를 기준으로 산정했습니다.",
    metrics: [
      { key: "재고 소진율", value: "95%" },
      { key: "품절 품목", value: "0개" },
      { key: "잔여 재고", value: "5%" },
    ],
  },
  {
    id: "lastweek",
    title: "전주 동요일 기준",
    basis: "지난주 월요일 판매량 기반",
    description: "지난주 같은 요일 판매량과 최근 증가 추세를 반영합니다.",
    items: [
      { name: "초코 도넛", quantity: 135 },
      { name: "딸기 도넛", quantity: 95 },
      { name: "글레이즈드 도넛", quantity: 160 },
      { name: "크림 도넛", quantity: 110 },
      { name: "말차 도넛", quantity: 80 },
    ],
    reasoning: "지난주 월요일 대비 최근 3주 평균 증가 추세와 날씨 유사도를 반영했습니다.",
    metrics: [
      { key: "3주 평균 증가율", value: "+12%" },
      { key: "날씨 유사도", value: "90%" },
      { key: "재고 회전율", value: "98%" },
    ],
    specialFactors: ["날씨: 맑음, 22°C", "조기 품절: 말차 도넛 +5개 보정"],
    recommended: true,
  },
  {
    id: "pattern",
    title: "점주 반복 패턴",
    basis: "최근 4주 점주 선택 패턴",
    description: "점주가 자주 수정하는 수량과 최근 월요일 패턴을 반영합니다.",
    items: [
      { name: "초코 도넛", quantity: 130 },
      { name: "딸기 도넛", quantity: 100 },
      { name: "글레이즈드 도넛", quantity: 155 },
      { name: "크림 도넛", quantity: 105 },
      { name: "말차 도넛", quantity: 75 },
    ],
    reasoning: "점주님의 최근 4주 월요일 선택 패턴과 수정 빈도를 개인화 기본값으로 반영했습니다.",
    metrics: [
      { key: "4주 평균 선택", value: "100%" },
      { key: "수정 빈도", value: "낮음" },
      { key: "패턴 신뢰도", value: "85%" },
    ],
    specialFactors: ["개인화 기본값 적용"],
  },
];

export function OrderingPage() {
  const [seconds, setSeconds] = useState(17 * 60);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (confirmed) return;
    const timer = window.setInterval(() => {
      setSeconds((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [confirmed]);

  const stats = useMemo(() => [
    { label: "주문 마감까지", value: "17분", tone: "danger" as const },
    { label: "추천 옵션", value: "3개", tone: "primary" as const },
    { label: "주문 목적", value: "누락 방지", tone: "default" as const },
    { label: "최종 의사결정", value: "점주 직접", tone: "success" as const },
  ], []);

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const selectedOption = options.find((option) => option.id === selectedOptionId) ?? null;

  if (confirmed && selectedOption) {
    return (
      <div className="space-y-6">
        <PageHero
          title="주문이 완료되었습니다."
          description="점주가 직접 확정한 주문안이 저장되었습니다."
        />
        <section className="rounded-[28px] border border-green-200 bg-green-50 px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-white p-3 text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-green-800">주문 내역</p>
              <p className="mt-1 text-sm text-green-700">{selectedOption.title} 기준으로 주문을 확정했습니다.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {selectedOption.items.map((item) => (
                  <div key={item.name} className="rounded-2xl bg-white px-4 py-4 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400">{item.name}</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{item.quantity}개</p>
                  </div>
                ))}
              </div>
              {reason ? (
                <div className="mt-4 rounded-2xl bg-white px-4 py-4 text-sm text-slate-600">
                  <p className="text-xs font-bold text-slate-400">선택 사유</p>
                  <p className="mt-1">{reason}</p>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHero
        title="주문관리"
        description="주문 누락 방지를 목적으로 추천 3안을 비교합니다. 예측과 권고는 최소 범위로 제공하며 최종 의사결정은 점주가 수행합니다."
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#eef4ff] px-4 py-2 text-sm font-semibold text-[#2454C8]">
            <Clock className="h-4 w-4" />
            주문 마감까지 {mins}:{secs}
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
          <p className="text-sm font-bold text-slate-900">주문 관련 빠른 질문</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["추천 주문량 근거는?", "어제와 얼마나 다른가요?", "날씨가 주문에 영향을 주나요?", "조기 품절은 어떻게 반영되나요?"].map((item) => (
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

      <section className="rounded-[24px] border border-[#dbe6fb] bg-[#edf4ff] px-5 py-4 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#2454C8]" />
          <div>
            <p className="text-base font-bold text-[#2454C8]">주문 누락 방지 원칙</p>
            <p className="mt-1 text-sm text-slate-600">AI 추천은 참고 자료입니다. 최종 주문 결정은 점주님께서 직접 하십니다.</p>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-orange-200 bg-orange-50 px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-base font-bold text-orange-900">주문 마감 20분 전 알림</p>
              <p className="mt-1 text-3xl font-bold text-orange-700">{mins}:{secs}</p>
            </div>
          </div>
          <div className="h-3 w-48 rounded-full bg-white/70">
            <div className="h-3 rounded-full bg-[#2454C8]" style={{ width: `${Math.max((seconds / (20 * 60)) * 100, 3)}%` }} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
          <div className="flex items-center gap-3">
            <Calendar className="h-7 w-7 text-[#2454C8]" />
            <div>
              <p className="text-sm text-slate-500">오늘</p>
              <p className="font-bold text-slate-900">2026년 4월 6일 월요일</p>
            </div>
          </div>
        </article>
        <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
          <div className="flex items-center gap-3">
            <CloudRain className="h-7 w-7 text-slate-500" />
            <div>
              <p className="text-sm text-slate-500">날씨 예보</p>
              <p className="font-bold text-slate-900">맑음, 22°C</p>
            </div>
          </div>
        </article>
        <article className="rounded-[24px] border border-border bg-white px-5 py-5 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-7 w-7 text-green-600" />
            <div>
              <p className="text-sm text-slate-500">최근 트렌드</p>
              <p className="font-bold text-green-600">+12% 증가세</p>
            </div>
          </div>
        </article>
      </section>

      <section>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-slate-900">주문 추천안 비교</p>
            <p className="mt-1 text-sm text-slate-500">전일, 전주 동요일, 점주 반복 패턴 3축으로 고정해 비교합니다.</p>
          </div>
          <p className="text-sm font-medium text-slate-500">예측 및 권고는 최소 범위로 제공됩니다.</p>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-3">
          {options.map((option) => (
            <article
              key={option.id}
              className={`rounded-[28px] border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)] transition-all ${
                selectedOptionId === option.id ? "border-[#2454C8] ring-1 ring-[#2454C8]/20" : "border-border hover:border-[#bfd1ed]"
              }`}
            >
              <button type="button" className="w-full text-left" onClick={() => setSelectedOptionId(option.id)}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold text-slate-900">{option.title}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">{option.basis}</p>
                  </div>
                  {option.recommended ? (
                    <span className="rounded-full bg-[#2454C8] px-3 py-1 text-xs font-bold text-white">AI 추천</span>
                  ) : null}
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-500">{option.description}</p>

                <div className="mt-4 space-y-2">
                  {option.items.map((item) => (
                    <div key={item.name} className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-3 py-2.5 text-sm">
                      <span className="text-slate-600">{item.name}</span>
                      <span className="font-bold text-slate-800">{item.quantity}개</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl bg-[#edf4ff] px-4 py-4">
                  <p className="text-xs font-bold text-[#2454C8]">추천 근거</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{option.reasoning}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {option.metrics.map((metric) => (
                      <div key={metric.key} className="rounded-2xl bg-white px-3 py-3">
                        <p className="text-[11px] font-semibold text-slate-400">{metric.key}</p>
                        <p className="mt-1 text-sm font-bold text-slate-900">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {option.specialFactors?.length ? (
                  <div className="mt-4">
                    <p className="text-xs font-bold text-slate-500">예외 변수 반영</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {option.specialFactors.map((factor) => (
                        <span key={factor} className="rounded-full border border-[#dce4f3] bg-[#f7faff] px-3 py-1 text-[11px] font-semibold text-slate-600">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </button>
            </article>
          ))}
        </div>
      </section>

      {selectedOption ? (
        <section className="rounded-[28px] border border-[#dbe6fb] bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
          <p className="text-lg font-bold text-slate-900">점주 최종 확정</p>
          <p className="mt-1 text-sm text-slate-500">추천안은 참고 자료입니다. 점주가 직접 검토하고 최종 확정합니다.</p>

          <div className="mt-5">
            <label className="text-sm font-semibold text-slate-700" htmlFor="order-reason">선택 사유</label>
            <textarea
              id="order-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="이 주문안을 선택한 이유를 입력하세요..."
              className="mt-2 min-h-28 w-full rounded-[24px] border border-[#dce4f3] bg-[#f8fbff] px-4 py-4 text-sm text-slate-700 outline-none focus:border-[#2454C8]"
            />
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-[#f8fbff] px-4 py-4 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
              주문 확정 후에는 수정할 수 없습니다. 점주가 직접 검토한 뒤 확정하세요.
            </div>
          </div>

          <button
            type="button"
            onClick={() => setConfirmed(true)}
            className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-[#2454C8] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1d44a8]"
          >
            점주가 직접 확정하기
          </button>
        </section>
      ) : null}
    </div>
  );
}
