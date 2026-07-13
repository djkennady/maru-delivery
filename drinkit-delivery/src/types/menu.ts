export type CategoryId = string;

export type ProductTag = "hit" | "new";

export type ProductSize = "s" | "m" | "l";

export type MilkOption = "regular" | "oat" | "almond" | "none";

export interface Category {
  id: CategoryId;
  name: string;
  imageUrl?: string;
}

export interface Product {
  id: string;
  categoryId: CategoryId;
  name: string;
  description: string;
  emoji: string;
  basePrice: number;
  sizes?: Partial<Record<ProductSize, number>>;
  customizable?: boolean;
  tags?: ProductTag[];
  imageUrl?: string;
  group?: string;
}

export interface MenuSettings {
  deliveryFee: number;
  freeDeliveryFrom: number;
  estimatedMinutes: string;
}

export interface MenuData {
  categories: Category[];
  products: Product[];
  settings: MenuSettings;
}

export interface CartItemOptions {
  size: ProductSize;
  milk: MilkOption;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  options: CartItemOptions;
  unitPrice: number;
}

export type ProductInput = Omit<Product, "id"> & { id?: string };

export type CategoryInput = Omit<Category, "id"> & { id?: string };
