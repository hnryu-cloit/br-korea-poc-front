import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
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
    element: <AppLayout><DashboardPage /></AppLayout>,
  },
  {
    path: "/production",
    element: <AppLayout><ProductionPage /></AppLayout>,
  },
  {
    path: "/ordering",
    element: <AppLayout><OrderingPage /></AppLayout>,
  },
  {
    path: "/sales",
    element: <AppLayout><SalesPage /></AppLayout>,
  },
  {
    path: "/analytics",
    element: <AppLayout><AnalyticsPage /></AppLayout>,
  },
  {
    path: "/hq/coaching",
    element: <AppLayout><HQCoachingPage /></AppLayout>,
  },
  {
    path: "/hq/inspection",
    element: <AppLayout><HQInspectionPage /></AppLayout>,
  },
  {
    path: "/orchestration",
    element: <AppLayout><OrchestrationPage /></AppLayout>,
  },
  {
    path: "/signals",
    element: <AppLayout><SignalsPage /></AppLayout>,
  },
]);
