import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Rubik } from "next/font/google";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { SiteFooter } from "@/components/SiteFooter";
import { CartProvider } from "@/context/CartContext";
import { MenuProvider } from "@/context/MenuContext";
import { UserProvider } from "@/context/UserContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

const rubik = Rubik({
  subsets: ["latin", "cyrillic"],
  weight: ["800", "900"],
  variable: "--font-brand",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "МАРУ — кухня и кофе",
  description:
    "МАРУ в Алабуге: меню в зале и самовывоз со скидкой 10%. Завтраки, кухня, кофе и десерты.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${rubik.variable} ${cormorant.variable} h-full`}>
      <body
        data-deploy="bg-anim-2026-08-28"
        className="relative min-h-full max-w-full overflow-x-clip font-sans text-[var(--text)] antialiased"
      >
        <AnimatedBackground />
        <div className="relative flex min-h-full max-w-full flex-1 flex-col">
          <UserProvider>
            <MenuProvider>
              <CartProvider>
                <div className="flex min-h-full flex-1 flex-col">
                  <div className="flex-1">{children}</div>
                  <SiteFooter />
                </div>
              </CartProvider>
            </MenuProvider>
          </UserProvider>
        </div>
      </body>
    </html>
  );
}
