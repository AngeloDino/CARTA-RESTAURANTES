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

export const businessConfigSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 letras").max(120),
  whatsapp: z.string().trim().max(20).optional().or(z.literal("")),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Color inválido").optional().default("#d4a853"),
  logoUrl: z.string().max(400_000).optional().or(z.literal("")),
  heroUrl: z.string().max(400_000).optional().or(z.literal("")),
});

export type BusinessConfigInput = z.infer<typeof businessConfigSchema>;
