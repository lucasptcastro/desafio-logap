"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { menuCategory } from "@/db/schema";
import { protectedActionClient } from "@/lib/next-safe-action";

import { upsertMenuCategorySchema } from "./schema";

export const upsertMenuCategory = protectedActionClient
  .schema(upsertMenuCategorySchema)
  .action(async ({ parsedInput }) => {
    await db
      .insert(menuCategory)
      .values({
        id: parsedInput.id,
        name: parsedInput.name,
        restaurantId: parsedInput.restaurantId,
      })
      .onConflictDoUpdate({
        target: [menuCategory.id],
        set: parsedInput,
      });

    revalidatePath("/menu-categories");
  });
