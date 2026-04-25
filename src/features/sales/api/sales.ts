import axiosInstance from "@/services/axiosInstance";

import type {
  GetSalesPromptsResponse,
  GetSalesPromptsRequest,
  GetSalesInsightsRequest,
  SalesInsightsResponse,
  SalesInsightSection,
  SalesCampaignEffectResponse,
  SalesPrompt,
  SalesQueryResponse,
  SalesSummaryResponse,
  ExplainabilityPayload,
} from "@/features/sales/types/sales";

const appendOperationalFilters = (params: URLSearchParams, filters?: GetSalesInsightsRequest) => {
  if (!filters) {
    return;
  }
  if (filters.store_id) {
    params.set("store_id", filters.store_id);
  }
  if (filters.date_from) {
    params.set("date_from", filters.date_from);
  }
  if (filters.date_to) {
    params.set("date_to", filters.date_to);
  }
};

// export const getSalesSummary = async (params: GetSalesSummaryRequest) => {
//   const response = await axiosInstance.get<GetSalesSummaryResponse>(
//     "/api/sales/summary",
//     { params },
//   );
//   return response.data;
// };

// export const getSalesProfitTrend = async (params: GetSalesProfitTrendRequest) => {
//   const response = await axiosInstance.get<GetSalesProfitTrendResponse>(
//     "/api/sales/profit-trend",
//     { params },
//   );
//   return response.data;
// };

// export const getSalesCostBreakdown = async (params: GetSalesCostBreakdownRequest) => {
//   const response = await axiosInstance.get<GetSalesCostBreakdownResponse>(
//     "/api/sales/cost-breakdown",
//     { params },
//   );
//   return response.data;
// };

// export const getSalesProductProfitability = async (
//   params: GetSalesProductProfitabilityRequest,
// ) => {
//   const response = await axiosInstance.get<GetSalesProductProfitabilityResponse>(
//     "/api/sales/product-profitability",
//     { params },
//   );
//   return response.data;
// };

export const getSalesPrompts = async (filters?: GetSalesPromptsRequest): Promise<SalesPrompt[]> => {
  const query = new URLSearchParams();
  appendOperationalFilters(query, filters);
  if (filters?.domain) {
    query.set("domain", filters.domain);
  }
  const response = await axiosInstance.get<SalesPrompt[] | GetSalesPromptsResponse>(
    "/api/sales/prompts",
    {
      params: Object.fromEntries(query.entries()),
    },
  );
  const payload = response.data;

  if (Array.isArray(payload)) {
    return payload;
  }

  return payload.items ?? [];
};

export const postSalesQuery = async (
  prompt: string,
  storeId: string,
  domain: "production" | "ordering" | "sales",
  context?: {
    businessDate?: string;
    businessTime?: string;
    pageContext?: string;
    cardContextKey?: string;
    storeName?: string;
    userRole?: string;
    conversationHistory?: Array<{ role: "user" | "assistant"; text: string }>;
  },
) => {
  const body: Record<string, unknown> = {
    prompt,
    store_id: storeId,
    domain,
  };
  if (context?.businessDate) body.business_date = context.businessDate;
  if (context?.businessTime) body.business_time = context.businessTime;
  if (context?.pageContext) body.page_context = context.pageContext;
  if (context?.cardContextKey) body.card_context_key = context.cardContextKey;
  if (context?.storeName) body.store_name = context.storeName;
  if (context?.userRole) body.user_role = context.userRole;
  if (context?.conversationHistory?.length) {
    body.conversation_history = context.conversationHistory;
  }
  const response = await axiosInstance.post<SalesQueryResponse>("/api/sales/query", body);
  return response.data;
};

export const getSalesSummary = async (
  filters?: GetSalesInsightsRequest,
): Promise<SalesSummaryResponse> => {
  const query = new URLSearchParams();
  appendOperationalFilters(query, filters);
  const response = await axiosInstance.get<SalesSummaryResponse>("/api/sales/summary", {
    params: Object.fromEntries(query.entries()),
  });
  return response.data;
};

export const getSalesInsights = async (
  filters?: GetSalesInsightsRequest,
): Promise<SalesInsightsResponse> => {
  const query = new URLSearchParams();
  appendOperationalFilters(query, filters);

  const response = await axiosInstance.get<
    SalesInsightsResponse | { sections?: SalesInsightSection[] }
  >("/api/sales/insights", {
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
};

export const getSalesCampaignEffect = async (
  filters?: GetSalesInsightsRequest,
): Promise<SalesCampaignEffectResponse> => {
  const query = new URLSearchParams();
  appendOperationalFilters(query, filters);
  const response = await axiosInstance.get<SalesCampaignEffectResponse>(
    "/api/sales/campaign-effect",
    {
      params: Object.fromEntries(query.entries()),
    },
  );
  return response.data;
};

export const getExplainability = async (traceId: string): Promise<ExplainabilityPayload> => {
  const response = await axiosInstance.get<ExplainabilityPayload>(`/api/explainability/${traceId}`);
  return response.data;
};
