import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CartProvider } from "@/context/CartContext";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "delivery" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="delivery-theme min-h-full bg-[var(--delivery-bg)] text-[var(--delivery-text)]">
      <CartProvider>{children}</CartProvider>
    </div>
  );
}
