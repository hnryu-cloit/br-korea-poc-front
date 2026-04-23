import {
  AGENT_TABS,
  ORCHESTRATION_DOMAIN_LABEL,
} from "@/features/admin/orchestration/constants/orchestration";
import type {
  PromptDomainKey,
  SettingsModalKey,
} from "@/features/admin/orchestration/types/orchestration";

type PromptDomainForm = {
  quickPromptsText: string;
  systemInstruction: string;
  queryPrefixTemplate: string;
};

type Props = {
  form: Record<PromptDomainKey, PromptDomainForm>;
  activeAgent: PromptDomainKey;
  onAgentChange: (key: PromptDomainKey) => void;
  onFieldChange: (domain: PromptDomainKey, key: keyof PromptDomainForm, value: string) => void;
  onSave: () => void;
  onReset: () => void;
  isDirty: boolean;
  isSaving: boolean;
  saveMessage: string | null;
  updatedAtText: string;
  updatedBy: string;
  onOpenModal: (key: SettingsModalKey) => void;
};

function getAgentPrefix(agent: PromptDomainKey) {
  if (agent === "production") return "[생산관리]";
  if (agent === "ordering") return "[주문관리]";
  return "[매출관리]";
}

export function PromptsPanel({
  form,
  activeAgent,
  onAgentChange,
  onFieldChange,
  onSave,
  onReset,
  isDirty,
  isSaving,
  saveMessage,
  updatedAtText,
  updatedBy,
  onOpenModal,
}: Props) {
  const activeForm = form[activeAgent];
  const activeLabel = ORCHESTRATION_DOMAIN_LABEL[activeAgent];

  return (
    <section>
      <div className="pgh">
        <div className="pgh-l">
          <h1>AI 프롬프트 설정</h1>
          <p>Agent별 다중 프롬프트 관리 · 버전 이력 · 테스트 콘솔</p>
        </div>
        <div className="pgh-r">
          <span className="b bo">
            마지막 수정: {updatedAtText} {updatedBy ? `· ${updatedBy}` : ""}
          </span>
          {isDirty ? <span className="b ba">미저장</span> : null}
          <button
            type="button"
            className="btn btn-g btn-sm"
            disabled={!isDirty || isSaving}
            onClick={onReset}
          >
            되돌리기
          </button>
          <button
            type="button"
            className="btn btn-p btn-sm"
            disabled={!isDirty || isSaving}
            onClick={onSave}
          >
            {isSaving ? "저장 중" : "저장"}
          </button>
        </div>
      </div>

      <div className="ptabs" id="agent-ptabs">
        {AGENT_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`ptab ${activeAgent === tab.key ? "active" : ""}`}
            onClick={() => onAgentChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="psubtab active">
        <div className="g2" style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="pc">
              <div className="pc-hdr">
                <span className="b bg" style={{ fontSize: 10 }}>
                  대화
                </span>
                <span className="pc-type">기본 대화 프롬프트</span>
                <button
                  type="button"
                  className="btn btn-g btn-sm"
                  style={{ marginLeft: "auto" }}
                  onClick={() => onOpenModal("prompt-test")}
                >
                  테스트
                </button>
              </div>
              <textarea
                className="si"
                style={{ minHeight: 100, resize: "vertical" }}
                value={activeForm.systemInstruction}
                onChange={(e) => onFieldChange(activeAgent, "systemInstruction", e.target.value)}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                <span style={{ fontSize: 10, color: "var(--t3)" }}>
                  변수: {"{store_id}"} {"{threshold}"}
                </span>
                <span className="b bb" style={{ fontSize: 9.5 }}>
                  v3.2.1
                </span>
              </div>
            </div>

            <div className="pc">
              <div className="pc-hdr">
                <span className="b bpu" style={{ fontSize: 10 }}>
                  시각화
                </span>
                <span className="pc-type">데이터 시각화 프롬프트</span>
              </div>
              <textarea
                className="si"
                style={{ minHeight: 90, resize: "vertical" }}
                value={activeForm.queryPrefixTemplate}
                onChange={(e) => onFieldChange(activeAgent, "queryPrefixTemplate", e.target.value)}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                <span style={{ fontSize: 10, color: "var(--t3)" }}>
                  변수: {"{chart_type}"} {"{data_range}"}
                </span>
                <span className="b bb" style={{ fontSize: 9.5 }}>
                  v1.0.2
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="pc">
              <div className="pc-hdr">
                <span className="b bo" style={{ fontSize: 10 }}>
                  인사이트
                </span>
                <span className="pc-type">인사이트 도출 프롬프트</span>
              </div>
              <textarea
                className="si"
                style={{ minHeight: 90, resize: "vertical" }}
                value={activeForm.systemInstruction}
                onChange={(e) => onFieldChange(activeAgent, "systemInstruction", e.target.value)}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                <span style={{ fontSize: 10, color: "var(--t3)" }}>변수: {"{threshold_pct}"}</span>
                <span className="b bb" style={{ fontSize: 9.5 }}>
                  v2.1.0
                </span>
              </div>
            </div>

            <div className="pc">
              <div className="pc-hdr">
                <span className="b bgy" style={{ fontSize: 10 }}>
                  빠른질문
                </span>
                <span className="pc-type">빠른 질문 목록</span>
              </div>
              <textarea
                className="si"
                style={{ minHeight: 120, resize: "vertical" }}
                value={activeForm.quickPromptsText}
                onChange={(e) => onFieldChange(activeAgent, "quickPromptsText", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div className="ch">
            <span className="ct">쿼리 접두 템플릿</span>
          </div>
          <input
            className="si"
            type="text"
            value={activeForm.queryPrefixTemplate}
            onChange={(e) => onFieldChange(activeAgent, "queryPrefixTemplate", e.target.value)}
          />
          <div className="ch" style={{ marginTop: 10 }}>
            <span className="ct" style={{ fontSize: 12 }}>
              버전 이력
            </span>
          </div>
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th>버전</th>
                  <th>수정일</th>
                  <th>변경 내용</th>
                  <th>수정자</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 700, color: "var(--orange)" }}>
                    v3.2.1{" "}
                    <span className="b bg" style={{ fontSize: 9 }}>
                      현재
                    </span>
                  </td>
                  <td className="sub">2026-04-18</td>
                  <td className="sub">빠른 질문 3개 추가, 인사이트 임계값 강화</td>
                  <td className="sub">hq_admin</td>
                  <td>
                    <button type="button" className="btn btn-g btn-sm">
                      복원
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>v3.2.0</td>
                  <td className="sub">2026-04-10</td>
                  <td className="sub">시각화 프롬프트 신규 추가</td>
                  <td className="sub">sujin.lee</td>
                  <td>
                    <button type="button" className="btn btn-g btn-sm">
                      복원
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {saveMessage ? (
        <div className="card" style={{ marginTop: 10, marginBottom: 0 }}>
          <span className={saveMessage.includes("실패") ? "b br" : "b bg"}>
            {getAgentPrefix(activeAgent)} {activeLabel} {saveMessage}
          </span>
        </div>
      ) : null}
    </section>
  );
}
