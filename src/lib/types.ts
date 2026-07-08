import type { MenuTheme, MenuFont, MenuLayout } from "./validations";

export interface MenuAppearance {
  accentColor: string;
  theme: MenuTheme;
  fontStyle: MenuFont;
  layoutStyle: MenuLayout;
  tagline: string | null;
}

export interface BusinessDTO extends MenuAppearance {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  heroUrl: string | null;
  whatsapp: string | null;
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
  business: MenuAppearance & {
    name: string;
    slug: string;
    logoUrl: string | null;
    heroUrl: string | null;
    whatsapp: string | null;
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
