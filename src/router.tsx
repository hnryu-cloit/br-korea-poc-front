import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/commons/components/layout/AppLayout";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { HQCoachingPage } from "@/pages/HQCoachingPage";
import { HQInspectionPage } from "@/pages/HQInspectionPage";
import { OrchestrationPage } from "@/pages/OrchestrationPage";
import { OrderingPage } from "@/pages/OrderingPage";
import { ProductionPage } from "@/pages/ProductionPage";
import { SalesPage } from "@/pages/SalesPage";
import { SignalsPage } from "@/pages/SignalsPage";

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
