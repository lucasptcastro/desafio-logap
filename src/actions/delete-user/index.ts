"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { protectedActionClient } from "@/lib/next-safe-action";

export const deleteUser = protectedActionClient
  .schema(
    z.object({
      id: z.string(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, parsedInput.id),
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    await db.delete(usersTable).where(eq(usersTable.id, parsedInput.id));
    revalidatePath("/users");
  });
