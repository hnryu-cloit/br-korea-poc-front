import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "./app/router";
import { queryClient } from "./app/providers/query-client";
import { DemoSessionProvider } from "./contexts/DemoSessionContext";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DemoSessionProvider>
        <RouterProvider router={router} />
      </DemoSessionProvider>
    </QueryClientProvider>
  );
}
