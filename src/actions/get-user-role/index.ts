"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { protectedActionClient } from "@/lib/next-safe-action";

export const getUserRole = protectedActionClient
  .schema(
    z.object({
      userId: z.string(),
    }),
  )

  .action(async ({ parsedInput }) => {
    const user = await db
      .select({ roleId: usersTable.roleId })
      .from(usersTable)
      .where(eq(usersTable.id, parsedInput.userId));

    return user;
  });
