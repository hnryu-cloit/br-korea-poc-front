import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Bot, Sparkles, X } from "lucide-react";

type Message = {
  id: number;
  title: string;
  content: string;
  evidence: string[];
};

type QuickAction = {
  label: string;
  prompt: string;
};

type RouteGuide = {
  title: string;
  subtitle: string;
  quickActions: QuickAction[];
};

const routeGuides: Record<string, RouteGuide> = {
  "/": {
    title: "통합 운영 해설",
    subtitle: "현재 화면의 핵심 리스크와 바로 해야 할 조치를 요약합니다.",
    quickActions: [
      { label: "품절 위험", prompt: "지금 가장 먼저 대응해야 할 품절 위험을 알려줘" },
      { label: "주문 검토", prompt: "주문 마감 전에 꼭 봐야 할 포인트를 정리해줘" },
      { label: "분석 요약", prompt: "오늘 매출 분석에서 바로 실행할 인사이트를 알려줘" },
    ],
  },
  "/analytics": {
    title: "질의형 분석 해설",
    subtitle: "SQL/API 우선 처리 경로와 LLM 호출 최소화 구조를 설명합니다.",
    quickActions: [
      { label: "라우팅 설명", prompt: "이 질의가 왜 SQL 우선 처리되는지 설명해줘" },
      { label: "토큰 절감", prompt: "LLM 토큰 사용량을 줄이는 방법을 알려줘" },
      { label: "분석 구조", prompt: "RAG 출처 응답 구조를 짧게 설명해줘" },
    ],
  },
  "/hq/coaching": {
    title: "주문 코칭 해설",
    subtitle: "미완료 매장 대응과 코칭 포인트를 정리합니다.",
    quickActions: [
      { label: "미완료 대응", prompt: "주문 미완료 매장에 어떻게 대응해야 하는지 알려줘" },
      { label: "옵션 코칭", prompt: "전월 동요일 선택 시 주의할 점을 설명해줘" },
      { label: "알림 발송", prompt: "긴급 알림 발송 기준과 내용을 알려줘" },
    ],
  },
  "/hq/inspection": {
    title: "생산 점검 해설",
    subtitle: "준수율 낮은 매장 개선 방법과 코칭 포인트를 정리합니다.",
    quickActions: [
      { label: "개선 방안", prompt: "생산 알림 미대응 매장 개선 방법을 알려줘" },
      { label: "찬스 로스", prompt: "찬스 로스가 높은 매장의 원인을 분석해줘" },
      { label: "방문 점검", prompt: "본사 현장 방문 점검 체크리스트를 알려줘" },
    ],
  },
  "/signals": {
    title: "매출 시그널 해설",
    subtitle: "긴급 시그널 우선순위와 본사 개입 기준을 설명합니다.",
    quickActions: [
      { label: "긴급 대응", prompt: "긴급 시그널 중 가장 먼저 대응해야 할 것은?" },
      { label: "배달 감소", prompt: "배달 급감 시그널에 본사가 할 수 있는 조치를 알려줘" },
      { label: "리타겟팅", prompt: "T-day 재방문율 시그널을 마케팅에 활용하는 방법은?" },
    ],
  },
  "/production": {
    title: "생산 관리 해설",
    subtitle: "예측 재고, 생산 패턴, 알림 시점을 함께 보고 대응 우선순위를 정리합니다.",
    quickActions: [
      { label: "왜 위험한가", prompt: "어떤 SKU가 왜 1시간 내 품절 위험인지 설명해줘" },
      { label: "생산 시점", prompt: "지금 생산 등록이 필요한 시점을 추천해줘" },
      { label: "찬스 로스", prompt: "생산 타이밍을 놓치면 찬스 로스가 얼마나 생기는지 알려줘" },
    ],
  },
  "/ordering": {
    title: "주문 관리 해설",
    subtitle: "3개 옵션과 특이사항을 비교하고 점주 선택 근거를 정리합니다.",
    quickActions: [
      { label: "추천 옵션", prompt: "지금 3개 주문 옵션 중 어떤 안을 추천하는지 말해줘" },
      { label: "특이사항", prompt: "캠페인이나 이상치 때문에 주의할 점을 알려줘" },
      { label: "선택 사유", prompt: "점주가 입력할 선택 사유 예시를 작성해줘" },
    ],
  },
  "/sales": {
    title: "매출 분석 해설",
    subtitle: "자연어 질의 결과를 액션 중심으로 요약해 보여줍니다.",
    quickActions: [
      { label: "배달 감소", prompt: "배달 건수 감소 원인과 대응 액션을 알려줘" },
      { label: "상품 전략", prompt: "상품 믹스를 개선할 수 있는 실행안을 제안해줘" },
      { label: "보고용 한 줄", prompt: "점주에게 보여줄 요약 문장을 한 줄로 만들어줘" },
    ],
  },
  "/orchestration": {
    title: "보안 정책 해설",
    subtitle: "질의 라우팅, 민감정보 보호, 감사 로그 기준을 화면 문맥으로 해설합니다.",
    quickActions: [
      { label: "라우팅 설명", prompt: "이 질의는 왜 SQL/API 우선 처리가 맞는지 설명해줘" },
      { label: "마스킹 기준", prompt: "현재 화면에서 마스킹해야 할 민감정보를 정리해줘" },
      { label: "출처 응답", prompt: "RAG 출처 응답 구조를 짧게 설명해줘" },
    ],
  },
};

