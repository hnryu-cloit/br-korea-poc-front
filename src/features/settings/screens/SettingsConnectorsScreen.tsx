import { PageHero } from "@/commons/components/page/page-layout";
import { SettingsConnectorsPanel } from "@/features/settings/components/SettingsOpsMockPanels";
import { SettingsSubNav } from "@/features/settings/components/SettingsSubNav";

export function SettingsConnectorsScreen() {
  return (
    <div className="space-y-6">
      <PageHero
        title="설정 · 데이터 커넥터"
        description="원천 데이터 커넥터 상태와 동기화 품질을 확인합니다."
      />
      <SettingsSubNav />
      <SettingsConnectorsPanel />
    </div>
  );
}
