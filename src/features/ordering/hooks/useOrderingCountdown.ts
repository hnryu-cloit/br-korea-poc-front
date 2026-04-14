import { useEffect, useMemo, useState } from "react";

export const useOrderingCountdown = (initialSeconds: number, paused: boolean) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setSeconds((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const mmss = useMemo(() => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  }, [seconds]);

  return { seconds, mmss };
};
