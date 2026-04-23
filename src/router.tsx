import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/commons/components/layout/AppLayout";
import { OrderingDeadlineReminder } from "@/features/ordering/components/OrderingDeadlineReminder";
import { MOCK_ORDERING_DEADLINE_TIMES } from "@/features/ordering/data/mock-ordering-deadline-items";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { MarketPage } from "@/pages/MarketPage";
import { OrchestrationPage } from "@/pages/OrchestrationPage";
import { OrderingHistoryPage } from "@/pages/ordering/OrderingHistoryPage";
import { OrderingRecommendationsPage } from "@/pages/ordering/OrderingRecommendationsPage";
import { ProductionInventoryDiagnosisPage } from "@/pages/production/ProductionInventoryDiagnosisPage";
import { ProductionStatusPage } from "@/pages/production/ProductionStatusPage";
import { ProductionWasteLossPage } from "@/pages/production/ProductionWasteLossPage";
import { RoleSelectionPage } from "@/pages/RoleSelectionPage";
import { SalesMetricsPage } from "@/pages/sales/SalesMetricsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout reminder={<OrderingDeadlineReminder deadlineTimes={[...MOCK_ORDERING_DEADLINE_TIMES]} />} />,
    children: [
      { index: true, element: <RoleSelectionPage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "production", element: <Navigate to="/production/status" replace /> },
      { path: "production/status", element: <ProductionStatusPage /> },
      { path: "production/waste-loss", element: <ProductionWasteLossPage /> },
      { path: "production/inventory-diagnosis", element: <ProductionInventoryDiagnosisPage /> },
      { path: "ordering", element: <Navigate to="/ordering/recommendations" replace /> },
      { path: "ordering/recommendations", element: <OrderingRecommendationsPage /> },
      { path: "ordering/history", element: <OrderingHistoryPage /> },
      { path: "sales", element: <Navigate to="/sales/metrics" replace /> },
      { path: "sales/metrics", element: <SalesMetricsPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "analytics/market", element: <MarketPage /> },
      { path: "orchestration", element: <Navigate to="/settings" replace /> },
      { path: "settings", element: <OrchestrationPage /> },
      { path: "settings/orchestration", element: <OrchestrationPage /> },
      { path: "settings/connectors", element: <OrchestrationPage /> },
      { path: "settings/access", element: <OrchestrationPage /> },
      { path: "settings/prompts", element: <OrchestrationPage /> },
      { path: "settings/golden-queries", element: <OrchestrationPage /> },
      { path: "settings/audit-logs", element: <OrchestrationPage /> },
      { path: "settings/quality-archive", element: <OrchestrationPage /> },
      { path: "settings/notices", element: <OrchestrationPage /> },
    ],
  },
]);
