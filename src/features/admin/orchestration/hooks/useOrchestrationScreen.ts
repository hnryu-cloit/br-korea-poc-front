import { useState } from "react";

import { ORCHESTRATION_DOMAIN_KEYS } from "@/features/admin/orchestration/constants/orchestration";
import type {
  NoticeItem,
  PromptDomainKey,
  SettingsModalKey,
} from "@/features/admin/orchestration/types/orchestration";

type PromptDomainForm = {
  quickPromptsText: string;
  systemInstruction: string;
  queryPrefixTemplate: string;
};

const EMPTY_FORM: PromptDomainForm = {
  quickPromptsText: "",
  systemInstruction: "",
  queryPrefixTemplate: "[점포:{store_id}] [도메인:{domain}] {question}",
};

const INITIAL_FORM = Object.fromEntries(
  ORCHESTRATION_DOMAIN_KEYS.map((key) => [key, { ...EMPTY_FORM }]),
) as Record<PromptDomainKey, PromptDomainForm>;

export const useOrchestrationScreen = () => {
  const [form, setForm] = useState<Record<PromptDomainKey, PromptDomainForm>>(INITIAL_FORM);
  const [savedForm, setSavedForm] =
    useState<Record<PromptDomainKey, PromptDomainForm>>(INITIAL_FORM);
  const [activeAgent, setActiveAgent] = useState<PromptDomainKey>("production");
  const [activeModal, setActiveModal] = useState<SettingsModalKey | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const isDirty = JSON.stringify(form) !== JSON.stringify(savedForm);

  const handleFieldChange = (
    domain: PromptDomainKey,
    key: keyof PromptDomainForm,
    value: string,
  ) => {
    setSaveMessage(null);
    setForm((prev) => ({ ...prev, [domain]: { ...prev[domain], [key]: value } }));
  };

  const handleSave = () => {
    setSavedForm({ ...form });
    setSaveMessage("프롬프트 설정이 저장되었습니다. (목업)");
  };

  const handleReset = () => {
    setForm({ ...savedForm });
    setSaveMessage(null);
  };

  return {
    form,
    activeAgent,
    setActiveAgent,
    isDirty,
    saveMessage,
    handleFieldChange,
    handleSave,
    handleReset,
    activeModal,
    setActiveModal,
    selectedNotice,
    setSelectedNotice,
  };
};
