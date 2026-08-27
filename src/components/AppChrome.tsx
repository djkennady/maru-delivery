"use client";

import { usePathname } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isVenueRoute = pathname.startsWith("/venues/");
  const isDeliveryRoute = pathname.startsWith("/delivery");

  if (isDeliveryRoute) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Header isVenueRoute={isVenueRoute} />
      <main className="flex-1">{children}</main>
      {!isVenueRoute && <Footer />}
      <PwaInstallPrompt isVenueRoute={isVenueRoute} />
    </>
  );
}
