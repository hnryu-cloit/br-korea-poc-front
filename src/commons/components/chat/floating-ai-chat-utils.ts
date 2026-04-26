type RecordLike = Record<string, unknown>;

export type FloatingAiChatAnswerStatus = "success" | "miss" | "empty" | "blocked" | "error";

export type FloatingAiChatRequestContext = {
  storeName?: string;
  businessDate?: string;
  businessTime?: string;
  domain?: string;
  pageContext?: string;
  cardContextKey?: string | null;
};

export type FloatingAiChatAgentTrace = {
  intent?: string | null;
  sql?: string | null;
  rowCount?: number | null;
  traceId?: string | null;
  relevantTables: string[];
  queriedPeriod?: Record<string, unknown> | null;
  matchScore?: number | null;
  matchedQueryId?: string | null;
  overlapCandidates: string[];
};

export type NormalizedFloatingAiChatResponse = {
  text: string;
  evidence: string[];
  actions: string[];
  followUpQuestions: string[];
  blocked: boolean;
  requestContext: FloatingAiChatRequestContext;
  responseContext: {
    storeContext: string;
    dataSource: string;
    comparisonBasis: string;
    calculationDate: string;
  };
  agentTrace: FloatingAiChatAgentTrace;
  raw: unknown;
};

function asRecord(value: unknown): RecordLike | null {
  if (!value || typeof value !== "object") return null;
  return value as RecordLike;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asBoolean(value: unknown): boolean {
  return value === true;
}

function asNumberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function getNestedRecord(parent: RecordLike | null, key: string): RecordLike | null {
  if (!parent) return null;
  return asRecord(parent[key]);
}

export const getNormalizedAnswer = (response: unknown) => {
  const root = asRecord(response);
  const answer = getNestedRecord(root, "answer");

  return {
    text: asString(answer?.text) || asString(root?.text) || asString(answer?.content) || "",
    evidence: asStringArray(answer?.evidence ?? root?.evidence),
    actions: asStringArray(answer?.actions ?? root?.actions),
    followUpQuestions: asStringArray(
      answer?.follow_up_questions ?? root?.follow_up_questions ?? root?.followUpQuestions,
    ),
  };
};

export const getChatAnswerStatus = (response: unknown): FloatingAiChatAnswerStatus => {
  const root = asRecord(response);
  const trace = getNestedRecord(root, "agent_trace");
  const answer = getNestedRecord(root, "answer");
  const normalized = getNormalizedAnswer(response);

  if (asBoolean(root?.blocked)) return "blocked";

  if (asString(trace?.intent) === "golden_query_miss") {
    return "miss";
  }

  if (asString(trace?.sql) && asNumberOrNull(trace?.row_count) === 0) {
    return "empty";
  }

  if (normalized.text) {
    return "success";
  }

  if (asString(answer?.text) || asString(root?.text)) {
    return "success";
  }

  return "error";
};

export function normalizeFloatingAiChatResponse(
  response: unknown,
  requestContext: FloatingAiChatRequestContext,
): NormalizedFloatingAiChatResponse {
  const root = asRecord(response);
  const trace = getNestedRecord(root, "agent_trace");
  const answer = getNestedRecord(root, "answer");
  const normalizedAnswer = getNormalizedAnswer(response);
  const responseContext = {
    storeContext: asString(root?.store_context ?? answer?.store_context),
    dataSource: asString(root?.data_source ?? answer?.data_source),
    comparisonBasis: asString(root?.comparison_basis ?? answer?.comparison_basis),
    calculationDate: asString(root?.calculation_date ?? answer?.calculation_date),
  };
  const traceId = asString(
    trace?.trace_id ?? root?.trace_id ?? root?.explainability_trace_id ?? root?.traceId,
  );

  return {
    text: normalizedAnswer.text,
    evidence: normalizedAnswer.evidence,
    actions: normalizedAnswer.actions,
    followUpQuestions: normalizedAnswer.followUpQuestions,
    blocked: asBoolean(root?.blocked),
    requestContext,
    responseContext,
    agentTrace: {
      intent: asString(trace?.intent) || null,
      sql: asString(trace?.sql) || null,
      rowCount: asNumberOrNull(trace?.row_count),
      traceId: traceId || null,
      relevantTables: asStringArray(trace?.relevant_tables),
      queriedPeriod: asRecord(trace?.queried_period),
      matchScore: asNumberOrNull(trace?.match_score),
      matchedQueryId: asString(trace?.matched_query_id) || null,
      overlapCandidates: Array.isArray(trace?.overlap_candidates)
        ? trace!.overlap_candidates
            .map((candidate) => {
              const candidateRecord = asRecord(candidate);
              const question = asString(candidateRecord?.question);
              const prompt = asString(candidateRecord?.prompt);
              const label = asString(candidateRecord?.label);
              const text = asString(candidateRecord?.text);
              return question || prompt || label || text;
            })
            .filter(Boolean)
        : [],
    },
    raw: response,
  };
}

export function getResponseTitleByStatus(status: FloatingAiChatAnswerStatus) {
  switch (status) {
    case "blocked":
      return "제한 안내";
    case "miss":
      return "답변 없음";
    case "empty":
      return "조회 결과 없음";
    case "error":
      return "답변 실패";
    case "success":
    default:
      return "답변 요약";
  }
}
