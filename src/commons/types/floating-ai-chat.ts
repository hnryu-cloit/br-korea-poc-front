export type FloatingAiChatMessage = {
  id: number;
  title: string;
  content: string;
  evidence: string[];
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
    "production:status"
  | "production:stock-risk"
  | "production:inventory-status"
  | "production:waste"
  | "ordering:options"
  | "sales:summary";

export type FloatingAiCardContext = {
  contextKey: FloatingAiCardContextKey;
  cardTitle: string;
  quickActions: FloatingAiChatQuickAction[];
};

export type ChatEntry =
  | { role: "user"; text: string }
  | { role: "assistant"; message: FloatingAiChatMessage };