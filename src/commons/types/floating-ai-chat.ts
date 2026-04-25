export type FloatingAiChatReference = {
  sources?: string[];
  semanticLogic?: string | null;
  sql?: string | null;
  relevantTables?: string[];
  queriedPeriod?: Record<string, unknown> | null;
  dataLineage?: Array<Record<string, unknown>>;
  matchedQueryId?: string | null;
  matchScore?: number | null;
};

export type FloatingAiChatMessage = {
  id: number;
  title: string;
  content: string;
  evidence: string[];
  suggestedQuestions?: string[];
  processingRoute?: string | null;
  matchedQueryId?: string | null;
  reference?: FloatingAiChatReference;
};

export type FloatingAiChatQuickAction = {
  label: string;
  prompt: string;
};

export type FloatingAiChatRouteGuide = {
  title: string;
  subtitle: string;
  quickActions: FloatingAiChatQuickAction[];
};

export type FloatingAiCardContextKey =
  | "production:stock-risk"
  | "production:inventory-status"
  | "production:waste"
  | "ordering:options"
  | "ordering:history"
  | "sales:summary";

export type FloatingAiCardContext = {
  contextKey: FloatingAiCardContextKey;
  cardTitle: string;
  quickActions: FloatingAiChatQuickAction[];
};

export type ChatHistoryEntry = {
  role: "user" | "assistant";
  text: string;
};

export type ChatEntry =
  | { role: "user"; text: string }
  | { role: "assistant"; message: FloatingAiChatMessage };
