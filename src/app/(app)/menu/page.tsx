import { requireSession } from "@/server/auth";
import { listDishes } from "@/server/services/dishes";
import { listCategories } from "@/server/services/categories";
import { MenuList } from "./MenuList";

export default async function MenuPage() {
  const { businessId } = await requireSession();
  const [dishes, categories] = await Promise.all([
    listDishes(businessId),
    listCategories(businessId),
  ]);

  return <MenuList dishes={dishes} categories={categories} />;
}
