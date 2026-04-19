import { useState } from "react";
import { Outlet } from "react-router-dom";

import { FloatingAiChat } from "@/commons/components/chat/FloatingAiChat";
import { AppHeader } from "@/commons/components/layout/AppHeader";
import { AppSidebar } from "@/commons/components/layout/AppSidebar";
import { SessionExpiryGuard } from "@/commons/components/session/SessionExpiryGuard";
import { FloatingAiChatProvider } from "@/commons/contexts/FloatingAiChatProvider";
import { useGetNotificationsQuery } from "@/features/notifications/queries/useGetNotificationsQuery";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const notificationsQuery = useGetNotificationsQuery();
  const notifications = notificationsQuery.data?.items ?? [];
  const unreadCount = notificationsQuery.data?.unread_count ?? 0;

  return (
    <FloatingAiChatProvider>
      <div className="min-h-screen bg-background text-foreground">
        <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <AppHeader
          onMenuToggle={() => setSidebarOpen((v) => !v)}
          notifications={notifications}
          unreadCount={unreadCount}
        />
        <div className="min-h-screen flex flex-col lg:ml-64">
          <main className="mx-auto w-full flex-1 px-5 pb-14 pt-[96px] md:px-8 lg:max-w-none lg:px-10">
            <div className="mx-auto w-full max-w-[1280px]">
              <Outlet />
            </div>
          </main>
        </div>
        <FloatingAiChat />
        <SessionExpiryGuard />
      </div>
    </FloatingAiChatProvider>
  );
}
