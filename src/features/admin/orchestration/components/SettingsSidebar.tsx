import { useNavigate } from "react-router-dom";

import {
  PANEL_PATH_MAP,
  SIDEBAR_GROUPS,
} from "@/features/admin/orchestration/constants/orchestration";
import type { SettingsPanelKey } from "@/features/admin/orchestration/types/orchestration";

type Props = {
  activePanel: SettingsPanelKey;
};

export function SettingsSidebar({ activePanel }: Props) {
  const navigate = useNavigate();

  return (
    <aside className="settings-v3-nav">
      {SIDEBAR_GROUPS.map((group) => (
        <section key={group.label}>
          <p className="settings-v3-nav-label">{group.label}</p>
          <div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activePanel === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => navigate(PANEL_PATH_MAP[item.key])}
                  className={`settings-v3-nav-item ${isActive ? "active" : ""}`}
                >
                  <Icon className="settings-v3-nav-item-icon" />
                  <span className="truncate">{item.label}</span>
                  {item.pill ? (
                    <span className={`settings-v3-nav-pill ${item.pillTone ?? ""}`}>
                      {item.pill}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </aside>
  );
}
