import { desc, eq } from "drizzle-orm";

import { db } from "@/db/index";
import { order, orderProduct, product, restaurant } from "@/db/schema";

import { isValidCpf, removeCpfPunctuation } from "../../helpers/cpf";
import CpfForm from "./_components/cpf-form";
import OrderList from "./_components/order-list";

interface OrdersPageProps {
  searchParams: Promise<{ cpf: string }>;
}

const OrdersPage = async ({ searchParams }: OrdersPageProps) => {
  const { cpf } = await searchParams;

  if (!cpf) {
    return <CpfForm />;
  }

  if (!isValidCpf(cpf)) {
    return <CpfForm />;
  }

  const orders = await db
    .select({
      order,
      restaurant: {
        name: restaurant.name,
        avatarImageUrl: restaurant.avatarImageUrl,
      },
      OrderProduct: {
        // Isso retorna um array de produtos do pedido
        // Você pode precisar de um subselect ou um join manual dependendo do seu schema
        // Aqui está um exemplo básico:
        id: orderProduct.id,
        quantity: orderProduct.quantity,
        product: product,
      },
    })
    .from(order)
    .where(eq(order.customerCpf, removeCpfPunctuation(cpf)))
    .leftJoin(restaurant, eq(order.restaurantId, restaurant.id))
    .leftJoin(orderProduct, eq(orderProduct.orderId, order.id))
    .leftJoin(product, eq(orderProduct.productId, product.id))
    .orderBy(desc(order.createdAt));

  return <OrderList orders={orders} />;
};

export default OrdersPage;
