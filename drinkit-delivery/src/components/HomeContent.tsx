"use client";

import { useState } from "react";
import { DrinkitAmbientBackground } from "@/components/DrinkitAmbientBackground";
import { HeroBanner } from "@/components/HeroBanner";
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
      <DrinkitAmbientBackground />
      <div className="relative z-10">
        <HeroBanner />
        <PromoBanners />
        <VisualGallery />
        <MenuSection onSelect={setSelectedProduct} />
      </div>
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      <CartBar />
    </>
  );
}
