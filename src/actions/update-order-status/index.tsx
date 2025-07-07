"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { order as ordersTable, orderStatusEnum } from "@/db/schema";
import { protectedActionClient } from "@/lib/next-safe-action";

export const updateOrder = protectedActionClient
  .schema(
    z.object({
      id: z.number().min(1, { message: "ID é obrigatório" }),
      status: z.string().min(1, { message: "Status é obrigatório" }),
    }),
  )
  .action(async ({ parsedInput }) => {
    const order = await db.query.order.findFirst({
      where: eq(ordersTable.id, parsedInput.id),
    });

    if (!order) {
      throw new Error("Order not found");
    }

    await db
      .update(ordersTable)
      .set({
        status:
          parsedInput.status as (typeof orderStatusEnum.enumValues)[number],
      })
      .where(eq(ordersTable.id, parsedInput.id));

    revalidatePath("/orders");
  });
