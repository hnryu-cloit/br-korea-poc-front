import { PageHero } from "@/commons/components/page/page-layout";
import { SETTINGS_DOMAINS } from "@/features/settings/constants/settings-domains";
import { useSettingsPromptForm } from "@/features/settings/hooks/useSettingsPromptForm";

export function SettingsScreen() {
  const {
    form,
    data,
    isLoading,
    mutation,
    savedAt,
    isDirty,
    handleReset,
    handleSave,
    handleDomainFieldChange,
  } = useSettingsPromptForm();

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
            마지막 수정: {savedAt ? new Date(savedAt).toLocaleString("ko-KR") : "-"} ·{" "}
            {data?.updated_by ?? "-"}
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
        <p className="mt-2 text-xs text-slate-400">
          도메인별 빠른 질문, 시스템 지시문, 쿼리 접두 템플릿을 관리합니다.
        </p>

        {isLoading ? (
          <p className="mt-4 text-sm text-slate-400">프롬프트 설정을 불러오는 중입니다...</p>
        ) : (
          <div className="mt-4 grid gap-4 xl:grid-cols-3">
            {SETTINGS_DOMAINS.map(({ key, label }) => (
              <article key={key} className="rounded-2xl border border-border bg-[#f8fbff] p-4">
                <p className="text-sm font-semibold text-slate-900">{label}</p>

                <label className="mt-3 block text-xs font-semibold text-slate-500">
                  빠른 질문(줄바꿈 구분, 최대 5개)
                </label>
                <textarea
                  value={form[key].quickPromptsText}
                  onChange={(event) =>
                    handleDomainFieldChange(key, "quickPromptsText", event.target.value)
                  }
                  className="mt-1 h-28 w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-[#2454C8]"
                />

                <label className="mt-3 block text-xs font-semibold text-slate-500">
                  시스템 프롬프트
                </label>
                <textarea
                  value={form[key].systemInstruction}
                  onChange={(event) =>
                    handleDomainFieldChange(key, "systemInstruction", event.target.value)
                  }
                  className="mt-1 h-28 w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-[#2454C8]"
                />

                <label className="mt-3 block text-xs font-semibold text-slate-500">
                  쿼리 접두 템플릿
                </label>
                <input
                  value={form[key].queryPrefixTemplate}
                  onChange={(event) =>
                    handleDomainFieldChange(key, "queryPrefixTemplate", event.target.value)
                  }
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
