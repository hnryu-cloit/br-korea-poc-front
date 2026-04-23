import { useLocation } from "react-router-dom";

import {
  PATH_PANEL_MAP,
} from "@/features/admin/orchestration/constants/orchestration";
import { AgentsPanel } from "@/features/admin/orchestration/components/AgentsPanel";
import { AuditPanelV3 } from "@/features/admin/orchestration/components/AuditPanelV3";
import { ConnectorsPanelV3 } from "@/features/admin/orchestration/components/ConnectorsPanelV3";
import { GoldenQueriesPanel } from "@/features/admin/orchestration/components/GoldenQueriesPanel";
import { NoticesPanel } from "@/features/admin/orchestration/components/NoticesPanel";
import { OrchPipelinePanel } from "@/features/admin/orchestration/components/OrchPipelinePanel";
import { PromptsPanel } from "@/features/admin/orchestration/components/PromptsPanel";
import { QualityPanelV3 } from "@/features/admin/orchestration/components/QualityPanelV3";
import { RbacPanel } from "@/features/admin/orchestration/components/RbacPanel";
import { SettingsModal } from "@/features/admin/orchestration/components/SettingsModal";
import { SettingsSidebar } from "@/features/admin/orchestration/components/SettingsSidebar";
import { useOrchestrationScreen } from "@/features/admin/orchestration/hooks/useOrchestrationScreen";
import type { SettingsPanelKey } from "@/features/admin/orchestration/types/orchestration";

export function OrchestrationScreen() {
  const location = useLocation();
  const activePanel: SettingsPanelKey = PATH_PANEL_MAP[location.pathname] ?? "agents";

  const {
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
  } = useOrchestrationScreen();

  const renderPanel = () => {
    if (activePanel === "agents") return <AgentsPanel onOpenModal={setActiveModal} />;
    if (activePanel === "orch") return <OrchPipelinePanel onOpenModal={setActiveModal} />;
    if (activePanel === "connectors") return <ConnectorsPanelV3 onOpenModal={setActiveModal} />;
    if (activePanel === "rbac") return <RbacPanel onOpenModal={setActiveModal} />;
    if (activePanel === "prompts")
      return (
        <PromptsPanel
          form={form}
          activeAgent={activeAgent}
          onAgentChange={setActiveAgent}
          onFieldChange={handleFieldChange}
          onSave={handleSave}
          onReset={handleReset}
          isDirty={isDirty}
          isSaving={false}
          saveMessage={saveMessage}
          updatedAtText="-"
          updatedBy="-"
          onOpenModal={setActiveModal}
        />
      );
    if (activePanel === "golden") return <GoldenQueriesPanel onOpenModal={setActiveModal} />;
    if (activePanel === "audit") return <AuditPanelV3 />;
    if (activePanel === "quality") return <QualityPanelV3 />;
    if (activePanel === "notices")
      return (
        <NoticesPanel
          onOpenModal={setActiveModal}
          onSelectNotice={setSelectedNotice}
        />
      );
    return null;
  };

  return (
    <div className="settings-v3 h-full">
      <div className="settings-v3-shell">
        <header className="settings-v3-hdr">
          <span className="settings-v3-logo-dot">
            <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
              <polygon fill="currentColor" points="6,0 12,3 12,9 6,12 0,9 0,3" />
            </svg>
          </span>
          <span className="text-[12px] font-bold text-[#1c1008]">Biz</span>
          <span className="settings-v3-brand">DUNKIN'</span>
          <span className="settings-v3-divider" />
          <span className="settings-v3-page">시스템 설정</span>
          <div className="settings-v3-right">
            <span className="settings-v3-badge">본사 관리자</span>
            <div className="settings-v3-user">
              <span className="settings-v3-avatar">관</span>
              <span>hq_admin</span>
            </div>
          </div>
        </header>
        <div className="settings-v3-layout">
          <SettingsSidebar activePanel={activePanel} />
          <main className="settings-v3-main">{renderPanel()}</main>
        </div>
      </div>

      <SettingsModal
        activeModal={activeModal}
        selectedNotice={selectedNotice}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
