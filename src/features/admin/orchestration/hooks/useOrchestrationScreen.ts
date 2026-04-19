import { useMemo, useState } from "react";

import { PROCESSING_ROUTE } from "@/commons/constants/audit-route";
import type { AuditLogEntry } from "@/features/analytics/types/analytics";
import { useGetOrchestrationAuditLogsQuery } from "@/features/admin/orchestration/queries/useGetOrchestrationAuditLogsQuery";
import { useGetPromptSettingsQuery } from "@/features/admin/orchestration/queries/useGetPromptSettingsQuery";
import { usePutPromptSettingsMutation } from "@/features/admin/orchestration/queries/usePutPromptSettingsMutation";
import type {
  PromptDomainKey,
  PromptSettingsResponse,
} from "@/features/admin/orchestration/types/orchestration";

type PromptDomainForm = {
  quickPromptsText: string;
  systemInstruction: string;
  queryPrefixTemplate: string;
};

type PromptFormState = Record<PromptDomainKey, PromptDomainForm>;

const DOMAIN_KEYS: PromptDomainKey[] = ["production", "ordering", "sales"];

const EMPTY_DOMAIN_FORM: PromptDomainForm = {
  quickPromptsText: "",
  systemInstruction: "",
  queryPrefixTemplate: "[점포:{store_id}] [도메인:{domain}] {question}",
};

function toFormState(data?: PromptSettingsResponse): PromptFormState {
  const next: PromptFormState = {
    production: { ...EMPTY_DOMAIN_FORM },
    ordering: { ...EMPTY_DOMAIN_FORM },
    sales: { ...EMPTY_DOMAIN_FORM },
  };
  if (!data?.domains) return next;

  for (const domain of DOMAIN_KEYS) {
    const source = data.domains[domain];
    if (!source) continue;
    next[domain] = {
      quickPromptsText: (source.quick_prompts ?? []).join("\n"),
      systemInstruction: source.system_instruction ?? "",
      queryPrefixTemplate:
        source.query_prefix_template ?? "[점포:{store_id}] [도메인:{domain}] {question}",
    };
  }
  return next;
}

function toQuickPrompts(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .slice(0, 5);
}

export const useOrchestrationScreen = () => {
  const logsQuery = useGetOrchestrationAuditLogsQuery(50);
  const promptSettingsQuery = useGetPromptSettingsQuery();

  const serverForm = useMemo(
    () => toFormState(promptSettingsQuery.data),
    [promptSettingsQuery.data],
  );
  const [draftForm, setDraftForm] = useState<PromptFormState | null>(null);
  const form = draftForm ?? serverForm;
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const saveMutation = usePutPromptSettingsMutation({
    onSuccess: (data) => {
      setDraftForm(toFormState(data));
      setSaveMessage("프롬프트 설정이 저장되었습니다.");
    },
    onError: () => {
      setSaveMessage("저장에 실패했습니다. 권한 또는 요청 데이터를 확인해 주세요.");
    },
  });

  const logs = useMemo(() => logsQuery.data?.items ?? [], [logsQuery.data?.items]);
  const isBlocked = (entry: AuditLogEntry) =>
    entry.route === "policy_block" || entry.outcome === "blocked";

  const sqlPct = useMemo(() => {
    if (logs.length === 0) return 0;
    const repositoryRoutedCount = logs.filter(
      (log) => log.route === PROCESSING_ROUTE.REPOSITORY,
    ).length;
    return Math.round((repositoryRoutedCount / logs.length) * 100);
  }, [logs]);

  const blockedCount = useMemo(
    () => logs.filter((entry) => isBlocked(entry)).length,
    [logs],
  );

  const updatedAtRaw = promptSettingsQuery.data?.updated_at;
  const updatedAtText = (() => {
    if (!updatedAtRaw) return "-";
    const date = new Date(updatedAtRaw);
    if (Number.isNaN(date.getTime())) return updatedAtRaw;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  })();

  const handleDomainChange = (
    domain: PromptDomainKey,
    key: keyof PromptDomainForm,
    value: string,
  ) => {
    setSaveMessage(null);
    setDraftForm((prev) => {
      const base = prev ?? serverForm;
      return {
        ...base,
        [domain]: {
          ...base[domain],
          [key]: value,
        },
      };
    });
  };

  const handleSavePromptSettings = async (updatedBy: string) => {
    const domainsPayload = DOMAIN_KEYS.reduce(
      (acc, domain) => {
        acc[domain] = {
          quick_prompts: toQuickPrompts(form[domain].quickPromptsText),
          system_instruction: form[domain].systemInstruction.trim(),
          query_prefix_template:
            form[domain].queryPrefixTemplate.trim() ||
            "[점포:{store_id}] [도메인:{domain}] {question}",
        };
        return acc;
      },
      {} as Record<
        PromptDomainKey,
        {
          quick_prompts: string[];
          system_instruction: string;
          query_prefix_template: string;
        }
      >,
    );

    await saveMutation.mutateAsync({
      domains: domainsPayload,
      updated_by: updatedBy,
    });
  };

  return {
    logsQuery,
    promptSettingsQuery,
    saveMutation,
    form,
    saveMessage,
    logs,
    sqlPct,
    blockedCount,
    updatedAtText,
    isBlocked,
    handleDomainChange,
    handleSavePromptSettings,
  };
};
