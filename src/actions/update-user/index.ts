"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { protectedActionClient } from "@/lib/next-safe-action";

import { updateUserSchema } from "./schema";

export const updateUser = protectedActionClient
  .schema(updateUserSchema)
  .action(async ({ parsedInput }) => {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, parsedInput.id),
    });

    if (!user) {
      throw new Error("User not found");
    }

    await db
      .update(usersTable)
      .set({
        name: parsedInput.name,
        email: parsedInput.email,
        roleId: parsedInput.roleId,
      })
      .where(eq(usersTable.id, parsedInput.id));

    revalidatePath("/users");
  });
