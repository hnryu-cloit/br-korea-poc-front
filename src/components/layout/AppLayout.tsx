import { useState, type PropsWithChildren } from "react";

import { AppHeader } from "@/components/commons/AppHeader";
import { AppSidebar } from "@/components/commons/AppSidebar";

export function AppLayout({ children }: PropsWithChildren) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AppHeader onMenuToggle={() => setSidebarOpen((v) => !v)} />
      <div className="min-h-screen flex flex-col lg:ml-64">
        <main className="mx-auto w-full flex-1 px-5 pb-14 pt-[96px] md:px-8 lg:max-w-none lg:px-10">
          <div className="mx-auto w-full max-w-[1280px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
