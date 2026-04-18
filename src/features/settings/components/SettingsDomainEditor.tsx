import type { DomainPromptSettings } from "@/features/settings/types/settings";

interface Props {
  value: DomainPromptSettings;
  onChange: (next: DomainPromptSettings) => void;
}

export function SettingsDomainEditor({ value, onChange }: Props) {
  const handlePromptChange = (index: number, text: string) => {
    const next = [...value.quick_prompts];
    next[index] = text;
    onChange({ ...value, quick_prompts: next });
  };

  const handleAddPrompt = () => {
    if (value.quick_prompts.length >= 5) return;
    onChange({ ...value, quick_prompts: [...value.quick_prompts, ""] });
  };

  const handleRemovePrompt = (index: number) => {
    onChange({ ...value, quick_prompts: value.quick_prompts.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">시스템 지시문</label>
        <p className="text-xs text-muted-foreground mb-2">
          AI가 이 도메인의 질의에 응답할 때 따르는 역할과 원칙을 정의합니다.
        </p>
        <textarea
          className="w-full min-h-[140px] rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
          value={value.system_instruction}
          onChange={(e) => onChange({ ...value, system_instruction: e.target.value })}
          placeholder="예: 당신은 생산관리 코치입니다. 점포별 재고/생산 데이터 근거만 사용하고, 즉시 실행할 수 있는 액션을 우선 제시하세요."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-semibold text-foreground">추천 질문</label>
          <span className="text-xs text-muted-foreground">{value.quick_prompts.length} / 5</span>
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          화면에 표시될 클릭 가능한 추천 질문입니다. 최대 5개.
        </p>
        <div className="space-y-2">
          {value.quick_prompts.map((prompt, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={prompt}
                onChange={(e) => handlePromptChange(i, e.target.value)}
                placeholder={`추천 질문 ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => handleRemovePrompt(i)}
                className="px-2 text-muted-foreground hover:text-destructive transition-colors text-sm"
              >
                ✕
              </button>
            </div>
          ))}
          {value.quick_prompts.length < 5 && (
            <button
              type="button"
              onClick={handleAddPrompt}
              className="w-full rounded-lg border border-dashed border-border py-2 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              + 질문 추가
            </button>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">질의 접두 템플릿</label>
        <p className="text-xs text-muted-foreground mb-2">
          AI로 전달되는 질문 앞에 붙는 맥락 정보입니다.{" "}
          <code className="bg-muted px-1 rounded text-[11px]">{"{store_id}"}</code>,{" "}
          <code className="bg-muted px-1 rounded text-[11px]">{"{domain}"}</code>,{" "}
          <code className="bg-muted px-1 rounded text-[11px]">{"{question}"}</code> 변수 사용 가능.
        </p>
        <input
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
          value={value.query_prefix_template}
          onChange={(e) => onChange({ ...value, query_prefix_template: e.target.value })}
          placeholder="[점포:{store_id}] [도메인:{domain}] {question}"
        />
      </div>
    </div>
  );
}