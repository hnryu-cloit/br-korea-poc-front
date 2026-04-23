import { NavLink, useLocation } from "react-router-dom";

import { menuSections } from "@/commons/components/layout/menu";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";
import { cn } from "@/lib/utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const DEFAULT_ICON_FILTER =
  "brightness(0) saturate(100%) invert(20%) sepia(26%) saturate(1452%) hue-rotate(342deg) brightness(90%) contrast(89%)";
const ACTIVE_ICON_FILTER =
  "brightness(0) saturate(100%) invert(58%) sepia(82%) saturate(3662%) hue-rotate(348deg) brightness(103%) contrast(102%)";

export function AppSidebar({ isOpen, onClose }: Props) {
  const { pathname } = useLocation();
  const { user } = useDemoSession();
  const currentRole = user.role;
  const visibleSections = menuSections.filter(
    (section) => !section.roles || section.roles.includes(currentRole),
  );

  const isRouteActive = (to: string) =>
    to === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === to || pathname.startsWith(`${to}/`);

  const SidebarContent = (
    <div className="flex h-full w-full flex-col px-4 py-3">
      <nav className="scrollbar-hide flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6">
          {visibleSections.map((section, sectionIndex) => (
            <div key={section.section ?? sectionIndex} className="flex flex-col gap-1">
              {section.section ? (
                <p className="text-[12px] font-bold text-[#716862]">{section.section}</p>
              ) : null}

              <div className="flex flex-col gap-1">
                {section.items.map((item) => {
                  const isActive = isRouteActive(item.to);

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-2 rounded-[4px] px-2 py-[14px]",
                        isActive ? "bg-[#FAF4F2]" : "bg-transparent",
                      )}
                    >
                      <img
                        src={item.icon}
                        alt=""
                        aria-hidden="true"
                        className="h-[18px] w-[18px] shrink-0"
                        style={{ filter: isActive ? ACTIVE_ICON_FILTER : DEFAULT_ICON_FILTER }}
                      />
                      <span
                        className={cn(
                          "whitespace-nowrap text-[14px] font-bold text-[#41352E]",
                          isActive ? "text-[#FF671F]" : "text-[#41352E]",
                        )}
                      >
                        {item.label}
                      </span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );

  return (
    <>
      <aside className="fixed left-0 top-[52px] z-30 hidden h-full w-[126px] border-r border-[#DADADA] bg-white lg:flex">
        {SidebarContent}
      </aside>

      {isOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-label="사이드바 닫기"
        />
      ) : null}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-[126px] border-r border-[#F1E8E3] bg-white shadow-xl transition-transform duration-300 lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {SidebarContent}
      </aside>
    </>
  );
}
