import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  DEMO_BUSINESS_NAME,
  DEMO_SLUG,
  DEMO_EMAIL,
  DEMO_PASSWORD,
  DEMO_CATEGORIES,
  DEMO_DISHES,
} from "../demo-data";

type Db = PrismaClient | Prisma.TransactionClient;

export async function resetDemoBusiness(db: Db): Promise<string> {
  let business = await db.business.findFirst({ where: { isDemo: true } });

  if (!business) {
    business = await db.business.create({
      data: {
        name: DEMO_BUSINESS_NAME,
        slug: DEMO_SLUG,
        isDemo: true,
        whatsapp: "573001234567",
      },
    });
  }

  const businessId = business.id;

  await db.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { businessId },
    create: {
      email: DEMO_EMAIL,
      name: "Chef Carlos",
      passwordHash: await bcrypt.hash(DEMO_PASSWORD, 10),
      role: "ADMIN",
      businessId,
    },
  });

  await db.dish.deleteMany({ where: { businessId } });
  await db.category.deleteMany({ where: { businessId } });

  const categoryIds = new Map<string, string>();
  for (let i = 0; i < DEMO_CATEGORIES.length; i++) {
    const created = await db.category.create({
      data: { name: DEMO_CATEGORIES[i], businessId, sortOrder: i },
    });
    categoryIds.set(DEMO_CATEGORIES[i], created.id);
  }

  for (let i = 0; i < DEMO_DISHES.length; i++) {
    const d = DEMO_DISHES[i];
    const categoryId = categoryIds.get(d.category) ?? null;
    await db.dish.create({
      data: {
        name: d.name,
        description: d.description,
        price: d.price,
        imageUrl: d.imageUrl ?? null,
        tags: d.tags,
        soldOut: d.soldOut ?? false,
        sortOrder: i,
        businessId,
        categoryId,
      },
    });
  }

  return businessId;
}
