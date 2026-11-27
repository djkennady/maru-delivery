"use client";

import { useEffect, useState } from "react";
import { isPickupOpen } from "@/lib/pickup-hours";

const POLL_MS = 15_000;

export function usePickupOpen(): boolean {
  const [open, setOpen] = useState(() => isPickupOpen());

  useEffect(() => {
    const tick = () => setOpen(isPickupOpen());
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
