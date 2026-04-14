import axiosInstance from "@/services/axiosInstance";

import type {
  SalesInsightsResponse,
  SalesPrompt,
  SalesQueryResponse,
} from "@/features/sales/type/sales";

function appendOperationalFilters(
  params: URLSearchParams,
  filters?: { storeId?: string; dateFrom?: string; dateTo?: string },
) {
  if (!filters) {
    return;
  }
  if (filters.storeId) {
    params.set("store_id", filters.storeId);
  }
  if (filters.dateFrom) {
    params.set("date_from", filters.dateFrom);
  }
  if (filters.dateTo) {
    params.set("date_to", filters.dateTo);
  }
}

export async function fetchSalesPrompts() {
  const response = await axiosInstance.get<SalesPrompt[]>("/api/sales/prompts");
  return response.data;
}

export async function querySales(prompt: string) {
  const response = await axiosInstance.post<SalesQueryResponse>("/api/sales/query", { prompt });
  return response.data;
}

export async function fetchSalesInsights(filters?: { storeId?: string; dateFrom?: string; dateTo?: string }) {
  const query = new URLSearchParams();
  appendOperationalFilters(query, filters);

  const response = await axiosInstance.get<SalesInsightsResponse>("/api/sales/insights", {
    params: Object.fromEntries(query.entries()),
  });
  return response.data;
}
