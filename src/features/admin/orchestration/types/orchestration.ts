export type PromptDomainKey = "production" | "ordering" | "sales";

export interface PromptDomainSettings {
  quick_prompts: string[];
  system_instruction: string;
  query_prefix_template: string;
}

export interface PromptSettingsResponse {
  version: number;
  updated_at: string;
  updated_by: string;
  domains: Record<string, PromptDomainSettings>;
}

export interface PromptSettingsUpdateRequest {
  domains: Record<string, PromptDomainSettings>;
  updated_by?: string;
}