function buildReply(pathname: string, prompt: string): Message {
  if (pathname === "/production") {
    return {
      id: 1,
      title: "생산 대응 제안",
      content:
        "스트로베리 필드와 올드패션은 최근 30분 판매 속도가 평시보다 높아 1시간 내 품절 위험이 큽니다. 14:20 전 2차 생산을 등록하고, 알림 메시지에는 현재고와 1시간 후 추정 재고를 같이 노출하는 편이 맞습니다.",
      evidence: ["현재고 52개", "1시간 후 예측 8개", "4주 평균 2차 생산 14:15 / 40개"],
    };
  }

  if (pathname === "/ordering") {
    return {
      id: 1,
      title: "주문 옵션 비교",
      content:
        "현재는 전주 동요일 안이 기본 추천이지만, 캠페인 영향으로 과주문 가능성이 있어 전전주 동요일 값을 기준선으로 함께 보여주는 것이 안전합니다. 점주 선택 화면에는 추천 사유와 반대 사유를 같이 두는 편이 좋습니다.",
      evidence: ["옵션 A 최근 패턴 일치", "옵션 B 이상치 적음", "옵션 C 월간 시즌성 반영"],
    };
  }

  if (pathname === "/sales") {
    return {
      id: 1,
      title: "매출 분석 액션",
      content:
        "배달 채널 감소는 단순 요약보다 점심 시간대 전환율 하락과 쿠폰 회수율 저하를 같이 보여줘야 바로 행동으로 이어집니다. 응답은 원인, 근거, 실행안 3단 구조가 가장 적합합니다.",
      evidence: ["11시~13시 배달 주문 감소", "앱 쿠폰 사용률 하락", "점심 세트 묶음 전환 저조"],
    };
  }

  if (pathname === "/orchestration") {
    return {
      id: 1,
      title: "정책 점검 요약",
      content:
        "매출과 손익 수치는 원문 그대로 LLM에 보내지 말고 집계값과 필요한 컬럼만 전달하는 쪽이 맞습니다. 민감정보 요청은 조회형 응답으로 다운그레이드하고, 최종 응답에는 출처와 로그 식별자를 남겨야 합니다.",
      evidence: ["FAQ/조회/분석/민감정보 요청 분류", "SQL/API 우선 처리", "감사 로그 저장"],
    };
  }

  return {
    id: 1,
    title: "운영 허브 요약",
    content:
      "현재 화면에서는 생산 리스크, 주문 마감 임박, 매출 질문 추천, 보안 정책 상태를 같은 맥락으로 보는 것이 중요합니다. 점주가 가장 먼저 할 일을 카드 단위로 제시하고, 상세 설명은 AI 패널에서 보조하는 구성이 적합합니다.",
    evidence: [prompt, "생산/주문/매출/보안 통합 맥락", "점주 승인형 의사결정 보조"],
  };
}

export function FloatingAiChat() {
  const location = useLocation();
  const guide = useMemo(() => routeGuides[location.pathname] ?? routeGuides["/"], [location.pathname]);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<Message>(() => buildReply(location.pathname, guide.quickActions[0].prompt));

  const runAction = (prompt: string) => {
    setMessage(buildReply(location.pathname, prompt));
    setIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,#1f4dbb_0%,#55a0ff_100%)] px-5 py-4 text-white shadow-[0_18px_38px_rgba(31,77,187,0.32)] transition-transform hover:-translate-y-0.5"
      >
        <Bot className="h-5 w-5" />
        <span className="text-sm font-semibold">도움말</span>
      </button>

      {isOpen ? (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[28px] border border-[#d8e5ff] bg-white shadow-[0_24px_60px_rgba(31,77,187,0.2)]">
          <div className="flex items-start justify-between gap-4 bg-[linear-gradient(135deg,#1f4dbb_0%,#55a0ff_100%)] px-5 py-5 text-white">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
                <Sparkles className="h-4 w-4" />
                AI 도우미
              </div>
              <p className="mt-3 text-lg font-semibold">{guide.title}</p>
              <p className="mt-2 text-sm leading-6 text-white/80">{guide.subtitle}</p>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="해설 닫기">
              <X className="h-4 w-4 text-white/80" />
            </button>
          </div>

          <div className="space-y-5 px-5 py-5">
            <div>
              <p className="text-xs font-semibold text-slate-400">바로 물어보기</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {guide.quickActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => runAction(action.prompt)}
                    className="rounded-full border border-[#d8e5ff] bg-[#f7faff] px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-[#eef4ff]"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-[#f8fbff] px-4 py-4">
              <p className="text-sm font-semibold text-slate-900">{message.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{message.content}</p>
              <div className="mt-4 space-y-2">
                {message.evidence.map((item) => (
                  <div key={item} className="rounded-2xl bg-white px-3 py-2 text-xs text-slate-500 shadow-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
