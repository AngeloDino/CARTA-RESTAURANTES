import { Prisma } from "@prisma/client";
import { prisma } from "../db";
import type { DishDTO } from "@/lib/types";
import type { DishInput } from "@/lib/validations";

const dishInclude = {
  category: { select: { name: true } },
} satisfies Prisma.DishInclude;

type DishWithRelations = Prisma.DishGetPayload<{ include: typeof dishInclude }>;

function toDTO(d: DishWithRelations): DishDTO {
  return {
    id: d.id,
    name: d.name,
    description: d.description,
    price: d.price,
    imageUrl: d.imageUrl,
    tags: d.tags,
    soldOut: d.soldOut,
    sortOrder: d.sortOrder,
    categoryId: d.categoryId,
    categoryName: d.category?.name ?? null,
  };
}

export async function listDishes(businessId: string): Promise<DishDTO[]> {
  const dishes = await prisma.dish.findMany({
    where: { businessId, active: true },
    include: dishInclude,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return dishes.map(toDTO);
}

export async function getDish(
  businessId: string,
  id: string
): Promise<DishDTO | null> {
  const d = await prisma.dish.findFirst({
    where: { id, businessId, active: true },
    include: dishInclude,
  });
  return d ? toDTO(d) : null;
}

async function resolveCategoryId(
  businessId: string,
  input: DishInput
): Promise<string | null> {
  if (input.newCategory) {
    const category = await prisma.category.upsert({
      where: { businessId_name: { businessId, name: input.newCategory } },
      update: {},
      create: { businessId, name: input.newCategory },
    });
    return category.id;
  }
  if (input.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: input.categoryId, businessId },
    });
    return category?.id ?? null;
  }
  return null;
}

export async function createDish(
  businessId: string,
  input: DishInput
): Promise<DishDTO> {
  const categoryId = await resolveCategoryId(businessId, input);
  const maxOrder = await prisma.dish.findFirst({
    where: { businessId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });
  const d = await prisma.dish.create({
    data: {
      businessId,
      name: input.name,
      description: input.description || null,
      price: input.price,
      imageUrl: input.imageUrl || null,
      tags: input.tags ?? [],
      sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
      categoryId,
    },
    include: dishInclude,
  });
  return toDTO(d);
}

export async function updateDish(
  businessId: string,
  id: string,
  input: DishInput
): Promise<DishDTO | null> {
  const existing = await prisma.dish.findFirst({ where: { id, businessId } });
  if (!existing) return null;

  const categoryId = await resolveCategoryId(businessId, input);
  const d = await prisma.dish.update({
    where: { id },
    data: {
      name: input.name,
      description: input.description || null,
      price: input.price,
      imageUrl: input.imageUrl || null,
      tags: input.tags ?? [],
      categoryId,
    },
    include: dishInclude,
  });
  return toDTO(d);
}

export async function toggleSoldOut(
  businessId: string,
  id: string
): Promise<DishDTO | null> {
  const existing = await prisma.dish.findFirst({ where: { id, businessId } });
  if (!existing) return null;
  const d = await prisma.dish.update({
    where: { id },
    data: { soldOut: !existing.soldOut },
    include: dishInclude,
  });
  return toDTO(d);
}

export async function reorderDishes(
  businessId: string,
  ids: string[]
): Promise<void> {
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.dish.updateMany({
        where: { id, businessId },
        data: { sortOrder: index },
      })
    )
  );
}

export async function deactivateDish(
  businessId: string,
  id: string
): Promise<boolean> {
  const result = await prisma.dish.updateMany({
    where: { id, businessId },
    data: { active: false },
  });
  return result.count > 0;
}
