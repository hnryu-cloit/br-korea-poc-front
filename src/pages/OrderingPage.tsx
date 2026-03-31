import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle, Clock, ShoppingCart } from "lucide-react";

import { orderingStats } from "@/data/page-content";
import { SectionHint } from "@/components/ui/SectionHint";
import { PageHero, StatsGrid } from "@/pages/shared";

type OrderOption = {
  id: string;
  label: string;
  basis: string;
  description: string;
  recommended: boolean;
  items: { name: string; qty: number; note?: string }[];
  notes: string[];
};

const orderOptions: OrderOption[] = [
  {
    id: "opt-a",
    label: "지난주 같은 요일",
    basis: "3월 24일(월) 기준",
    description: "가장 최근 데이터 기준이에요. 오늘 날씨와 비슷해 무난한 선택입니다.",
    recommended: true,
    items: [
      { name: "스트로베리 필드", qty: 120, note: "캠페인으로 8% 더 팔림" },
      { name: "글레이즈드", qty: 96 },
      { name: "올드패션", qty: 80 },
      { name: "초코 트위스트", qty: 72 },
    ],
    notes: ["지난주 캠페인으로 도넛 주문이 좀 많았어요", "오후 배달은 조금 줄었어요"],
  },
  {
    id: "opt-b",
    label: "2주 전 같은 요일",
    basis: "3월 17일(월) 기준",
    description: "행사나 이벤트 영향이 없는 평상시 기준이에요. 넉넉하지 않지만 안전해요.",
    recommended: false,
    items: [
      { name: "스트로베리 필드", qty: 108 },
      { name: "글레이즈드", qty: 88 },
      { name: "올드패션", qty: 76 },
      { name: "초코 트위스트", qty: 68 },
    ],
    notes: ["행사 없었던 날 기준이라 안정적이에요", "재고가 남을 위험이 가장 낮아요"],
  },
  {
    id: "opt-c",
    label: "지난달 같은 요일",
    basis: "2월 24일(월) 기준",
    description: "한 달 전 같은 요일 기준이에요. 배달 주문이 지금보다 많았던 시기예요.",
    recommended: false,
    items: [
      { name: "스트로베리 필드", qty: 132 },
      { name: "글레이즈드", qty: 104 },
      { name: "올드패션", qty: 88 },
      { name: "초코 트위스트", qty: 80 },
    ],
    notes: ["배달 주문이 지금보다 12% 더 많았어요", "커피 같이 구매가 많았어요"],
  },
];

const INITIAL_SECONDS = 20 * 60;

