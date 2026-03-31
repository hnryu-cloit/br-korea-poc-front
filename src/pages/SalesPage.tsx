import { useState, useRef, useEffect } from "react";
import { Send, BarChart3 } from "lucide-react";

import { salesStats } from "@/data/page-content";
import { SectionHint } from "@/components/ui/SectionHint";
import { PageHero, StatsGrid } from "@/pages/shared";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
  evidence?: string[];
  actions?: string[];
};

type SuggestedPrompt = {
  label: string;
  category: string;
  prompt: string;
};

const suggestedPrompts: SuggestedPrompt[] = [
  { label: "배달 주문이 줄었어요", category: "배달", prompt: "이번 주 배달 건수가 지난주보다 줄어든 원인을 알려줘" },
  { label: "행사 효과가 궁금해요", category: "캠페인", prompt: "T-day 행사 이후 매출과 재방문 영향이 어땠는지 분석해줘" },
  { label: "오전 시간대 매출 비교", category: "시간대", prompt: "오전 10시부터 12시까지 채널별 매출 차이를 비교해줘" },
  { label: "도넛+커피 묶음 늘리는 방법", category: "상품", prompt: "도넛과 커피 묶음 판매를 늘리기 위한 액션을 제안해줘" },
  { label: "작년 같은 달과 비교", category: "매출", prompt: "전년 동월 대비 이번 달 매출 차이를 분석해줘" },
  { label: "쿠폰 효과가 없어진 것 같아요", category: "마케팅", prompt: "앱 쿠폰 사용률 하락 원인과 개선 방법을 알려줘" },
  { label: "점심 배달이 안 들어와요", category: "운영", prompt: "점심 시간대 배달 전환율이 낮은 이유를 분석해줘" },
  { label: "단골 손님이 줄었나요?", category: "고객", prompt: "최근 2주간 재방문 고객 비율 변화와 액션을 알려줘" },
  { label: "배달앱 vs 홀 수익 비교", category: "수익", prompt: "배달앱과 홀 채널의 이익률 차이를 비교해줘" },
  { label: "다음 달 잘 팔릴 상품은?", category: "상품", prompt: "다음 달 시즌 수요를 반영한 상품 믹스를 추천해줘" },
];

const mockResponses: Record<string, Pick<ChatMessage, "text" | "evidence" | "actions">> = {
  "이번 주 배달 건수가 지난주보다 줄어든 원인을 알려줘": {
    text: "이번 주 배달 주문이 지난주보다 14.3% 줄었어요. 가장 큰 이유는 점심 시간(11~13시)에 앱 주문이 덜 들어온 것과, 쿠폰이 소진된 영향이에요. 배달앱에서 우리 매장 노출 순위도 3위에서 5위로 내려갔어요.",
    evidence: ["점심 시간대 배달 주문 21건 감소", "앱 쿠폰 사용률 38% → 22%로 하락", "배달앱 노출 순위 3위 → 5위"],
    actions: ["점심 시간대 배달 전용 쿠폰 다시 발급하기", "배달앱 광고비 조정 검토하기", "도넛+음료 묶음 배달 특가 만들기"],
  },
  "T-day 행사 이후 매출과 재방문 영향이 어땠는지 분석해줘": {
    text: "T-day 행사(3월 21일) 이후 3일 동안 재방문 손님이 12.4% 늘었어요. 행사에 참여한 손님 중 34%가 일주일 안에 다시 오셨어요. 특히 커피와 도넛 세트를 함께 사신 분이 많았어요.",
    evidence: ["행사 후 3일간 재방문율 +12.4%", "커피+도넛 세트 구매 +28%", "신규 앱 설치 전날 대비 41건 증가"],
    actions: ["커피+도넛 세트 상시 메뉴로 만들기", "행사 참여 손님에게 7일 후 쿠폰 보내기"],
  },
  "오전 10시부터 12시까지 채널별 매출 차이를 비교해줘": {
    text: "오전 10~12시에는 매장 방문 손님이 전체 매출의 58%를 차지하고, 배달은 28%, 앱 주문은 14% 정도예요. 근처 비슷한 매장들보다 배달 비중이 낮아서, 오전 배달을 늘릴 여지가 있어요.",
    evidence: ["매장 방문 58% · 배달 28% · 앱 14%", "비슷한 매장 평균 매장 방문 49%", "오전 10~11시에 아메리카노 단품 주문 집중"],
    actions: ["오전 배달 전용 할인 테스트해보기", "앱 오전 알림 시간대 조정하기"],
  },
};

