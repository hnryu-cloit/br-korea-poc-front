import { SETTINGS_DOMAINS } from "@/features/settings/constants/settings-domains";
import type { SettingsDomain } from "@/features/settings/types/settings";

interface Props {
  activeDomain: SettingsDomain;
  onChangeDomain: (domain: SettingsDomain) => void;
}

export function SettingsDomainNav({ activeDomain, onChangeDomain }: Props) {
  return (
    <nav className="rounded-xl border border-border bg-card p-2 space-y-0.5">
      <p className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">
        도메인
      </p>
      {SETTINGS_DOMAINS.map(({ key, label, description }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChangeDomain(key)}
          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
            activeDomain === key
              ? "bg-primary text-primary-foreground font-semibold"
              : "text-foreground hover:bg-muted"
          }`}
        >
          <span className="block font-medium">{label}</span>
          <span
            className={`block text-[11px] mt-0.5 ${
              activeDomain === key ? "text-primary-foreground/70" : "text-muted-foreground"
            }`}
          >
            {description}
          </span>
        </button>
      ))}
    </nav>
  );
}
