export interface BusinessDTO {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  heroUrl: string | null;
  whatsapp: string | null;
  accentColor: string;
  isDemo: boolean;
}

export interface CategoryDTO {
  id: string;
  name: string;
  sortOrder: number;
}

export interface DishDTO {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  tags: string[];
  soldOut: boolean;
  sortOrder: number;
  categoryId: string | null;
  categoryName: string | null;
}

export interface MenuData {
  business: {
    name: string;
    slug: string;
    logoUrl: string | null;
    heroUrl: string | null;
    whatsapp: string | null;
    accentColor: string;
  };
  categories: {
    id: string;
    name: string;
    dishes: DishDTO[];
  }[];
}

export interface ActionResult {
  ok: boolean;
  message?: string;
  data?: Record<string, unknown>;
}
