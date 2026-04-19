import type React from "react";
import { RouterProvider } from "react-router-dom";

import { ErrorBoundary } from "@/commons/components/error/ErrorBoundary";
import { DemoSessionProvider } from "@/features/session/context/DemoSessionProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { router } from "@/router";

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <DemoSessionProvider>
          <RouterProvider router={router} />
        </DemoSessionProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
};

export default App;
