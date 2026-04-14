import { useState } from "react";
import { Outlet } from "react-router-dom";

import { AppHeader } from "@/commons/components/layout/AppHeader";
import { AppSidebar } from "@/commons/components/layout/AppSidebar";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AppHeader onMenuToggle={() => setSidebarOpen((v) => !v)} />
      <div className="min-h-screen flex flex-col lg:ml-64">
        <main className="mx-auto w-full flex-1 px-5 pb-14 pt-[96px] md:px-8 lg:max-w-none lg:px-10">
          <div className="mx-auto w-full max-w-[1280px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
