import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import { AnimatedBackground } from "@/components/AnimatedBackground";
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

export const metadata: Metadata = {
  title: "МАРУ — доставка кофе и еды",
  description: "МАРУ — закажите кофе, чай, еду и десерты с доставкой за 25–40 минут",
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
    <html lang="ru" className={`${inter.variable} ${rubik.variable} h-full`}>
      <body className="relative min-h-full font-sans text-[var(--text)] antialiased">
        <AnimatedBackground />
        <div className="relative flex min-h-full flex-1 flex-col">
          <UserProvider>
            <MenuProvider>
              <CartProvider>{children}</CartProvider>
            </MenuProvider>
          </UserProvider>
        </div>
      </body>
    </html>
  );
}