function getResponse(prompt: string): Pick<ChatMessage, "text" | "evidence" | "actions"> {
  if (mockResponses[prompt]) return mockResponses[prompt];
  return {
    text: `말씀하신 내용을 분석했어요. 데이터를 살펴보니 유의미한 패턴이 확인됩니다. 아래에서 확인하신 데이터와 할 수 있는 것들을 정리해 드렸어요.`,
    evidence: ["데이터 분석 완료", "관련 기간 데이터 비교 완료", "매장 맞춤 분석 적용"],
    actions: ["데이터 기반 실행 방안 검토 권고", "상세 내용은 담당자에게 문의하세요"],
  };
}

let msgId = 1;

export function SalesPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { id: msgId++, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const reply = getResponse(text);
      setMessages((prev) => [...prev, { id: msgId++, role: "assistant", ...reply }]);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      <PageHero
        title="매출 현황"
        description="궁금한 것을 물어보시면 분석해 드려요."
      />
      <StatsGrid stats={salesStats} />

      <section className="grid gap-5 xl:grid-cols-[1fr_300px]">
        {/* Chat area */}
        <div className="flex flex-col rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)] overflow-hidden" style={{ minHeight: 520 }}>
          <div className="flex items-center justify-between gap-3 border-b border-border/60 px-6 py-4">
            <div>
              <p className="text-sm font-bold text-slate-800">매출 분석</p>
              <p className="text-xs text-slate-400 mt-0.5">아래에 궁금한 내용을 입력하거나 오른쪽 버튼을 눌러보세요</p>
            </div>
            <SectionHint questions={[
              { q: "어떻게 물어보면 되나요?", a: "평소 말하듯이 입력하시면 돼요. 예를 들어 '이번 주 배달이 왜 줄었나요?' 처럼 입력하면 분석해 드려요." },
              { q: "오른쪽 버튼은 뭔가요?", a: "자주 묻는 질문들이에요. 버튼을 누르면 바로 분석해 드려요. 직접 입력하기 어려우시면 눌러보세요." },
            ]} />
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5" style={{ maxHeight: 420 }}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <BarChart3 className="h-10 w-10 text-slate-200 mb-3" />
                <p className="text-sm font-medium text-slate-400">오른쪽에서 질문을 선택하거나</p>
                <p className="text-sm text-slate-400">아래에 직접 입력해 보세요</p>
              </div>
            ) : null}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "user" ? (
                  <div className="max-w-[80%] rounded-[20px] rounded-br-sm bg-[#2454C8] px-4 py-3 text-sm text-white">
                    {msg.text}
                  </div>
                ) : (
                  <div className="max-w-[90%] space-y-3">
                    <div className="rounded-[20px] rounded-bl-sm border border-border bg-[#f8fbff] px-5 py-4">
                      <p className="text-sm leading-6 text-slate-700">{msg.text}</p>

                      {msg.evidence ? (
                        <div className="mt-3 space-y-1.5">
                          <p className="text-[11px] font-bold text-slate-400">확인한 데이터</p>
                          {msg.evidence.map((e) => (
                            <div key={e} className="rounded-xl bg-white px-3 py-2 text-xs text-slate-500 shadow-sm">{e}</div>
                          ))}
                        </div>
                      ) : null}

                      {msg.actions ? (
                        <div className="mt-3 space-y-1.5">
                          <p className="text-[11px] font-bold text-slate-400">할 수 있는 것</p>
                          {msg.actions.map((a) => (
                            <div key={a} className="flex items-start gap-2 rounded-xl bg-[#EDF3FF] px-3 py-2 text-xs font-medium text-[#2454C8]">
                              <span className="material-symbols-outlined text-[14px] shrink-0 mt-0.5">task_alt</span>
                              {a}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading ? (
              <div className="flex justify-start">
                <div className="rounded-[20px] rounded-bl-sm border border-border bg-[#f8fbff] px-5 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    분석 중...
                  </div>
                </div>
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-border/60 px-4 py-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="예: 이번 주 배달이 왜 줄었을까요?"
                className="flex-1 rounded-xl border border-[#dce4f3] bg-[#f7faff] px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2454C8] text-white hover:bg-[#1d44a8] disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Suggested prompts */}
        <div className="rounded-[28px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
          <p className="text-sm font-bold text-slate-800 mb-1">자주 묻는 질문</p>
          <p className="text-xs text-slate-400 mb-4">버튼을 누르면 바로 분석해요</p>
          <div className="space-y-2">
            {suggestedPrompts.map((p) => (
              <button
                key={p.prompt}
                type="button"
                onClick={() => sendMessage(p.prompt)}
                className="w-full text-left rounded-2xl border border-border bg-[#f8fbff] px-4 py-3 text-sm transition-colors hover:border-[#bfd1ed] hover:bg-[#eef4ff]"
              >
                <p className="text-sm font-semibold text-slate-700">{p.label}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
