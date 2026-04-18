export type SettingsDomain = "production" | "ordering" | "sales";

export interface DomainPromptSettings {
  quick_prompts: string[];
  system_instruction: string;
  query_prefix_template: string;
}

export interface PromptSettingsResponse {
  version: number;
  updated_at: string;
  updated_by: string;
  domains: Record<SettingsDomain, DomainPromptSettings>;
}

export interface PromptSettingsUpdateRequest {
  domains: Record<SettingsDomain, DomainPromptSettings>;
  updated_by?: string;
}