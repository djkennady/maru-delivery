"use client";

import { useEffect, useState } from "react";
import { getPickupDiscountPercent } from "@/lib/fulfillment";

const POLL_MS = 15_000;

/** Live pickup discount percent (10 or 20) in Moscow time. */
export function usePickupDiscountPercent(): number {
  const [percent, setPercent] = useState(() => getPickupDiscountPercent());

  useEffect(() => {
    const tick = () => setPercent(getPickupDiscountPercent());
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

  return percent;
}
