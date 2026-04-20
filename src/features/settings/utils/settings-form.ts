import { DEFAULT_DOMAIN_SETTINGS } from "@/features/settings/constants/settings-domains";
import type { PromptFormState } from "@/features/settings/types/settings-screen";
import type { DomainPromptSettings, SettingsDomain } from "@/features/settings/types/settings";

export const EMPTY_PROMPT_FORM: PromptFormState = {
  production: { quickPromptsText: "", systemInstruction: "", queryPrefixTemplate: "" },
  ordering: { quickPromptsText: "", systemInstruction: "", queryPrefixTemplate: "" },
  sales: { quickPromptsText: "", systemInstruction: "", queryPrefixTemplate: "" },
};

export function toPromptFormState(
  domains?: Record<SettingsDomain, DomainPromptSettings>,
): PromptFormState {
  const source = domains ?? {
    production: DEFAULT_DOMAIN_SETTINGS,
    ordering: DEFAULT_DOMAIN_SETTINGS,
    sales: DEFAULT_DOMAIN_SETTINGS,
  };

  return {
    production: {
      quickPromptsText: (source.production?.quick_prompts ?? []).join("\n"),
      systemInstruction: source.production?.system_instruction ?? "",
      queryPrefixTemplate: source.production?.query_prefix_template ?? "",
    },
    ordering: {
      quickPromptsText: (source.ordering?.quick_prompts ?? []).join("\n"),
      systemInstruction: source.ordering?.system_instruction ?? "",
      queryPrefixTemplate: source.ordering?.query_prefix_template ?? "",
    },
    sales: {
      quickPromptsText: (source.sales?.quick_prompts ?? []).join("\n"),
      systemInstruction: source.sales?.system_instruction ?? "",
      queryPrefixTemplate: source.sales?.query_prefix_template ?? "",
    },
  };
}

export function toPromptPayloadState(
  form: PromptFormState,
): Record<SettingsDomain, DomainPromptSettings> {
  const toPrompts = (text: string) =>
    text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 5);

  return {
    production: {
      quick_prompts: toPrompts(form.production.quickPromptsText),
      system_instruction: form.production.systemInstruction.trim(),
      query_prefix_template: form.production.queryPrefixTemplate.trim(),
    },
    ordering: {
      quick_prompts: toPrompts(form.ordering.quickPromptsText),
      system_instruction: form.ordering.systemInstruction.trim(),
      query_prefix_template: form.ordering.queryPrefixTemplate.trim(),
    },
    sales: {
      quick_prompts: toPrompts(form.sales.quickPromptsText),
      system_instruction: form.sales.systemInstruction.trim(),
      query_prefix_template: form.sales.queryPrefixTemplate.trim(),
    },
  };
}
