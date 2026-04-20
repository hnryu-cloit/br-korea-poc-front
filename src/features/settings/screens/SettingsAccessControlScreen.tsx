import { PageHero } from "@/commons/components/page/page-layout";
import { SettingsAccessControlPanel } from "@/features/settings/components/SettingsOpsMockPanels";
import { SettingsSubNav } from "@/features/settings/components/SettingsSubNav";

export function SettingsAccessControlScreen() {
  return (
    <div className="space-y-6">
      <PageHero
        title="설정 · 멤버 & 접근 제어"
        description="역할별 접근 범위와 정책을 관리합니다."
      />
      <SettingsSubNav />
      <SettingsAccessControlPanel />
    </div>
  );
}
