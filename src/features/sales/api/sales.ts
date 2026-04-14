import axiosInstance from "@/services/axiosInstance";

import type {
  GetSalesPromptsResponse,
  SalesInsightsResponse,
  SalesInsightSection,
  SalesPrompt,
  SalesQueryResponse,
} from "@/features/sales/types/sales";

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

export async function getSalesPrompts(): Promise<SalesPrompt[]> {
  const response = await axiosInstance.get<SalesPrompt[] | GetSalesPromptsResponse>("/api/sales/prompts");
  const payload = response.data;

  if (Array.isArray(payload)) {
    return payload;
  }

  return payload.items ?? [];
}

export async function postSalesQuery(prompt: string) {
  const response = await axiosInstance.post<SalesQueryResponse>("/api/sales/query", { prompt });
  return response.data;
}

export async function getSalesInsights(
  filters?: { storeId?: string; dateFrom?: string; dateTo?: string },
): Promise<SalesInsightsResponse> {
  const query = new URLSearchParams();
  appendOperationalFilters(query, filters);

  const response = await axiosInstance.get<SalesInsightsResponse | { sections?: SalesInsightSection[] }>("/api/sales/insights", {
    params: Object.fromEntries(query.entries()),
  });
  const payload = response.data;

  if ("sections" in payload && Array.isArray(payload.sections)) {
    const [peakHours, channelMix, paymentMix, menuMix] = payload.sections;

    return {
      peak_hours: peakHours,
      channel_mix: channelMix,
      payment_mix: paymentMix,
      menu_mix: menuMix,
      campaign_seasonality: null,
    } satisfies SalesInsightsResponse;
  }

  return payload as SalesInsightsResponse;
}
