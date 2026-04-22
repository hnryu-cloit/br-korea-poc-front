import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { scrollWindowToTop } from "@/commons/utils/scroll";

export function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollWindowToTop("auto");
  }, [pathname]);

  return null;
}
