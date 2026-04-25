import { Menu } from "lucide-react";

import bizLogo from "@/assets/biz_logo.png";
import dunkinLogo from "@/assets/dunkin_logo.png";
import { Alert } from "@/commons/components/layout/header/Alert";
import { ReferenceDate } from "@/commons/components/layout/header/ReferenceDate";
import { Store } from "@/commons/components/layout/header/Store";
import type { ApiNotification } from "@/features/notifications/types/notifications";

type Props = {
  onMenuToggle: () => void;
  notifications: ApiNotification[];
  unreadCount: number;
};

export function Header({ onMenuToggle, notifications, unreadCount }: Props) {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-[52px] border-b border-[#DADADA] bg-white px-4">
      <div className="flex h-full items-center justify-between">
        <button
          type="button"
          onClick={onMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#dce4f3] bg-[#f7faff] text-slate-500 transition-colors hover:border-[#bfd1ed] hover:text-slate-700 lg:hidden"
          aria-label="메뉴 열기"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <img src={bizLogo} alt="BR Korea" className="h-4.5" />
          <div className="h-[16px] w-[2px] bg-[#DADADA]" />
          <img src={dunkinLogo} alt="Dunkin" className="h-4" />
        </div>

        <div className="flex items-center gap-3">
          <ReferenceDate />
          <Alert notifications={notifications} unreadCount={unreadCount} />
          <Store />
        </div>
      </div>
    </header>
  );
}
