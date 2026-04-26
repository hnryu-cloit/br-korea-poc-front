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

const MOCK_PROMPT_FORM: Record<PromptDomainKey, PromptDomainForm> = {
  production: {
    quickPromptsText: [
      "오늘 14시 이전에 먼저 생산할 TOP 3 품목은?",
      "현재 재고 기준으로 2시간 내 품절 위험 품목은?",
      "폐기율을 낮추려면 오늘 생산 배치를 어떻게 나눌까?",
      "우천 시 수요 감소를 반영하면 생산량을 얼마나 줄여야 해?",
      "어제 대비 판매속도가 오른 품목만 추려줘.",
    ].join("\n"),
    systemInstruction:
      "당신은 매장 생산관리 코치입니다. 재고, 판매속도, 폐기 가능성 근거를 먼저 제시하고 즉시 실행 가능한 생산 우선순위를 제안합니다. 불확실한 수치는 추정이라고 명시합니다.",
    queryPrefixTemplate: "[점포:{store_id}] [생산관리] [기준:{business_date}] {question}",
  },
  ordering: {
    quickPromptsText: [
      "오늘 발주 마감 전에 반드시 주문해야 할 품목은?",
      "리드타임과 유통기한을 같이 보면 과다 발주 위험 품목은?",
      "지난주 대비 이번주 주문량이 크게 변한 원인은?",
      "공급사 지연 리스크를 반영한 안전재고 권고안을 줘.",
      "내일 행사/프로모션 반영 시 추가 주문 필요 수량은?",
    ].join("\n"),
    systemInstruction:
      "당신은 주문관리 코치입니다. 결품 방지와 과다재고 억제를 동시에 달성하도록 발주 기준을 제안합니다. 납기, 최소주문단위, 유통기한 제약을 우선 반영합니다.",
    queryPrefixTemplate: "[점포:{store_id}] [주문관리] [리드타임:{lead_time_days}] {question}",
  },
  sales: {
    quickPromptsText: [
      "오늘 매출/마진이 목표 대비 부족한 핵심 원인은?",
      "시간대별 객단가를 올릴 수 있는 메뉴 조합 제안해줘.",
      "할인/프로모션의 순매출 기여도를 비교해줘.",
      "재방문 유도에 효과적인 액션을 고객군별로 제시해줘.",
      "이번 주 손익 개선을 위한 우선 실행 3가지를 정리해줘.",
    ].join("\n"),
    systemInstruction:
      "당신은 손익분석 코치입니다. 매출, 원가, 할인, 결제믹스 근거를 기반으로 실행 우선순위를 제시합니다. 근거 데이터가 없으면 임의 추정하지 않습니다.",
    queryPrefixTemplate: "[점포:{store_id}] [매출관리] [기간:{date_from}~{date_to}] {question}",
  },
};
const INITIAL_FORM = Object.fromEntries(
  ORCHESTRATION_DOMAIN_KEYS.map((key) => [key, { ...MOCK_PROMPT_FORM[key] }]),
) as Record<PromptDomainKey, PromptDomainForm>;

export const useOrchestrationScreen = () => {
  const [form, setForm] = useState<Record<PromptDomainKey, PromptDomainForm>>(INITIAL_FORM);
  const [savedForm, setSavedForm] =
    useState<Record<PromptDomainKey, PromptDomainForm>>(INITIAL_FORM);
  const [updatedAtText, setUpdatedAtText] = useState("2026-04-26 10:30");
  const [updatedBy, setUpdatedBy] = useState("hq_admin");
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
    const now = new Date();
    const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate(),
    ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes(),
    ).padStart(2, "0")}`;
    setUpdatedAtText(ts);
    setUpdatedBy("hq_admin");
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
    updatedAtText,
    updatedBy,
    handleFieldChange,
    handleSave,
    handleReset,
    activeModal,
    setActiveModal,
    selectedNotice,
    setSelectedNotice,
  };
};
