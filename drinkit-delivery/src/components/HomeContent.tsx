"use client";

import { useState } from "react";
import { HeroBanner } from "@/components/HeroBanner";
import { LoyaltyBonusCard } from "@/components/LoyaltyBonusCard";
import { PersonalizedGreeting } from "@/components/PersonalizedGreeting";
import { PromoBanners } from "@/components/PromoBanners";
import { VisualGallery } from "@/components/VisualGallery";
import { MenuSection } from "@/components/MenuSection";
import { ProductModal } from "@/components/ProductModal";
import { CartBar } from "@/components/CartBar";
import type { Product } from "@/types/menu";

export function HomeContent() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <HeroBanner />
      <LoyaltyBonusCard />
      <PersonalizedGreeting onSelect={setSelectedProduct} />
      <PromoBanners />
      <VisualGallery />
      <MenuSection onSelect={setSelectedProduct} />
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      <CartBar />
    </>
  );
}
