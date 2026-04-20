import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { FloatingAiChat } from "@/commons/components/chat/FloatingAiChat";
import { AppHeader } from "@/commons/components/layout/AppHeader";
import { AppSidebar } from "@/commons/components/layout/AppSidebar";
import { SessionExpiryGuard } from "@/commons/components/session/SessionExpiryGuard";
import { FloatingAiChatProvider } from "@/commons/contexts/FloatingAiChatProvider";
import { useGetNotificationsQuery } from "@/features/notifications/queries/useGetNotificationsQuery";

export function AppLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isStartPage = location.pathname === "/";
  const notificationsQuery = useGetNotificationsQuery();
  const notifications = notificationsQuery.data?.items ?? [];
  const unreadCount = notificationsQuery.data?.unread_count ?? 0;

  return (
    <FloatingAiChatProvider>
      <div className="min-h-screen bg-background text-foreground">
        {!isStartPage ? <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /> : null}
        {!isStartPage ? (
          <AppHeader
            onMenuToggle={() => setSidebarOpen((v) => !v)}
            notifications={notifications}
            unreadCount={unreadCount}
          />
        ) : null}
        <div className={`min-h-screen flex flex-col ${isStartPage ? "" : "lg:ml-64"}`}>
          <main className={`mx-auto w-full flex-1 px-5 md:px-8 lg:max-w-none lg:px-10 ${isStartPage ? "flex min-h-screen items-center justify-center py-6" : "pb-14 pt-[96px]"}`}>
            <div className="mx-auto w-full max-w-[1280px]">
              <Outlet />
            </div>
          </main>
        </div>
        {!isStartPage ? <FloatingAiChat /> : null}
        {!isStartPage ? <SessionExpiryGuard /> : null}
      </div>
    </FloatingAiChatProvider>
  );
}
