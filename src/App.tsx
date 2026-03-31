import type React from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "@/app/router";
import { queryClient } from "@/app/providers/query-client";
import { DemoSessionProvider } from "@/contexts/DemoSessionContext";

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DemoSessionProvider>
        <RouterProvider router={router} />
      </DemoSessionProvider>
    </QueryClientProvider>
  );
};

export default App;
