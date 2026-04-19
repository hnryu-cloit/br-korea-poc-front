import type { SettingsDomain } from "@/features/settings/types/settings";

export type DomainFormState = {
  quickPromptsText: string;
  systemInstruction: string;
  queryPrefixTemplate: string;
};

export type PromptFormState = Record<SettingsDomain, DomainFormState>;

export type DomainFormField = keyof DomainFormState;
