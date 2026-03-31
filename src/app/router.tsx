import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../components/layout/AppLayout";
import { AnalyticsPage } from "../pages/AnalyticsPage";
import { DashboardPage } from "../pages/DashboardPage";
import { OrchestrationPage } from "../pages/OrchestrationPage";
import { OrderingPage } from "../pages/OrderingPage";
import { ProductionPage } from "../pages/ProductionPage";
import { SalesPage } from "../pages/SalesPage";
import { SVCoachingPage } from "../pages/SVCoachingPage";
import { SVInspectionPage } from "../pages/SVInspectionPage";
import { SignalsPage } from "../pages/SignalsPage";

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
    path: "/sv/coaching",
    element: <AppLayout><SVCoachingPage /></AppLayout>,
  },
  {
    path: "/sv/inspection",
    element: <AppLayout><SVInspectionPage /></AppLayout>,
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