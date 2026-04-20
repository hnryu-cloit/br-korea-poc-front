import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/commons/components/layout/AppLayout";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { HQCoachingPage } from "@/pages/HQCoachingPage";
import { HQInspectionPage } from "@/pages/HQInspectionPage";
import { MarketPage } from "@/pages/MarketPage";
import { OrchestrationPage } from "@/pages/OrchestrationPage";
import { OrderingHistoryPage } from "@/pages/ordering/OrderingHistoryPage";
import { OrderingRecommendationsPage } from "@/pages/ordering/OrderingRecommendationsPage";
import { ProductionInventoryDiagnosisPage } from "@/pages/production/ProductionInventoryDiagnosisPage";
import { ProductionStatusPage } from "@/pages/production/ProductionStatusPage";
import { ProductionWasteLossPage } from "@/pages/production/ProductionWasteLossPage";
import { SalesMetricsPage } from "@/pages/sales/SalesMetricsPage";
import { SalesQueryLogsPage } from "@/pages/sales/SalesQueryLogsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { SignalsPage } from "@/pages/SignalsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "production", element: <Navigate to="/production/status" replace /> },
      { path: "production/status", element: <ProductionStatusPage /> },
      { path: "production/waste-loss", element: <ProductionWasteLossPage /> },
      { path: "production/inventory-diagnosis", element: <ProductionInventoryDiagnosisPage /> },
      { path: "ordering", element: <Navigate to="/ordering/recommendations" replace /> },
      { path: "ordering/recommendations", element: <OrderingRecommendationsPage /> },
      { path: "ordering/history", element: <OrderingHistoryPage /> },
      { path: "sales", element: <Navigate to="/sales/metrics" replace /> },
      { path: "sales/metrics", element: <SalesMetricsPage /> },
      { path: "sales/query-logs", element: <SalesQueryLogsPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "analytics/market", element: <MarketPage /> },
      { path: "hq/coaching", element: <HQCoachingPage /> },
      { path: "hq/inspection", element: <HQInspectionPage /> },
      { path: "orchestration", element: <OrchestrationPage /> },
      { path: "signals", element: <SignalsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);
