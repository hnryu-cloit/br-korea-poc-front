import { NavLink } from "react-router-dom";

const settingNavItems = [
  { to: "/settings", label: "개요" },
  { to: "/settings/connectors", label: "데이터 커넥터" },
  { to: "/settings/access", label: "멤버 & 접근 제어" },
  { to: "/settings/audit-logs", label: "대화 감사 로그" },
  { to: "/settings/quality-archive", label: "품질 검증 아카이브" },
  { to: "/settings/prompts", label: "프롬프트 설정" },
];

export function SettingsSubNav() {
  return (
    <section className="rounded-2xl border border-border bg-white p-3 shadow-[0_8px_20px_rgba(16,32,51,0.05)]">
      <div className="flex flex-wrap gap-2">
        {settingNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/settings"}
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-[#2454C8] text-white"
                  : "bg-[#f5f8ff] text-slate-600 hover:bg-[#e8efff] hover:text-[#2454C8]"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </section>
  );
}
