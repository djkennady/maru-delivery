import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";
import "../globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const sans = DM_Sans({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("title"),
    description: t("description"),
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "Bird Network",
    },
    icons: {
      icon: "/icon.svg",
      apple: "/icon.svg",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "ru" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${display.variable} ${sans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background font-sans text-foreground antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <PwaInstallPrompt />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