export function OrderingPage() {
  const location = useLocation();
  const [seconds, setSeconds] = useState(INITIAL_SECONDS);
  const [submitted, setSubmitted] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const notificationState = location.state as { source?: string; notificationId?: number; focusOptionId?: string } | null;

  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted]);

  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  const isUrgent = seconds < 5 * 60;
  const isNotificationEntry = notificationState?.source === "notification" && notificationState?.notificationId === 2;

  const handleSelect = (id: string) => {
    setPendingId(id);
    setReason("");
    setShowReasonModal(true);
  };

  const handleSubmit = () => {
    if (!pendingId) return;
    setSelectedId(pendingId);
    setSubmitted(true);
    setShowReasonModal(false);
  };

  if (submitted) {
    const chosen = orderOptions.find((o) => o.id === selectedId);
    return (
      <div className="space-y-6">
        <PageHero
          title="주문 등록이 완료되었습니다."
          description="선택하신 수량으로 주문이 접수되었습니다."
        />
        <section className="rounded-[28px] border border-green-200 bg-green-50 px-8 py-8 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-green-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-lg font-bold text-green-800">주문 완료</p>
              <p className="mt-1 text-sm text-green-600">{chosen?.label} 기준으로 주문했어요</p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {chosen?.items.map((item) => (
                  <div key={item.name} className="rounded-xl bg-white px-3 py-2.5 shadow-sm">
                    <p className="text-xs text-slate-500">{item.name}</p>
                    <p className="text-lg font-bold text-slate-800 mt-0.5">{item.qty}개</p>
                  </div>
                ))}
              </div>
              {reason && (
                <div className="mt-4 rounded-xl bg-white px-4 py-3">
                  <p className="text-xs font-semibold text-slate-400">선택 이유</p>
                  <p className="mt-1 text-sm text-slate-700">"{reason}"</p>
                </div>
              )}
              <p className="mt-4 text-xs text-green-500">
                {new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })} 저장 완료
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHero
        title="오늘 주문할 수량을 선택해 주세요."
        description="과거 데이터를 바탕으로 3가지 기준을 제안해 드려요. 최종 결정은 사장님이 하세요."
      >
        <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${isUrgent ? "bg-red-50 text-red-600" : "bg-[#fff4e5] text-[#b76d10]"}`}>
          <Clock className="h-4 w-4" />
          주문 마감까지 {mins}:{secs} 남았어요
        </div>
      </PageHero>

      <StatsGrid stats={orderingStats} />

      {isNotificationEntry ? (
        <section className="rounded-[24px] border border-[#cfe0ff] bg-[#f3f7ff] px-5 py-4 shadow-[0_10px_24px_rgba(36,84,200,0.08)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold text-[#2454C8]">알림에서 바로 들어왔어요</p>
              <p className="mt-1 text-sm text-slate-600">
                주문 추천 3개 옵션이 준비되었습니다. 추천 옵션부터 확인하고 바로 선택하실 수 있습니다.
              </p>
            </div>
            <div className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-500">
              추천 기준: 지난주 같은 요일
            </div>
          </div>
        </section>
      ) : null}

      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">아래 3가지 중 하나를 선택해 주세요</p>
        <SectionHint questions={[
          { q: "왜 3가지를 보여주나요?", a: "비교할 수 있도록 지난주, 2주 전, 지난달 같은 요일 주문 기록을 보여드려요. 그날 날씨나 행사 영향도 함께 알려드려요." },
          { q: "꼭 선택해야 하나요?", a: "네, 주문 마감 전에 꼭 선택하셔야 해요. 안 하시면 주문이 누락될 수 있어요." },
          { q: "어떤 걸 선택하면 좋을까요?", a: "오늘 날씨와 비슷한 날 기준을 고르시면 좋아요. 특별한 이유가 없다면 '추천' 표시가 있는 것을 선택하세요." },
        ]} />
      </div>

      <section className="grid gap-5 xl:grid-cols-3">
        {orderOptions.map((option) => (
          <article
            key={option.id}
            className={`relative rounded-[28px] border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)] transition-all ${
              option.recommended ? "border-[#2454C8] ring-1 ring-[#2454C8]/20" : "border-border"
            } ${notificationState?.focusOptionId === option.id ? "shadow-[0_20px_40px_rgba(36,84,200,0.18)]" : ""}`}
          >
            {option.recommended ? (
              <div className="absolute -top-3 left-6">
                <span className="rounded-full bg-[#2454C8] px-3 py-1 text-xs font-bold text-white">추천</span>
              </div>
            ) : null}

            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900">{option.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{option.basis}</p>
              </div>
              <ShoppingCart className={`h-5 w-5 ${option.recommended ? "text-[#2454C8]" : "text-slate-300"}`} />
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-500">{option.description}</p>

            <div className="mt-4 space-y-2">
              {option.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-xl bg-[#f8fbff] px-3 py-2.5">
                  <span className="text-sm text-slate-700">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-800">{item.qty}개</span>
                    {item.note ? (
                      <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-600">{item.note}</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-1.5">
              {option.notes.map((note) => (
                <div key={note} className="flex items-start gap-2 text-xs text-slate-500">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                  {note}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleSelect(option.id)}
              className={`mt-5 w-full rounded-xl py-3.5 text-sm font-bold transition-colors ${
                option.recommended
                  ? "bg-[#2454C8] text-white hover:bg-[#1d44a8]"
                  : "border border-[#dce4f3] bg-[#f7faff] text-slate-700 hover:bg-[#eef4ff]"
              }`}
            >
              이 수량으로 주문하기
            </button>
          </article>
        ))}
      </section>

      {showReasonModal ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowReasonModal(false)}
            aria-label="닫기"
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-[420px] max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_32px_80px_rgba(16,32,51,0.18)]">
            <div className="bg-[linear-gradient(135deg,#1f4dbb_0%,#55a0ff_100%)] px-6 py-5 text-white">
              <p className="text-sm font-semibold text-white/70">최종 확인</p>
              <p className="mt-1 text-lg font-bold">{orderOptions.find((o) => o.id === pendingId)?.label}</p>
              <p className="text-sm text-white/70">{orderOptions.find((o) => o.id === pendingId)?.basis}</p>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  선택 이유를 간단히 적어주세요 <span className="font-normal text-slate-400">(안 적으셔도 돼요)</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="예: 오늘 날씨 좋아서 손님이 많을 것 같아서"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-[#dce4f3] bg-[#f7faff] px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowReasonModal(false)}
                  className="flex-1 rounded-xl border border-[#dce4f3] bg-[#f7faff] py-3.5 text-sm font-semibold text-slate-600 hover:bg-[#eef4ff]"
                >
                  다시 선택
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 rounded-xl bg-[#2454C8] py-3.5 text-sm font-bold text-white hover:bg-[#1d44a8]"
                >
                  주문 완료
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
