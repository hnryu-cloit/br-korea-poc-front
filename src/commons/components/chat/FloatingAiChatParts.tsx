import {
  ArrowRight,
  ChevronDown,
  ClipboardList,
  GraduationCap,
  MessageCircleQuestion,
  ScrollText,
  SearchCheck,
  Sparkles,
  X,
} from "lucide-react";
import type { ReactNode, RefObject } from "react";

import ai_pencil from "@/assets/ai-pencil.svg";
import type {
  FloatingAiChatAgentTrace,
  FloatingAiChatAnswerStatus,
  NormalizedFloatingAiChatResponse,
} from "@/commons/components/chat/floating-ai-chat-utils";
import { dedupeStrings } from "@/commons/utils/chat-text-utils";
import { cn } from "@/lib/utils";

export type FloatingAiChatSuggestion = {
  label: string;
  prompt: string;
};

export type FloatingAiChatConversationItem =
  | {
      id: number;
      role: "user";
      text: string;
    }
  | {
      id: number;
      role: "assistant";
      prompt: string;
      status: FloatingAiChatAnswerStatus;
      answer: NormalizedFloatingAiChatResponse;
    };

type ChatHeaderProps = {
  subtitle: string;
  storeName: string;
  onClose: () => void;
};

export function ChatHeader({ subtitle, storeName, onClose }: ChatHeaderProps) {
  return (
    <div className="shrink-0 px-3 py-4">
      <div className="flex items-start justify-between gap-4 px-3">
        <div className="flex flex-col gap-3">
          <p className="text-[#B34816] font-bold text-md">안녕하세요, {storeName} 점주님</p>
          <div className="flex items-center gap-3">
            <img src={ai_pencil} className="w-[28px]" alt="" />
            <div className="min-w-0">
              <p className="text-brown-700 text-[18px] font-medium">
                {subtitle}
                <br />
                어떤 작업이 필요하신가요?
              </p>
            </div>
          </div>
        </div>

        <button type="button" onClick={onClose} aria-label="닫기">
          <X className="h-[28px] w-[28px] text-brown-700" />
        </button>
      </div>
    </div>
  );
}

function UserMessageBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-[24px_24px_4px_24px] bg-[#F1F5F9] px-4 py-2.5 text-md text-brown-700">
        {text}
      </div>
    </div>
  );
}

function ChatLoadingBubble() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] rounded-[24px_24px_24px_4px] bg-[#FFF1E6] px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#FFC9AC]" />
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#FF874D] [animation-delay:120ms]" />
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#FF671F] [animation-delay:240ms]" />
        </div>
        <p className="mt-3 text-md text-brown-700">답변을 불러오는 중입니다.</p>
      </div>
    </div>
  );
}

const iconList = [
  { title: "이렇게 다시 물어보세요", icon: <GraduationCap className="h-5 w-5 text-orange-500" /> },
  { title: "근거 보기", icon: <ScrollText className="h-5 w-5 text-orange-500" /> },
  { title: "처리 기준 보기", icon: <SearchCheck className="h-5 w-5 text-orange-500" /> },
  { title: "바로 할 일", icon: <ClipboardList className="h-5 w-5 text-orange-500" /> },
  { title: "이어서 물어보기", icon: <MessageCircleQuestion className="h-5 w-5 text-orange-500" /> },
];

function SectionTitle({
  title,
  description,
  icon,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        {icon ?? <Sparkles className="h-5 w-5 text-orange-500" />}
        <p className="text-md font-bold text-brown-700">{title}</p>
      </div>
      {description ? <p className="text-xs leading-5 text-[#653819]">{description}</p> : null}
    </div>
  );
}

function getSectionIcon(title: string) {
  return iconList.find((item) => item.title === title)?.icon;
}

