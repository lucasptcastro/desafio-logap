"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { product } from "@/db/schema";
import { protectedActionClient } from "@/lib/next-safe-action";

import { upsertProductSchema } from "./schema";

export const upsertProduct = protectedActionClient
  .schema(upsertProductSchema)
  .action(async ({ parsedInput }) => {
    await db
      .insert(product)
      .values({
        id: parsedInput.id,
        name: parsedInput.name,
        description: parsedInput.description,
        price: parsedInput.price,
        imageUrl: parsedInput.imageUrl,
        ingredients: parsedInput.ingredients,
        restaurantId: parsedInput.restaurantId,
        menuCategoryId: parsedInput.menuCategoryId,
      })
      .onConflictDoUpdate({
        target: [product.id],
        set: parsedInput,
      });

    revalidatePath("/products");
  });
