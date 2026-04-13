import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/components/common/layout/AppLayout";
import {
  AnalyticsPage,
  DashboardPage,
  HQCoachingPage,
  HQInspectionPage,
  OrchestrationPage,
  OrderingPage,
  ProductionPage,
  SalesPage,
  SignalsPage,
} from "@/pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "production", element: <ProductionPage /> },
      { path: "ordering", element: <OrderingPage /> },
      { path: "sales", element: <SalesPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "hq/coaching", element: <HQCoachingPage /> },
      { path: "hq/inspection", element: <HQInspectionPage /> },
      { path: "orchestration", element: <OrchestrationPage /> },
      { path: "signals", element: <SignalsPage /> },
    ],
  },
]);
