import type React from "react";
import { RouterProvider } from "react-router-dom";

import { DemoSessionProvider } from "@/features/session";
import { QueryProvider } from "@/providers/QueryProvider";
import { router } from "@/router/index";

export const App: React.FC = () => {
  return (
    <QueryProvider>
      <DemoSessionProvider>
        <RouterProvider router={router} />
      </DemoSessionProvider>
    </QueryProvider>
  );
};

export default App;
