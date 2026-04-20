import { useEffect, useMemo, useState } from "react";

import { ORDERING_DEADLINE_TICK_INTERVAL_MS } from "@/features/ordering/constants/ordering-deadline";
import type { OrderingDeadlineItem } from "@/features/ordering/types/ordering";
import { buildOrderingDeadlineGroups } from "@/features/ordering/utils/ordering-deadline";

export function useOrderingDeadlineGroups(items: OrderingDeadlineItem[]) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(new Date());
    }, ORDERING_DEADLINE_TICK_INTERVAL_MS);

    return () => window.clearInterval(timerId);
  }, []);

  return useMemo(() => buildOrderingDeadlineGroups(items, now), [items, now]);
}
