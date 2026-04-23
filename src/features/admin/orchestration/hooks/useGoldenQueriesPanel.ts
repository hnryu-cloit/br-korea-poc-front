import { useMemo, useState } from "react";

import {
  MOCK_INITIAL_GOLDEN_QUERIES,
} from "@/features/admin/orchestration/mockdata/mock-orchestration";
import type { GoldenQuery } from "@/features/admin/orchestration/mockdata/mock-orchestration";
import type { OrchestrationAgent } from "@/features/admin/orchestration/types/orchestration";

export function useGoldenQueriesPanel() {
  const [goldenQueries, setGoldenQueries] = useState<GoldenQuery[]>(MOCK_INITIAL_GOLDEN_QUERIES);
  const [searchText, setSearchText] = useState("");

  const filteredQueries = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (q.length === 0) return goldenQueries;
    return goldenQueries.filter((item) => `${item.query} ${item.agent}`.toLowerCase().includes(q));
  }, [goldenQueries, searchText]);

  const addQuery = (query: string, agent: OrchestrationAgent) => {
    setGoldenQueries((prev) => {
      if (prev.some((item) => item.query === query && item.agent === agent)) return prev;
      return [...prev, { id: `gq-${Date.now()}`, query, agent, hits: 0, embedded: false }];
    });
  };

  const removeQuery = (id: string) => {
    setGoldenQueries((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    goldenQueries,
    filteredQueries,
    searchText,
    setSearchText,
    addQuery,
    removeQuery,
  };
}
