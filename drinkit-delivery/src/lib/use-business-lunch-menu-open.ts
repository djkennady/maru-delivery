"use client";

import { useEffect, useState } from "react";
import { isBusinessLunchMenuOpen } from "@/lib/business-lunch-hours";

const POLL_MS = 15_000;

export function useBusinessLunchMenuOpen(): boolean {
  const [open, setOpen] = useState(() => isBusinessLunchMenuOpen());

  useEffect(() => {
    const tick = () => setOpen(isBusinessLunchMenuOpen());
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
