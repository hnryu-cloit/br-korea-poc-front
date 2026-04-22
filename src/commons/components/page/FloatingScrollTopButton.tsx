import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

import { scrollWindowToTop, shouldShowFloatingScrollTopButton } from "@/commons/utils/scroll";

export function FloatingScrollTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(shouldShowFloatingScrollTopButton());
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <button
      type="button"
      aria-label="페이지 최상단으로 이동"
      onClick={() => scrollWindowToTop("smooth")}
      className="fixed bottom-8 left-1/2 z-40 inline-flex h-[56px] w-[56px] -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-[#FFB38F] bg-[#FFD9C780] shadow-[0_6px_18px_rgba(16,32,51,0.08)] transition-transform hover:-translate-x-1/2"
    >
      <ChevronUp className="h-8 w-8 text-orange-500" strokeWidth={2.25} />
    </button>
  );
}
