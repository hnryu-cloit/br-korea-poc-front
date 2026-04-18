import { useEffect, useState } from "react";

import { PageHero } from "@/commons/components/page/page-layout";
import { DEFAULT_DOMAIN_SETTINGS, SETTINGS_DOMAINS } from "@/features/settings/constants/settings-domains";
import { SettingsDomainEditor } from "@/features/settings/components/SettingsDomainEditor";
import { SettingsDomainNav } from "@/features/settings/components/SettingsDomainNav";
import { useGetPromptSettingsQuery } from "@/features/settings/queries/useGetPromptSettingsQuery";
import { usePutPromptSettingsMutation } from "@/features/settings/queries/usePutPromptSettingsMutation";
import type { DomainPromptSettings, SettingsDomain } from "@/features/settings/types/settings";

export function SettingsScreen() {
  const [activeDomain, setActiveDomain] = useState<SettingsDomain>("production");
  const [draft, setDraft] = useState<Record<SettingsDomain, DomainPromptSettings>>({
    production: DEFAULT_DOMAIN_SETTINGS,
    ordering: DEFAULT_DOMAIN_SETTINGS,
    sales: DEFAULT_DOMAIN_SETTINGS,
  });
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const { data, isLoading } = useGetPromptSettingsQuery();
  const mutation = usePutPromptSettingsMutation();

  useEffect(() => {
    if (data) {
      setDraft({
        production: data.domains.production ?? DEFAULT_DOMAIN_SETTINGS,
        ordering: data.domains.ordering ?? DEFAULT_DOMAIN_SETTINGS,
        sales: data.domains.sales ?? DEFAULT_DOMAIN_SETTINGS,
      });
      setSavedAt(data.updated_at);
    }
  }, [data]);

  const handleReset = () => {
    if (!data) return;
    setDraft({
      production: data.domains.production ?? DEFAULT_DOMAIN_SETTINGS,
      ordering: data.domains.ordering ?? DEFAULT_DOMAIN_SETTINGS,
      sales: data.domains.sales ?? DEFAULT_DOMAIN_SETTINGS,
    });
  };

  const handleSave = async () => {
    const result = await mutation.mutateAsync({ domains: draft, updated_by: "hq_admin" });
    setSavedAt(result.updated_at);
  };

  const serverDraft = data
    ? { production: data.domains.production, ordering: data.domains.ordering, sales: data.domains.sales }
    : null;
  const isDirty = JSON.stringify(draft) !== JSON.stringify(serverDraft);

  const activeDomainLabel = SETTINGS_DOMAINS.find((d) => d.key === activeDomain)?.label;

  return (
    <div className="space-y-6">
      <PageHero
        title="AI 설정"
        description="도메인별 AI 시스템 지시문과 추천 질문을 관리합니다."
      />

      <div className="grid grid-cols-[200px_1fr] gap-6 items-start">
        <SettingsDomainNav activeDomain={activeDomain} onChangeDomain={setActiveDomain} />

        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">
                {activeDomainLabel} 프롬프트 설정
              </h3>
              {savedAt && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  마지막 저장: {new Date(savedAt).toLocaleString("ko-KR")}
                </p>
              )}
            </div>
            {isDirty && (
              <span className="inline-flex items-center rounded-md border border-orange-400 px-2 py-0.5 text-[11px] text-orange-600">
                미저장 변경사항
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
              불러오는 중...
            </div>
          ) : (
            <SettingsDomainEditor
              value={draft[activeDomain]}
              onChange={(next) => setDraft((prev) => ({ ...prev, [activeDomain]: next }))}
            />
          )}

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleReset}
              disabled={!isDirty || mutation.isPending}
              className="inline-flex h-8 items-center justify-center rounded-md border border-border px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              되돌리기
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || mutation.isPending}
              className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mutation.isPending ? "저장 중..." : "저장"}
            </button>
          </div>

          {mutation.isError && (
            <p className="text-xs text-destructive text-right">
              저장에 실패했습니다. 다시 시도해 주세요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}