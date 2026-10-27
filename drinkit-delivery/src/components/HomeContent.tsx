"use client";

import { useState } from "react";
import { MenuSection } from "@/components/MenuSection";
import { ProductModal } from "@/components/ProductModal";
import { CartBar } from "@/components/CartBar";
import type { Product } from "@/types/menu";

export function HomeContent() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <MenuSection onSelect={setSelectedProduct} />
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      <CartBar />
    </>
  );
}
