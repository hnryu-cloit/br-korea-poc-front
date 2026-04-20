import { PageHero } from "@/commons/components/page/page-layout";
import { SettingsAuditLogsPanel } from "@/features/settings/components/SettingsOpsMockPanels";
import { SettingsSubNav } from "@/features/settings/components/SettingsSubNav";

export function SettingsAuditLogsScreen() {
  return (
    <div className="space-y-6">
      <PageHero
        title="설정 · 대화 감사 로그"
        description="질의 처리 경로와 차단 이력을 추적합니다."
      />
      <SettingsSubNav />
      <SettingsAuditLogsPanel />
    </div>
  );
}
