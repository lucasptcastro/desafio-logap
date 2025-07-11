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

  const ordersList = await db
    .select({
      order,
      restaurant: {
        name: restaurant.name,
        avatarImageUrl: restaurant.avatarImageUrl,
      },
      OrderProduct: {
        id: orderProduct.id,
        quantity: orderProduct.quantity,
      },
      product: product,
    })
    .from(order)
    .where(eq(order.customerCpf, removeCpfPunctuation(cpf)))
    .leftJoin(restaurant, eq(order.restaurantId, restaurant.id))
    .leftJoin(orderProduct, eq(orderProduct.orderId, order.id))
    .leftJoin(product, eq(orderProduct.productId, product.id))
    .orderBy(desc(order.createdAt));

  const ordersMap = new Map();

  for (const item of ordersList) {
    const orderId = item.order.id;
    if (!ordersMap.has(orderId)) {
      ordersMap.set(orderId, {
        ...item.order,
        restaurant: item.restaurant,
        OrderProduct: [],
      });
    }
    // Só adiciona se houver produto
    if (item.OrderProduct && item.OrderProduct.id) {
      ordersMap.get(orderId).OrderProduct.push({
        ...item.OrderProduct,
        product: item.product,
      });
    }
  }

  const orders = Array.from(ordersMap.values());

  return <OrderList orders={orders} />;
};

export default OrdersPage;
