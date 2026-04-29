import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { FloatingAiChatButton } from "@/commons/components/chat/FloatingAiChatButton";
import { FloatingAiChatPanel } from "@/commons/components/chat/FloatingAiChatPanel";
import { floatingAiCardContexts } from "@/commons/constants/floating-ai-card-contexts";
import { floatingAiChatRouteGuides as routeGuides } from "@/commons/constants/floating-ai-chat";
import { useFloatingAiChat } from "@/commons/hooks/useFloatingAiChat";
import type { FloatingAiChatRouteGuide } from "@/commons/types/floating-ai-chat";
import { dedupeStrings } from "@/commons/utils/chat-text-utils";
import {
  type FloatingChatDomain,
  resolveRouteContext,
} from "@/commons/utils/floating-ai-chat-session";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";
import { useGetSalesPromptsQuery } from "@/features/sales/queries/useGetSalesPromptsQuery";
import { postSalesQuery } from "@/features/sales/api/sales";

import {
  type FloatingAiChatRequestContext,
  normalizeFloatingAiChatResponse,
  getChatAnswerStatus,
} from "@/commons/components/chat/floating-ai-chat-utils";
import {
  type FloatingAiChatConversationItem,
  type FloatingAiChatSuggestion,
} from "@/commons/components/chat/FloatingAiChatParts";

let messageIdCounter = 1;
const nextMessageId = () => messageIdCounter++;

type RouteState = {
  source?: string;
  domain?: "production" | "ordering" | "sales";
  intent?: "view" | "ask";
  prompt?: string;
} | null;

function createEmptyAnswer(requestContext: FloatingAiChatRequestContext) {
  return normalizeFloatingAiChatResponse(
    {
      text: "",
      evidence: [],
      actions: [],
      follow_up_questions: [],
      store_context: "",
      data_source: "",
      comparison_basis: "",
      calculation_date: "",
      blocked: false,
      agent_trace: {
        intent: null,
        relevant_tables: [],
        sql: null,
        queried_period: null,
        row_count: null,
        matched_query_id: null,
        match_score: null,
        overlap_candidates: [],
      },
    },
    requestContext,
  );
}

function createSuggestionList(
  prompts: Array<{ label?: string; prompt: string }>,
  shuffleNonce: number = 0,
): FloatingAiChatSuggestion[] {
  const normalized = prompts
    .map((item) => ({
      label: item.label?.trim() || item.prompt.trim(),
      prompt: item.prompt.trim(),
    }))
    .filter((item) => item.prompt.length > 0);

  const dedupedPrompts = dedupeStrings(normalized.map((item) => item.prompt));
  const pool = dedupedPrompts
    .map((prompt) => normalized.find((item) => item.prompt === prompt))
    .filter((item): item is FloatingAiChatSuggestion => Boolean(item));

  if (shuffleNonce > 0 && pool.length > 1) {
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 4);
  }

  return pool.slice(0, 4);
}