function QuestionChipButton({
  label,
  prompt,
  onClick,
  disabled,
  compact,
}: {
  label: string;
  prompt: string;
  onClick: (prompt: string) => void | Promise<void>;
  disabled?: boolean;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(prompt)}
      disabled={disabled}
      className={cn(
        "group flex w-full items-center gap-3 rounded-[16px] border-[2px] border-transparent bg-[linear-gradient(#fff,#fff),linear-gradient(180deg,#FF6E00_0%,#DA1884_100%)] [background-origin:border-box] [background-clip:padding-box,border-box] px-2 text-left text-sm font-bold text-[#FF671F] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
        compact ? "py-1.5" : "py-2",
      )}
    >
      <span className="mt-0.5 rounded-full bg-[#FFF4E5] p-1.5 text-[#DA1884]">
        <Sparkles className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block">{label}</span>
      </span>
      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#DA1884] transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

export function ChatInitialSuggestions({
  suggestions,
  onQuestionClick,
  disabled,
}: {
  suggestions: FloatingAiChatSuggestion[];
  onQuestionClick: (prompt: string) => void | Promise<void>;
  disabled?: boolean;
}) {
  if (suggestions.length === 0) return null;

  return (
    <section className="bg-white p-2">
      <SectionTitle
        title="현재 화면 데이터를 바탕으로 빠르게 질문할 수 있어요."
        description="궁금한 내용을 선택하거나 직접 입력해 주세요."
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {suggestions.map((item) => (
          <QuestionChipButton
            key={`${item.prompt}-${item.label}`}
            label={item.label}
            prompt={item.prompt}
            onClick={onQuestionClick}
            disabled={disabled}
          />
        ))}
      </div>
    </section>
  );
}

export function AnswerActionList({ actions }: { actions: string[] }) {
  if (actions.length === 0) return null;

  return (
    <section className="space-y-2">
      <SectionTitle title="바로 할 일" description="지금 바로 적용할 수 있는 권장 액션입니다." />
      <div className="space-y-2">
        {actions.map((action, index) => (
          <div
            key={`${action}-${index}`}
            className="flex items-start gap-2 rounded-xl border border-[#FFB38F] bg-[#FFD9C71A] px-3 py-2 text-sm font-medium text-[#41352E]"
          >
            <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-[#DA1884]" />
            <span>{action}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProcessingCriteriaItems({ agentTrace }: { agentTrace: FloatingAiChatAgentTrace }) {
  if (!agentTrace.sql) {
    return (
      <li className="rounded-xl bg-[#F8FAFC] px-3 py-2 text-sm leading-6 text-[#64748B]">
        처리 기준이 없어요. 답변이 없어 SQL 기준을 확인할 수 없습니다.
      </li>
    );
  }

  return (
    <li className="rounded-xl bg-[#FFF9F4] px-3 py-2 text-sm text-[#41352E]">
      <span className="block text-[11px] font-semibold uppercase tracking-wide text-[#B45309]">
        sql
      </span>
      <span className="mt-1 block whitespace-pre-wrap break-words text-[13px] leading-5">
        {agentTrace.sql}
      </span>
    </li>
  );
}

export function AnswerEvidenceAccordion({
  icon,
  evidence,
  agentTrace,
}: {
  icon?: ReactNode;
  evidence: string[];
  agentTrace: FloatingAiChatAgentTrace;
}) {
  if (evidence.length === 0 && !agentTrace.sql) {
    return null;
  }

  return (
    <details className="rounded-xl border border-[#F7E6D7] bg-white px-4 py-3">
      <summary className="cursor-pointer list-none">
        <div className="flex items-center justify-between gap-3">
          <SectionTitle title="근거 / 처리 기준" icon={icon} />
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
        </div>
      </summary>
      <div className="mt-3 border-t border-[#F7E6D7] pt-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#653819]">근거</p>
            <ul className="flex flex-col gap-1 bg-[#FFF9F4] px-3 py-2 rounded-xl">
              {evidence.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="text-sm leading-6 text-[#41352E] list-disc list-inside"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#653819]">
              처리 기준
            </p>
            <ul className="space-y-2">
              <ProcessingCriteriaItems agentTrace={agentTrace} />
            </ul>
          </div>
        </div>
      </div>
    </details>
  );
}

export function FollowUpQuestionList({
  title,
  description,
  icon,
  questions,
  onQuestionClick,
  disabled,
  compact,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  questions: string[];
  onQuestionClick: (prompt: string) => void | Promise<void>;
  disabled?: boolean;
  compact?: boolean;
}) {
  if (questions.length === 0) return null;

  return (
    <section className="space-y-2">
      <SectionTitle title={title} description={description} icon={icon} />
      <div className={cn("flex flex-wrap gap-2", compact ? "gap-2" : "gap-3")}>
        {questions.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => onQuestionClick(question)}
            disabled={disabled}
            className={cn(
              "rounded-full border-[2px] border-transparent bg-[linear-gradient(#fff,#fff),linear-gradient(180deg,#FF6E00_0%,#DA1884_100%)] [background-origin:border-box] [background-clip:padding-box,border-box] text-left font-bold text-[#DA1884] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
              compact ? "max-w-full px-3.5 py-1.5 text-[11px]" : "px-3.5 py-2 text-xs",
            )}
          >
            {question}
          </button>
        ))}
      </div>
    </section>
  );
}

function ResponseCardShell({ children }: { children: ReactNode }) {
  return <div className="rounded-[16px] border border-[#F7E6D7] bg-white p-4">{children}</div>;
}

function ChatMissState({
  message,
  onQuestionClick,
  disabled,
}: {
  message: Extract<FloatingAiChatConversationItem, { role: "assistant" }>;
  onQuestionClick: (prompt: string) => void | Promise<void>;
  disabled?: boolean;
}) {
  const answer = message.answer;
  const followUps = dedupeStrings([
    ...answer.followUpQuestions,
    ...(answer.agentTrace.overlapCandidates ?? []),
  ]).slice(0, 4);

  return (
    <ResponseCardShell>
      <div className="space-y-4">
        <div className="rounded-xl bg-[#FFF4E5] px-4 py-3">
          <p className="text-sm font-semibold text-[#B45309]">답변 없음 안내</p>
          <p className="mt-1 text-sm leading-6 text-[#B45309]/90">
            질문과 정확히 일치하는 분석 답변을 찾지 못했어요.
            <br />
            아래 추천 질문을 선택하거나, 기간/상품/지표를 더 구체적으로 입력해 주세요.
          </p>
        </div>

        <FollowUpQuestionList
          title="이렇게 다시 물어보세요"
          icon={getSectionIcon("이렇게 다시 물어보세요")}
          questions={followUps}
          onQuestionClick={onQuestionClick}
          disabled={disabled}
        />

        <AnswerEvidenceAccordion
          icon={getSectionIcon("근거 보기")}
          evidence={answer.evidence}
          agentTrace={answer.agentTrace}
        />
      </div>
    </ResponseCardShell>
  );
}

function ChatEmptyState({
  message,
  onQuestionClick,
  disabled,
}: {
  message: Extract<FloatingAiChatConversationItem, { role: "assistant" }>;
  onQuestionClick: (prompt: string) => void | Promise<void>;
  disabled?: boolean;
}) {
  const answer = message.answer;
  const followUps = dedupeStrings([...answer.followUpQuestions]).slice(0, 4);

  return (
    <ResponseCardShell>
      <div className="space-y-4">
        <div className="rounded-xl bg-[#FFF9F4] px-4 py-3">
          <p className="text-sm font-semibold text-[#41352E]">조회 결과 없음</p>
          <p className="mt-1 text-sm leading-6 text-[#653819]">
            조건에 해당하는 데이터를 찾지 못했어요.
            <br />
            기간, 상품, 지표 조건을 바꿔 다시 질문해 주세요.
          </p>
        </div>

        <AnswerEvidenceAccordion
          icon={getSectionIcon("근거 보기")}
          evidence={answer.evidence}
          agentTrace={answer.agentTrace}
        />

        <FollowUpQuestionList
          title="추천 질문"
          questions={followUps}
          onQuestionClick={onQuestionClick}
          disabled={disabled}
          compact
        />
      </div>
    </ResponseCardShell>
  );
}

function ChatBlockedState() {
  return (
    <ResponseCardShell>
      <div className="space-y-3">
        <div className="rounded-xl bg-[#FFF4E5] px-4 py-3">
          <p className="text-sm font-semibold text-[#B45309]">제한 안내</p>
          <p className="mt-1 text-sm leading-6 text-[#B45309]/90">
            현재 질문은 답변할 수 없어요. 표현을 바꿔 다시 질문해 주세요.
          </p>
        </div>
      </div>
    </ResponseCardShell>
  );
}

function ChatErrorState({
  message,
  onRetry,
  disabled,
}: {
  message: Extract<FloatingAiChatConversationItem, { role: "assistant" }>;
  onRetry?: (prompt: string) => void | Promise<void>;
  disabled?: boolean;
}) {
  return (
    <ResponseCardShell>
      <div className="space-y-3">
        <div className="rounded-xl bg-[#F8FAFC] px-4 py-3">
          <p className="text-sm font-semibold text-[#41352E]">
            답변을 불러오는 중 문제가 발생했어요.
          </p>
          <p className="mt-1 text-sm leading-6 text-[#653819]">잠시 후 다시 시도해 주세요.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onRetry?.(message.prompt)}
            disabled={disabled}
            className="rounded-full bg-[#DA1884] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c11274] disabled:cursor-not-allowed disabled:bg-[#f5b5d2]"
          >
            다시 시도
          </button>
          <span className="text-xs text-[#653819]">입력한 내용은 그대로 유지됩니다.</span>
        </div>
      </div>
    </ResponseCardShell>
  );
}

function ChatSuccessState({
  message,
  onQuestionClick,
  disabled,
}: {
  message: Extract<FloatingAiChatConversationItem, { role: "assistant" }>;
  onQuestionClick: (prompt: string) => void | Promise<void>;
  disabled?: boolean;
}) {
  const answer = message.answer;
  const followUps = dedupeStrings([
    ...answer.followUpQuestions,
    ...(answer.agentTrace.overlapCandidates ?? []),
  ]).slice(0, 4);

  return (
    <ResponseCardShell>
      <div className="space-y-4">
        <div className="space-y-2">
          <SectionTitle title="답변 요약" description="API 응답에서 정규화한 본문입니다." />
          <p className="whitespace-pre-wrap rounded-[8px] bg-[#FFF1E6] px-4 py-3 text-sm leading-7 text-brown-700">
            {answer.text}
          </p>
        </div>

        <AnswerEvidenceAccordion
          icon={getSectionIcon("근거 보기")}
          evidence={answer.evidence}
          agentTrace={answer.agentTrace}
        />

        <AnswerActionList actions={answer.actions} />

        <FollowUpQuestionList
          title="이어서 물어보기"
          icon={getSectionIcon("이어서 물어보기")}
          questions={followUps}
          onQuestionClick={onQuestionClick}
          disabled={disabled}
          compact
        />
      </div>
    </ResponseCardShell>
  );
}

export function ChatContent({
  messages,
  suggestions,
  onQuestionClick,
  onRetry,
  isSending,
  scrollRef,
}: {
  messages: FloatingAiChatConversationItem[];
  suggestions: FloatingAiChatSuggestion[];
  onQuestionClick: (prompt: string) => void | Promise<void>;
  onRetry?: (prompt: string) => void | Promise<void>;
  isSending: boolean;
  scrollRef: RefObject<HTMLDivElement>;
}) {
  return (
    <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-white px-6 py-4">
      {messages.length === 0 && !isSending ? (
        <ChatInitialSuggestions
          suggestions={suggestions}
          onQuestionClick={onQuestionClick}
          disabled={isSending}
        />
      ) : null}

      {messages.map((message) =>
        message.role === "user" ? (
          <UserMessageBubble key={message.id} text={message.text} />
        ) : message.status === "success" ? (
          <ChatSuccessState
            key={message.id}
            message={message}
            onQuestionClick={onQuestionClick}
            disabled={isSending}
          />
        ) : message.status === "miss" ? (
          <ChatMissState
            key={message.id}
            message={message}
            onQuestionClick={onQuestionClick}
            disabled={isSending}
          />
        ) : message.status === "empty" ? (
          <ChatEmptyState
            key={message.id}
            message={message}
            onQuestionClick={onQuestionClick}
            disabled={isSending}
          />
        ) : message.status === "blocked" ? (
          <ChatBlockedState key={message.id} />
        ) : (
          <ChatErrorState
            key={message.id}
            message={message}
            onRetry={onRetry}
            disabled={isSending}
          />
        ),
      )}

      {isSending ? <ChatLoadingBubble /> : null}
    </div>
  );
}

export function ChatBody({
  messages,
  suggestions,
  onQuestionClick,
  onRetry,
  isSending,
  scrollRef,
  input,
  onChangeInput,
  onSubmit,
  placeholder,
}: {
  messages: FloatingAiChatConversationItem[];
  suggestions: FloatingAiChatSuggestion[];
  onQuestionClick: (prompt: string) => void | Promise<void>;
  onRetry?: (prompt: string) => void | Promise<void>;
  isSending: boolean;
  scrollRef: RefObject<HTMLDivElement>;
  input: string;
  onChangeInput: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-hidden rounded-[12px] bg-white flex flex-col">
      <ChatContent
        messages={messages}
        suggestions={suggestions}
        onQuestionClick={onQuestionClick}
        onRetry={onRetry}
        isSending={isSending}
        scrollRef={scrollRef}
      />
      <div className="shrink-0 border-t border-[#F7E6D7] bg-white">
        <ChatInput
          value={input}
          onChange={onChangeInput}
          onSubmit={onSubmit}
          disabled={isSending}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-2 rounded-[16px] border border-[#CAD5E2] bg-white px-4.5 py-2">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSubmit();
            }
          }}
          placeholder={placeholder ?? "궁금한 것을 물어보세요."}
          className="flex-1 bg-transparent text-md text-brown-700 outline-none placeholder:text-[#90A1B9]"
          disabled={disabled}
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6E00] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[#FFD9C7]"
        >
          <ArrowRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
