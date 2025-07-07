"use server";

import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db/index";
import {
  consumptionMethodEnum,
  order,
  orderProduct,
  product,
  restaurant as restaurantTable,
} from "@/db/schema";
import { removeCpfPunctuation } from "@/helpers/cpf";

interface CreateOrderInput {
  customerName: string;
  customerCpf: string;
  products: Array<{ id: string; quantity: number }>;
  consumptionMethod: (typeof consumptionMethodEnum.enumValues)[number];
}

export const createOrder = async (input: CreateOrderInput) => {
  const restaurant = await db.query.restaurant.findFirst({
    where: eq(restaurantTable.slug, "mc-logap"),
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  // para não ter que passar o preço pela server action("rota da api"), o preço é consultado por essa função. Evitando brechas de vulnerabilidade
  const productsWithPrices = await db
    .select()
    .from(product)
    .where(
      inArray(
        product.id,
        input.products.map((product) => product.id),
      ),
    );

  // pega os preços e quantidades de cada produto recebido no input
  const productsWithPricesAndQuantities = input.products.map((product) => ({
    productId: product.id,
    quantity: product.quantity,
    price: productsWithPrices.find((p) => p.id === product.id)!.price,
  }));

  // 1. Crie o pedido (order)
  const [createdOrder] = await db
    .insert(order)
    .values({
      status: "IN_PROGRESS",
      customerName: input.customerName,
      customerCpf: removeCpfPunctuation(input.customerCpf),
      total: productsWithPricesAndQuantities.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0,
      ),
      consumptionMethod: input.consumptionMethod,
      restaurantId: restaurant.id,
    })
    .returning();

  // 2. Crie os produtos do pedido (orderProduct)
  await db.insert(orderProduct).values(
    productsWithPricesAndQuantities.map((product) => ({
      orderId: createdOrder.id,
      productId: product.productId,
      quantity: product.quantity,
      price: product.price,
    })),
  );

  // serve para guardar as informações da tela em cache
  revalidatePath(`/orders`);

  redirect(`/orders?cpf=${removeCpfPunctuation(input.customerCpf)}`);
};
