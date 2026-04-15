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
