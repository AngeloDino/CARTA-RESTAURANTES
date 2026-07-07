import { prisma } from "../db";
import type { MenuData, DishDTO } from "@/lib/types";

const dishInclude = {
  category: { select: { name: true } },
} as const;

export async function getMenuData(slug: string): Promise<MenuData | null> {
  const business = await prisma.business.findUnique({
    where: { slug },
    select: {
      name: true,
      slug: true,
      logoUrl: true,
      heroUrl: true,
      whatsapp: true,
      accentColor: true,
    },
  });

  if (!business) return null;

  const categories = await prisma.category.findMany({
    where: { business: { slug } },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      dishes: {
        where: { active: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          imageUrl: true,
          tags: true,
          soldOut: true,
          sortOrder: true,
          categoryId: true,
        },
      },
    },
  });

  return {
    business,
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      dishes: c.dishes.map((d) => ({
        ...d,
        categoryName: c.name,
      })),
    })),
  };
}

export async function listBusinessSlugs(): Promise<string[]> {
  const businesses = await prisma.business.findMany({
    select: { slug: true },
  });
  return businesses.map((b) => b.slug);
}
