"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { product as productsTable } from "@/db/schema";
import { protectedActionClient } from "@/lib/next-safe-action";

export const deleteProduct = protectedActionClient
  .schema(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput }) => {
    // verifica se o produto existe
    const product = await db.query.product.findFirst({
      where: eq(productsTable.id, parsedInput.id),
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // deleta o produto
    await db.delete(productsTable).where(eq(productsTable.id, parsedInput.id));
    revalidatePath("/products");
  });
