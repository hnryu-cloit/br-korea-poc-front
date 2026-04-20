import { Link } from "react-router-dom";

import { PageHero } from "@/commons/components/page/page-layout";
import { settingOverviewCards } from "@/features/settings/components/SettingsOpsMockPanels";
import { SettingsSubNav } from "@/features/settings/components/SettingsSubNav";

export function SettingsOverviewScreen() {
  return (
    <div className="space-y-6">
      <PageHero
        title="설정"
        description="운영 설정, 데이터 연결 상태, 접근 권한, 감사 로그, 품질 검증 이력을 관리합니다."
      />

      <SettingsSubNav />

      <section className="grid gap-4 xl:grid-cols-2">
        {settingOverviewCards.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="rounded-2xl border border-border bg-white p-5 shadow-[0_10px_26px_rgba(16,32,51,0.06)] transition-colors hover:border-[#bfd1ed] hover:bg-[#f9fbff]"
          >
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-[#eef4ff] p-2 text-[#2454C8]">
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-base font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{item.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
