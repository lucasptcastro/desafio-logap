"use server";
// diz que o arquivo terá server actions (funciona como uma espécie de rota de API)

import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db/index";
import {
  consumptionMethodEnum,
  order,
  product,
  restaurant as restaurantTable,
} from "@/db/schema";
import { removeCpfPunctuation } from "@/helpers/cpf";

interface CreateOrderInput {
  customerName: string;
  customerCpf: string;
  products: Array<{ id: string; quantity: number }>;
  consumptionMethod: typeof consumptionMethodEnum;
  slug: string;
}

export const createOrder = async (input: CreateOrderInput) => {
  const restaurant = await db.query.order.findFirst({
    where: eq(restaurantTable.slug, input.slug),
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
    price: productsWithPrices.find((p) => p.id)!.price,
  }));

  // aqui é feita a criação da order diretamente no banco
  await db.insert(order).values({
    status: "PENDING",
    CustomerName: input.customerName,
    CustomerCpf: removeCpfPunctuation(input.customerCpf),
    OrderProduct: {
      createMany: {
        data: productsWithPricesAndQuantities,
      },
    },
    total: productsWithPricesAndQuantities.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0,
    ),
    consumptionMethod: input.consumptionMethod,
    restaurantId: restaurant.id,
  });

  // serve para guardar as informações da tela em cache
  revalidatePath(`/${input.slug}/orders`);

  redirect(
    `/${input.slug}/orders?cpf=${removeCpfPunctuation(input.customerCpf)}`,
  );
};
