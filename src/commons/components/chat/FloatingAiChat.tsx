import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { FloatingAiChatButton } from "@/commons/components/chat/FloatingAiChatButton";
import { FloatingAiChatPanel } from "@/commons/components/chat/FloatingAiChatPanel";
import { floatingAiCardContexts } from "@/commons/constants/floating-ai-card-contexts";
import { floatingAiChatRouteGuides } from "@/commons/constants/floating-ai-chat";
import { useFloatingAiChat } from "@/commons/hooks/useFloatingAiChat";
import type {
  ChatEntry,
  ChatHistoryEntry,
  FloatingAiChatRouteGuide,
} from "@/commons/types/floating-ai-chat";
import { extractCandidateText, dedupeStrings } from "@/commons/utils/chat-text-utils";
import {
  resolveRouteContext,
  saveSessionHistory,
  loadSessionHistory,
} from "@/commons/utils/floating-ai-chat-session";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";
import { useGetSalesPromptsQuery } from "@/features/sales/queries/useGetSalesPromptsQuery";
import { postSalesQuery } from "@/features/sales/api/sales";

let messageIdCounter = 1;
const nextMessageId = () => messageIdCounter++;

const buildAssistantIntro = (
  guide: FloatingAiChatRouteGuide,
  suggestedQuestions: string[],
): ChatEntry => ({
  role: "assistant",
  message: {
    id: nextMessageId(),
    title: guide.title,
    content: guide.subtitle,
    evidence: [],
    suggestedQuestions,
    processingRoute: "guide",
    matchedQueryId: null,
  },
});