export function FloatingAiChat() {
  const location = useLocation();
  const routeState = location.state as RouteState;
  const { user, referenceDateTime } = useDemoSession();
  const { isOpen, activeCardContextKey, pendingChat, open, close, consumePendingChat } =
    useFloatingAiChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const handledRoutePromptRef = useRef<string>("");
  const hydratedSessionKeyRef = useRef<string | null>(null);
  const historyRef = useRef<FloatingAiChatConversationItem[]>([]);

  const { sessionKey, domain } = useMemo(
    () => resolveRouteContext(location.pathname),
    [location.pathname],
  );

  const routeGuide = useMemo(
    () => routeGuides[location.pathname] ?? routeGuides["/"],
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

  const requestContext = useMemo<FloatingAiChatRequestContext>(
    () => ({
      storeName: user.storeName,
      businessDate: referenceDateTime.slice(0, 10),
      businessTime: referenceDateTime.slice(11, 16) || undefined,
      domain,
      pageContext: location.pathname,
      cardContextKey: activeCardContextKey ?? null,
    }),
    [activeCardContextKey, domain, location.pathname, referenceDateTime, user.storeName],
  );

  const [suggestionShuffleNonce, setSuggestionShuffleNonce] = useState(0);

  const suggestedPrompts = useMemo(
    () =>
      createSuggestionList(salesPromptsQuery.data ?? [], suggestionShuffleNonce),
    [salesPromptsQuery.data, suggestionShuffleNonce],
  );

  const [messages, setMessages] = useState<FloatingAiChatConversationItem[]>(() => []);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const isFirstRun = hydratedSessionKeyRef.current === null;
    if (!isFirstRun && hydratedSessionKeyRef.current !== sessionKey) {
      close();
    }
    hydratedSessionKeyRef.current = sessionKey;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey]);

  useEffect(() => {
    if (!isOpen) {
      historyRef.current = [];
      setMessages([]);
      return;
    }
    setSuggestionShuffleNonce((n) => n + 1);
  }, [isOpen]);

  const send = useCallback(
    async (prompt: string, overrideDomain?: FloatingChatDomain): Promise<boolean> => {
      const normalizedPrompt = prompt.trim();
      if (!normalizedPrompt || isSending) return false;

      const effectiveDomain = overrideDomain ?? domain;

      const userMessage: FloatingAiChatConversationItem = {
        id: nextMessageId(),
        role: "user",
        text: normalizedPrompt,
      };

      const nextMessages = [...historyRef.current, userMessage];
      historyRef.current = nextMessages;
      setMessages(nextMessages);
      setIsSending(true);

      try {
        const response = await postSalesQuery(normalizedPrompt, user.storeId, effectiveDomain, {
          businessDate: requestContext.businessDate,
          businessTime: requestContext.businessTime,
          pageContext: requestContext.pageContext,
          cardContextKey: requestContext.cardContextKey ?? undefined,
          storeName: requestContext.storeName,
          userRole: user.role,
          conversationHistory: nextMessages
            .slice(-6)
            .reduce<Array<{ role: "user" | "assistant"; text: string }>>((acc, entry) => {
              acc.push({
                role: entry.role,
                text: entry.role === "user" ? entry.text : entry.answer.text,
              });
              return acc;
            }, []),
        });

        const status = getChatAnswerStatus(response);
        const normalized = normalizeFloatingAiChatResponse(response, requestContext);
        const assistantMessage: FloatingAiChatConversationItem = {
          id: nextMessageId(),
          role: "assistant",
          prompt: normalizedPrompt,
          status,
          answer: normalized,
        };

        const updatedMessages = [...nextMessages, assistantMessage];
        historyRef.current = updatedMessages;
        setMessages(updatedMessages);
        return true;
      } catch {
        const fallbackMessage: FloatingAiChatConversationItem = {
          id: nextMessageId(),
          role: "assistant",
          prompt: normalizedPrompt,
          status: "error",
          answer: createEmptyAnswer(requestContext),
        };

        const updatedMessages = [...nextMessages, fallbackMessage];
        historyRef.current = updatedMessages;
        setMessages(updatedMessages);
        return false;
      } finally {
        setIsSending(false);
        setTimeout(() => {
          scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
          });
        }, 50);
      }
    },
    [domain, isSending, requestContext, user.role, user.storeId],
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

  useEffect(() => {
    if (!pendingChat) return;
    consumePendingChat();
    void send(pendingChat.prompt, pendingChat.domain);
  }, [pendingChat, consumePendingChat, send]);

  return (
    <>
      <FloatingAiChatButton onClick={() => (isOpen ? close() : open())} />
      {isOpen ? (
        <FloatingAiChatPanel
          guide={guide}
          storeName={user.storeName}
          history={messages}
          suggestions={suggestedPrompts}
          scrollRef={scrollRef}
          onClose={close}
          onSend={send}
          isSending={isSending}
        />
      ) : null}
    </>
  );
}
