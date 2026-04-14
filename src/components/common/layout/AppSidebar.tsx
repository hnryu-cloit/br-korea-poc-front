import { NavLink, useLocation } from "react-router-dom";

import Logo from "@/assets/logo.svg";
import { menuSections } from "@/components/common/layout/menu";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";
import { cn } from "@/lib/utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function AppSidebar({ isOpen, onClose }: Props) {
  const { pathname } = useLocation();
  const { user } = useDemoSession();
  const currentRole = user.role;
  const visibleSections = menuSections.filter((section) => !section.roles || section.roles.includes(currentRole));

  const SidebarContent = (
    <div className="flex w-full flex-col p-5 h-full">
      <NavLink to="/" onClick={onClose} className="mb-6 inline-flex items-center px-1">
        <img src={Logo} alt="AgentGo" className="h-7 w-auto" />
      </NavLink>


      <nav className="scrollbar-hide flex-1 space-y-6 overflow-y-auto pb-6">
        {visibleSections.map((section, sectionIndex) => {
          const hasActive = section.items.some((item) => (item.to === "/" ? pathname === "/" : pathname.startsWith(item.to)));

          return (
            <div key={section.section ?? sectionIndex} className="space-y-1.5">
              {section.section ? (
                <div className="px-3 py-1">
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-[0.12em]",
                      hasActive ? "text-primary" : "text-slate-400",
                    )}
                  >
                    {section.section}
                  </span>
                </div>
              ) : null}

              <div className={cn("space-y-0.5", section.section ? "relative ml-1 border-l border-slate-100 pl-2" : undefined)}>
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all",
                        isActive
                          ? "bg-[#EDF3FF] text-[#2454C8]"
                          : "text-slate-500 hover:bg-[#F7FAFF] hover:text-slate-900",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive ? <div className="absolute left-[-9px] top-1/4 h-1/2 w-1 rounded-r-full bg-[#2454C8]" /> : null}
                        <span
                          className={cn(
                            "material-symbols-outlined text-[20px] transition-colors",
                            isActive ? "text-[#2454C8]" : "text-slate-400 group-hover:text-slate-600",
                          )}
                        >
                          {item.icon}
                        </span>
                        <span className={isActive ? "font-bold" : "font-medium"}>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-border/60 pt-4 text-center">
        <p className="text-[10px] leading-relaxed text-slate-400">
          © 2026 ITCEN CLOIT
          <br />
          All rights reserved
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-border bg-white shadow-sm z-50 lg:flex">
        {SidebarContent}
      </aside>

      {/* Mobile overlay */}
      {isOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-label="사이드바 닫기"
        />
      ) : null}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-72 border-r border-border bg-white shadow-xl z-50 transition-transform duration-300 lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {SidebarContent}
      </aside>
    </>
  );
}