export function FloatingAiChat() {
  const location = useLocation();
  const routeState = location.state as {
    source?: string;
    domain?: "production" | "ordering" | "sales";
    intent?: "view" | "ask";
    prompt?: string;
  } | null;
  const { user, referenceDateTime } = useDemoSession();
  const { isOpen, activeCardContextKey, open, close } = useFloatingAiChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const handledRoutePromptRef = useRef<string>("");
  const hydratedSessionsRef = useRef<Set<string>>(new Set());
  const guideRef = useRef<FloatingAiChatRouteGuide | null>(null);
  const fallbackPromptsRef = useRef<string[]>([]);

  const { sessionKey, domain } = useMemo(
    () => resolveRouteContext(location.pathname),
    [location.pathname],
  );

  const routeGuide = useMemo(
    () => floatingAiChatRouteGuides[location.pathname] ?? floatingAiChatRouteGuides["/"],
    [location.pathname],
  );
  const salesPromptsQuery = useGetSalesPromptsQuery({ store_id: user.storeId, domain });

  const guide: FloatingAiChatRouteGuide = useMemo(() => {
    const cardContext = activeCardContextKey ? floatingAiCardContexts[activeCardContextKey] : null;
    return cardContext
      ? {
          title: cardContext.cardTitle,
          subtitle: "선택한 카드 맥락으로 바로 질의할 수 있습니다.",
          quickActions: cardContext.quickActions,
        }
      : routeGuide;
  }, [activeCardContextKey, routeGuide]);

  const goldenPrompts = useMemo(
    () => dedupeStrings((salesPromptsQuery.data ?? []).map((item) => item.prompt)),
    [salesPromptsQuery.data],
  );
  const fallbackPrompts = useMemo(
    () =>
      goldenPrompts.length > 0
        ? goldenPrompts
        : dedupeStrings(guide.quickActions.map((item) => item.prompt)),
    [goldenPrompts, guide.quickActions],
  );

  guideRef.current = guide;
  fallbackPromptsRef.current = fallbackPrompts;

  const [history, setHistory] = useState<ChatEntry[]>(() => [
    buildAssistantIntro(guide, fallbackPrompts),
  ]);
  const [isSending, setIsSending] = useState(false);

  const prevSessionKeyRef = useRef<string | null>(null);
  useEffect(() => {
    const isFirstRun = prevSessionKeyRef.current === null;
    if (!isFirstRun && prevSessionKeyRef.current !== sessionKey) {
      close();
    }
    prevSessionKeyRef.current = sessionKey;

    const saved = loadSessionHistory(sessionKey);
    setHistory(
      saved ?? [buildAssistantIntro(guideRef.current ?? guide, fallbackPromptsRef.current)],
    );
    hydratedSessionsRef.current.add(sessionKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey]);

  useEffect(() => {
    if (!hydratedSessionsRef.current.has(sessionKey)) return;
    saveSessionHistory(sessionKey, history);
  }, [history, sessionKey]);

  const send = useCallback(
    async (prompt: string) => {
      const normalizedPrompt = prompt.trim();
      if (!normalizedPrompt || isSending) return;

      const userEntry: ChatEntry = { role: "user", text: normalizedPrompt };
      let recentHistory: ChatHistoryEntry[] = [];
      setHistory((prev) => {
        const next = [...prev, userEntry];
        recentHistory = next
          .slice(-6)
          .flatMap((entry) =>
            entry.role === "user"
              ? [{ role: "user" as const, text: entry.text }]
              : [{ role: "assistant" as const, text: entry.message.content }],
          );
        return next;
      });
      setIsSending(true);

      try {
        const response = await postSalesQuery(normalizedPrompt, user.storeId, domain, {
          businessDate: referenceDateTime.slice(0, 10),
          businessTime: referenceDateTime.slice(11, 16) || undefined,
          pageContext: location.pathname,
          cardContextKey: activeCardContextKey ?? undefined,
          storeName: user.storeName,
          userRole: user.role,
          conversationHistory: recentHistory,
        });

        const overlapCandidates = Array.isArray(response.agent_trace?.overlap_candidates)
          ? response.agent_trace.overlap_candidates
              .map(extractCandidateText)
              .filter((s): s is string => Boolean(s))
          : [];

        const suggestedQuestions = dedupeStrings([
          ...overlapCandidates,
          ...goldenPrompts,
          ...fallbackPrompts,
        ]).slice(0, 6);

        const assistantEntry: ChatEntry = {
          role: "assistant",
          message: {
            id: nextMessageId(),
            title: guide.title,
            content: response.text,
            evidence: response.evidence ?? [],
            suggestedQuestions,
            processingRoute: response.processing_route ?? null,
            matchedQueryId: response.agent_trace?.matched_query_id ?? null,
            reference: {
              sources: dedupeStrings(response.sources ?? []),
              semanticLogic: response.semantic_logic ?? null,
              sql: response.agent_trace?.sql ?? null,
              relevantTables: response.agent_trace?.relevant_tables ?? [],
              queriedPeriod: response.agent_trace?.queried_period ?? null,
              dataLineage: response.data_lineage ?? [],
              matchedQueryId: response.agent_trace?.matched_query_id ?? null,
              matchScore: response.agent_trace?.match_score ?? null,
            },
          },
        };
        setHistory((prev) => [...prev, assistantEntry]);
      } catch {
        const fallbackEntry: ChatEntry = {
          role: "assistant",
          message: {
            id: nextMessageId(),
            title: guide.title,
            content: "질의 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
            evidence: ["네트워크 또는 서버 상태를 확인해 주세요."],
            suggestedQuestions: fallbackPrompts,
            processingRoute: "error_fallback",
            matchedQueryId: null,
          },
        };
        setHistory((prev) => [...prev, fallbackEntry]);
      } finally {
        setIsSending(false);
        setTimeout(() => {
          scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
        }, 50);
      }
    },
    [
      activeCardContextKey,
      domain,
      fallbackPrompts,
      goldenPrompts,
      guide,
      history,
      isSending,
      location.pathname,
      referenceDateTime,
      user,
    ],
  );

  useEffect(() => {
    const isDashboardAsk =
      routeState?.source === "dashboard-card-chat" &&
      routeState?.intent === "ask" &&
      typeof routeState.prompt === "string" &&
      routeState.prompt.trim().length > 0;

    if (!isDashboardAsk) return;

    const marker = `${location.key}:${routeState.prompt?.trim()}`;
    if (handledRoutePromptRef.current === marker) return;
    handledRoutePromptRef.current = marker;

    open();
    void send(routeState.prompt ?? "");
  }, [location.key, open, routeState?.intent, routeState?.prompt, routeState?.source, send]);

  return (
    <>
      <FloatingAiChatButton onClick={() => (isOpen ? close() : open())} />
      {isOpen ? (
        <FloatingAiChatPanel
          guide={guide}
          storeName={user.storeName}
          history={history}
          scrollRef={scrollRef}
          onClose={close}
          onSend={send}
          isSending={isSending}
        />
      ) : null}
    </>
  );
}
