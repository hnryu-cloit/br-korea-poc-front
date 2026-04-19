import { useCallback, useMemo, useState } from "react";

import { useGetPromptSettingsQuery } from "@/features/settings/queries/useGetPromptSettingsQuery";
import { usePutPromptSettingsMutation } from "@/features/settings/queries/usePutPromptSettingsMutation";
import type { DomainFormField, PromptFormState } from "@/features/settings/types/settings-screen";
import type { SettingsDomain } from "@/features/settings/types/settings";
import {
  EMPTY_PROMPT_FORM,
  toPromptFormState,
  toPromptPayloadState,
} from "@/features/settings/utils/settings-form";

export function useSettingsPromptForm() {
  const [draftForm, setDraftForm] = useState<PromptFormState | null>(null);

  const { data, isLoading } = useGetPromptSettingsQuery();
  const mutation = usePutPromptSettingsMutation();

  const serverForm = useMemo(
    () => (data ? toPromptFormState(data.domains) : EMPTY_PROMPT_FORM),
    [data],
  );

  const form = draftForm ?? serverForm;
  const savedAt = mutation.data?.updated_at ?? data?.updated_at ?? null;
  const isDirty = JSON.stringify(form) !== JSON.stringify(serverForm);

  const handleReset = useCallback(() => {
    setDraftForm(null);
  }, []);

  const handleDomainFieldChange = useCallback(
    (domain: SettingsDomain, field: DomainFormField, value: string) => {
      setDraftForm((prev) => {
        const base = prev ?? serverForm;
        return {
          ...base,
          [domain]: {
            ...base[domain],
            [field]: value,
          },
        };
      });
    },
    [serverForm],
  );

  const handleSave = useCallback(async () => {
    const result = await mutation.mutateAsync({
      domains: toPromptPayloadState(form),
      updated_by: "hq_admin",
    });
    setDraftForm(toPromptFormState(result.domains));
  }, [form, mutation]);

  return {
    form,
    data,
    isLoading,
    mutation,
    savedAt,
    isDirty,
    handleReset,
    handleSave,
    handleDomainFieldChange,
  };
}
