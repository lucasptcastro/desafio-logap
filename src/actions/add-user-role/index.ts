"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { rolesTable, usersTable } from "@/db/schema";
import { protectedActionClient } from "@/lib/next-safe-action";

import { addUserRoleSchema } from "./schema";

export const addUserRole = protectedActionClient
  .schema(addUserRoleSchema)
  .action(async ({ parsedInput }) => {
    // parsedInput -> dados passados na requisição | ctx -> dados do usuário logado
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, parsedInput.userId),
    });

    if (!user) {
      throw new Error("User not found");
    }

    const role = await db.query.rolesTable.findFirst({
      where: eq(rolesTable.id, parsedInput.roleId),
    });

    if (!role) {
      throw new Error("Role not found");
    }

    await db
      .update(usersTable)
      .set({
        roleId: parsedInput.roleId,
      })
      .where(eq(usersTable.id, parsedInput.userId));

    revalidatePath("/users");
  });
