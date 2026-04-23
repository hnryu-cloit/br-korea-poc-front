import type { ReactNode } from "react";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { FloatingAiChat } from "@/commons/components/chat/FloatingAiChat";
import { AppHeader } from "@/commons/components/layout/AppHeader";
import { AppSidebar } from "@/commons/components/layout/AppSidebar";
import { FloatingScrollTopButton } from "@/commons/components/page/FloatingScrollTopButton";
import { ScrollToTopOnRouteChange } from "@/commons/components/page/ScrollToTopOnRouteChange";
import { SessionExpiryGuard } from "@/commons/components/session/SessionExpiryGuard";
import { FloatingAiChatProvider } from "@/commons/contexts/FloatingAiChatProvider";
import { useGetNotificationsQuery } from "@/features/notifications/queries/useGetNotificationsQuery";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

type Props = { reminder?: ReactNode };

export function AppLayout({ reminder }: Props) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useDemoSession();
  const isStartPage = location.pathname === "/";
  const isHqSettingsRoute = user.role === "hq_admin" && location.pathname.startsWith("/settings");
  const notificationsQuery = useGetNotificationsQuery();
  const notifications = notificationsQuery.data?.items ?? [];
  const unreadCount = notificationsQuery.data?.unread_count ?? 0;
  const isDashboardPage = location.pathname === "/dashboard";

  return (
    <FloatingAiChatProvider>
      <ScrollToTopOnRouteChange />
      <div className="min-h-screen bg-background text-foreground">
        {!isStartPage && !isHqSettingsRoute ? (
          <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        ) : null}
        {!isStartPage && !isHqSettingsRoute ? (
          <AppHeader
            onMenuToggle={() => setSidebarOpen((v) => !v)}
            notifications={notifications}
            unreadCount={unreadCount}
          />
        ) : null}
        <div
          className={`min-h-screen flex flex-col ${isStartPage || isHqSettingsRoute ? "" : "lg:ml-[126px]"}`}
        >
          <main
            className={`mx-auto w-full flex-1 lg:max-w-none ${isStartPage ? "flex min-h-screen items-center justify-center py-6" : ""} ${isHqSettingsRoute ? "p-0" : isDashboardPage ? "pt-[68px] pb-0 bg-[#F9F9F9]" : "px-5 md:px-8 lg:px-10 pb-14 pt-[96px]"}`}
          >
            {isHqSettingsRoute ? (
              <Outlet />
            ) : (
              <div className="mx-auto w-full max-w-[1280px]">
                <Outlet />
              </div>
            )}
          </main>
        </div>
        {!isStartPage && !isHqSettingsRoute ? <FloatingScrollTopButton /> : null}
        {!isStartPage && !isHqSettingsRoute ? <FloatingAiChat /> : null}
        {!isStartPage && !isHqSettingsRoute ? reminder : null}
        {!isStartPage && !isHqSettingsRoute ? <SessionExpiryGuard /> : null}
      </div>
    </FloatingAiChatProvider>
  );
}
