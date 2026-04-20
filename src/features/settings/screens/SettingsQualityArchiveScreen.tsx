import { PageHero } from "@/commons/components/page/page-layout";
import { SettingsQualityArchivePanel } from "@/features/settings/components/SettingsOpsMockPanels";
import { SettingsSubNav } from "@/features/settings/components/SettingsSubNav";

export function SettingsQualityArchiveScreen() {
  return (
    <div className="space-y-6">
      <PageHero
        title="설정 · 품질 검증 아카이브"
        description="품질 점수와 검증 이력을 배치 단위로 관리합니다."
      />
      <SettingsSubNav />
      <SettingsQualityArchivePanel />
    </div>
  );
}
