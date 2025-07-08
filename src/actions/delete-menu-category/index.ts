"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { menuCategory } from "@/db/schema";
import { protectedActionClient } from "@/lib/next-safe-action";

export const deleteMenuCategory = protectedActionClient
  .schema(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput }) => {
    // verifica se a categoria do menu existe
    const category = await db.query.menuCategory.findFirst({
      where: eq(menuCategory.id, parsedInput.id),
    });

    if (!category) {
      throw new Error("Category not found");
    }

    // deleta a categoria do menu
    await db.delete(menuCategory).where(eq(menuCategory.id, parsedInput.id));
    revalidatePath("/menu-categories");
  });
