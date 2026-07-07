import { prisma } from "../db";
import type { CategoryDTO } from "@/lib/types";

export async function listCategories(businessId: string): Promise<CategoryDTO[]> {
  return prisma.category.findMany({
    where: { businessId },
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, sortOrder: true },
  });
}

export async function createCategory(
  businessId: string,
  name: string
): Promise<CategoryDTO> {
  const maxOrder = await prisma.category.findFirst({
    where: { businessId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });
  const category = await prisma.category.create({
    data: {
      name,
      businessId,
      sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
    },
  });
  return { id: category.id, name: category.name, sortOrder: category.sortOrder };
}

export async function updateCategory(
  businessId: string,
  id: string,
  name: string
): Promise<CategoryDTO | null> {
  const existing = await prisma.category.findFirst({ where: { id, businessId } });
  if (!existing) return null;
  const category = await prisma.category.update({
    where: { id },
    data: { name },
  });
  return { id: category.id, name: category.name, sortOrder: category.sortOrder };
}

export async function reorderCategories(
  businessId: string,
  ids: string[]
): Promise<void> {
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.category.updateMany({
        where: { id, businessId },
        data: { sortOrder: index },
      })
    )
  );
}

export async function deleteCategory(
  businessId: string,
  id: string
): Promise<boolean> {
  const result = await prisma.category.deleteMany({
    where: { id, businessId },
  });
  return result.count > 0;
}
