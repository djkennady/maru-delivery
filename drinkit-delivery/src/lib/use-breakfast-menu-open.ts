"use client";

import { useEffect, useState } from "react";
import { isBreakfastMenuOpen } from "@/lib/breakfast-hours";

const POLL_MS = 15_000;

export function useBreakfastMenuOpen(): boolean {
  const [open, setOpen] = useState(() => isBreakfastMenuOpen());

  useEffect(() => {
    const tick = () => setOpen(isBreakfastMenuOpen());
    tick();
    const interval = window.setInterval(tick, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return open;
}
