import { useMemo, useState } from "react";

import { PageHero } from "@/commons/components/page/page-layout";
import { DEFAULT_DOMAIN_SETTINGS } from "@/features/settings/constants/settings-domains";
import { useGetPromptSettingsQuery } from "@/features/settings/queries/useGetPromptSettingsQuery";
import { usePutPromptSettingsMutation } from "@/features/settings/queries/usePutPromptSettingsMutation";
import type { DomainPromptSettings, SettingsDomain } from "@/features/settings/types/settings";

const DOMAIN_KEYS: SettingsDomain[] = ["production", "ordering", "sales"];

const DOMAIN_LABEL: Record<SettingsDomain, string> = {
  production: "생산관리",
  ordering: "주문관리",
  sales: "손익분석",
};

type DomainFormState = {
  quickPromptsText: string;
  systemInstruction: string;
  queryPrefixTemplate: string;
};

type PromptFormState = Record<SettingsDomain, DomainFormState>;

const EMPTY_FORM: PromptFormState = {
  production: { quickPromptsText: "", systemInstruction: "", queryPrefixTemplate: "" },
  ordering: { quickPromptsText: "", systemInstruction: "", queryPrefixTemplate: "" },
  sales: { quickPromptsText: "", systemInstruction: "", queryPrefixTemplate: "" },
};

function toFormState(domains?: Record<SettingsDomain, DomainPromptSettings>): PromptFormState {
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

function toPayloadState(form: PromptFormState): Record<SettingsDomain, DomainPromptSettings> {
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

export function SettingsScreen() {
  const [draftForm, setDraftForm] = useState<PromptFormState | null>(null);

  const { data, isLoading } = useGetPromptSettingsQuery();
  const mutation = usePutPromptSettingsMutation();

  const serverForm = useMemo(
    () => (data ? toFormState(data.domains) : EMPTY_FORM),
    [data],
  );
  const form = draftForm ?? serverForm;
  const savedAt = mutation.data?.updated_at ?? data?.updated_at ?? null;

  const handleReset = () => {
    setDraftForm(null);
  };

  const handleSave = async () => {
    const result = await mutation.mutateAsync({
      domains: toPayloadState(form),
      updated_by: "hq_admin",
    });
    setDraftForm(toFormState(result.domains));
  };

  const isDirty = JSON.stringify(form) !== JSON.stringify(serverForm);

  return (
    <div className="space-y-6">
      <PageHero
        title="Digital Twin 설정"
        description="도메인별 빠른 질문, 시스템 지시문, 쿼리 접두 템플릿을 관리합니다."
      />

      <section className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-base font-semibold text-slate-900">시스템 프롬프트 설정</p>
          <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#2454C8]">
            마지막 수정: {savedAt ? new Date(savedAt).toLocaleString("ko-KR") : "-"} · {data?.updated_by ?? "-"}
          </span>
          {isDirty ? (
            <span className="rounded-full border border-orange-300 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
              미저장 변경사항
            </span>
          ) : null}
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={!isDirty || mutation.isPending || isLoading}
              className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              되돌리기
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || mutation.isPending || isLoading}
              className="rounded-xl bg-[#2454C8] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mutation.isPending ? "저장 중..." : "설정 저장"}
            </button>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-400">도메인별 빠른 질문, 시스템 지시문, 쿼리 접두 템플릿을 관리합니다.</p>

        {isLoading ? (
          <p className="mt-4 text-sm text-slate-400">프롬프트 설정을 불러오는 중입니다...</p>
        ) : (
          <div className="mt-4 grid gap-4 xl:grid-cols-3">
            {DOMAIN_KEYS.map((domain) => (
              <article key={domain} className="rounded-2xl border border-border bg-[#f8fbff] p-4">
                <p className="text-sm font-semibold text-slate-900">{DOMAIN_LABEL[domain]}</p>

                <label className="mt-3 block text-xs font-semibold text-slate-500">빠른 질문(줄바꿈 구분, 최대 5개)</label>
                <textarea
                  value={form[domain].quickPromptsText}
                  onChange={(event) => {
                    const next = event.target.value;
                    setDraftForm((prev) => {
                      const base = prev ?? serverForm;
                      return {
                        ...base,
                        [domain]: { ...base[domain], quickPromptsText: next },
                      };
                    });
                  }}
                  className="mt-1 h-28 w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-[#2454C8]"
                />

                <label className="mt-3 block text-xs font-semibold text-slate-500">시스템 프롬프트</label>
                <textarea
                  value={form[domain].systemInstruction}
                  onChange={(event) => {
                    const next = event.target.value;
                    setDraftForm((prev) => {
                      const base = prev ?? serverForm;
                      return {
                        ...base,
                        [domain]: { ...base[domain], systemInstruction: next },
                      };
                    });
                  }}
                  className="mt-1 h-28 w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-[#2454C8]"
                />

                <label className="mt-3 block text-xs font-semibold text-slate-500">쿼리 접두 템플릿</label>
                <input
                  value={form[domain].queryPrefixTemplate}
                  onChange={(event) => {
                    const next = event.target.value;
                    setDraftForm((prev) => {
                      const base = prev ?? serverForm;
                      return {
                        ...base,
                        [domain]: { ...base[domain], queryPrefixTemplate: next },
                      };
                    });
                  }}
                  className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-[#2454C8]"
                />
              </article>
            ))}
          </div>
        )}

        {mutation.isError ? (
          <p className="mt-3 text-sm text-red-500">저장에 실패했습니다. 다시 시도해 주세요.</p>
        ) : null}
      </section>
    </div>
  );
}
