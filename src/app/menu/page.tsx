import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db/index";
import {
  consumptionMethodEnum,
  menuCategory,
  product,
  restaurant as restaurantTable,
} from "@/db/schema";

import RestaurantCategories from "./_components/categories";
import RestaurantHeader from "./_components/header";

interface RestaurantMenuPageProps {
  searchParams: Promise<{ consumptionMethod: string }>;
}

const isConsumptionMethodValid = (consumptionMethod: string | undefined) => {
  if (!consumptionMethod) return false;
  return Object.values(consumptionMethodEnum)[1].includes(
    consumptionMethod.toUpperCase() as (typeof consumptionMethodEnum)[keyof typeof consumptionMethodEnum],
  );
};

const RestaurantMenuPage = async ({
  searchParams,
}: RestaurantMenuPageProps) => {
  const slug = "mc-logap";

  const { consumptionMethod } = await searchParams;

  if (!isConsumptionMethodValid(consumptionMethod)) {
    return notFound();
  }

  const restaurantResult = await db
    .select()
    .from(restaurantTable)
    .where(eq(restaurantTable.slug, slug));

  // Se não encontrar, retorna notFound
  if (!restaurantResult[0]) {
    return notFound();
  }
  // Busca as categorias do restaurante
  const menuCategories = await db
    .select()
    .from(menuCategory)
    .where(eq(menuCategory.restaurantId, restaurantResult[0].id));

  // Para cada categoria, busca os produtos
  const menuCategoriesWithProducts = await Promise.all(
    menuCategories.map(async (category) => {
      const productsList = await db
        .select()
        .from(product)
        .where(eq(product.menuCategoryId, category.id));
      return {
        ...category,
        products: productsList,
      };
    }),
  );

  // Monta o objeto final no mesmo formato do Prisma
  const restaurantWithCategories = {
    ...restaurantResult[0],
    MenuCategory: menuCategoriesWithProducts,
  };

  return (
    <div>
      <RestaurantHeader restaurant={restaurantWithCategories} />

      <RestaurantCategories restaurant={restaurantWithCategories} />
    </div>
  );
};

export default RestaurantMenuPage;
