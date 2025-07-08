import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db/index";
import {
  product as productTable,
  restaurant as restaurantTable,
} from "@/db/schema";

import ProductHeader from "./_components/header";
import ProductDetails from "./_components/product-details";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId } = await params;

  // Busca o produto e o restaurante relacionado
  const productResult = await db
    .select({
      id: productTable.id,
      name: productTable.name,
      description: productTable.description,
      imageUrl: productTable.imageUrl,
      price: productTable.price,
      ingredients: productTable.ingredients,
      restaurant: {
        name: restaurantTable.name,
        avatarImageUrl: restaurantTable.avatarImageUrl,
      },
    })
    .from(productTable)
    .where(eq(productTable.id, productId))
    .leftJoin(
      restaurantTable,
      eq(productTable.restaurantId, restaurantTable.id),
    );

  const productRaw = productResult[0];

  if (!productRaw) {
    return notFound();
  }

  if (!productRaw.restaurant) {
    return notFound();
  }

  const product = {
    ...productRaw,
    restaurant: productRaw.restaurant,
  };

  return (
    <>
      <div className="flex h-screen flex-col">
        <ProductHeader product={product} />
        <ProductDetails product={product} />
      </div>
    </>
  );
};

export default ProductPage;
