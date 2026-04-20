import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/commons/components/layout/AppLayout";
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
import { SettingsAccessControlPage } from "@/pages/SettingsAccessControlPage";
import { SettingsAuditLogsPage } from "@/pages/SettingsAuditLogsPage";
import { SettingsConnectorsPage } from "@/pages/SettingsConnectorsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { SettingsQualityArchivePage } from "@/pages/SettingsQualityArchivePage";
import { SignalsPage } from "@/pages/SignalsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
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
      { path: "signals", element: <SignalsPage /> },
      { path: "settings", element: <OrchestrationPage /> },
      { path: "settings/connectors", element: <SettingsConnectorsPage /> },
      { path: "settings/access", element: <SettingsAccessControlPage /> },
      { path: "settings/audit-logs", element: <SettingsAuditLogsPage /> },
      { path: "settings/quality-archive", element: <SettingsQualityArchivePage /> },
      { path: "settings/prompts", element: <SettingsPage /> },
    ],
  },
]);
