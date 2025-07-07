"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { rolesTable, usersTable } from "@/db/schema";
import { protectedActionClient } from "@/lib/next-safe-action";

export const getUserRole = protectedActionClient
  .schema(
    z.object({
      userId: z.string(),
    }),
  )

  .action(async ({ parsedInput }) => {
    const user = await db
      .select({
        roleName: rolesTable.name,
        roleId: usersTable.roleId,
      })
      .from(usersTable)
      .innerJoin(rolesTable, eq(usersTable.roleId, rolesTable.id))
      .where(eq(usersTable.id, parsedInput.userId));

    return user;
  });
