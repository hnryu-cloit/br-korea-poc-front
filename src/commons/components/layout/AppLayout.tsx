import type { ReactNode } from "react";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { FloatingAiChat } from "@/commons/components/chat/FloatingAiChat";
import { AppHeader } from "@/commons/components/layout/AppHeader";
import { AppSidebar } from "@/commons/components/layout/AppSidebar";
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

  return (
    <FloatingAiChatProvider>
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
          className={`min-h-screen flex flex-col ${isStartPage || isHqSettingsRoute ? "" : "lg:ml-64"}`}
        >
          <main
            className={`mx-auto w-full flex-1 ${isHqSettingsRoute ? "px-3 py-3 md:px-5 md:py-4" : "px-5 md:px-8 lg:max-w-none lg:px-10"} ${isStartPage ? "flex min-h-screen items-center justify-center py-6" : isHqSettingsRoute ? "" : "pb-14 pt-[96px]"}`}
          >
            <div className={`mx-auto w-full ${isHqSettingsRoute ? "" : "max-w-[1280px]"}`}>
              <Outlet />
            </div>
          </main>
        </div>
        {!isStartPage && !isHqSettingsRoute ? <FloatingAiChat /> : null}
        {!isStartPage && !isHqSettingsRoute ? reminder : null}
        {!isStartPage && !isHqSettingsRoute ? <SessionExpiryGuard /> : null}
      </div>
    </FloatingAiChatProvider>
  );
}
