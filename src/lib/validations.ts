import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Correo inválido"),
  password: z.string().min(1, "Escriba su contraseña"),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 letras").max(60),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const dishSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 letras").max(120),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  price: z.coerce
    .number({ invalid_type_error: "Precio inválido" })
    .int("El precio no lleva decimales")
    .min(0, "El precio no puede ser negativo")
    .max(10_000_000),
  imageUrl: z
    .string()
    .max(400_000, "La foto es demasiado grande")
    .refine((v) => v === "" || v.startsWith("data:image/") || v.startsWith("http"), "Foto inválida")
    .optional()
    .or(z.literal("")),
  tags: z.array(z.string().trim().max(30)).max(5).optional().default([]),
  categoryId: z.string().trim().optional().or(z.literal("")),
  newCategory: z.string().trim().max(60).optional().or(z.literal("")),
});

export type DishInput = z.infer<typeof dishSchema>;

export const MENU_THEMES = ["dark", "light"] as const;
export const MENU_FONTS = ["serif", "sans", "rounded"] as const;
export const MENU_LAYOUTS = ["grid", "list"] as const;

export type MenuTheme = (typeof MENU_THEMES)[number];
export type MenuFont = (typeof MENU_FONTS)[number];
export type MenuLayout = (typeof MENU_LAYOUTS)[number];

// La BD guarda estos campos como String; estos helpers los normalizan al union type.
export function asMenuTheme(v: string): MenuTheme {
  return (MENU_THEMES as readonly string[]).includes(v) ? (v as MenuTheme) : "dark";
}
export function asMenuFont(v: string): MenuFont {
  return (MENU_FONTS as readonly string[]).includes(v) ? (v as MenuFont) : "serif";
}
export function asMenuLayout(v: string): MenuLayout {
  return (MENU_LAYOUTS as readonly string[]).includes(v) ? (v as MenuLayout) : "grid";
}

export const businessConfigSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 letras").max(120),
  whatsapp: z.string().trim().max(20).optional().or(z.literal("")),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Color inválido").optional().default("#d4a853"),
  logoUrl: z.string().max(400_000).optional().or(z.literal("")),
  heroUrl: z.string().max(400_000).optional().or(z.literal("")),
  theme: z.enum(MENU_THEMES).optional().default("dark"),
  fontStyle: z.enum(MENU_FONTS).optional().default("serif"),
  layoutStyle: z.enum(MENU_LAYOUTS).optional().default("grid"),
  tagline: z.string().trim().max(120, "Máximo 120 caracteres").optional().or(z.literal("")),
});

export type BusinessConfigInput = z.infer<typeof businessConfigSchema>;
