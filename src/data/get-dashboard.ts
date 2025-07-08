import dayjs from "dayjs";
import { and, count, desc, eq, gte, lte, sql, sum } from "drizzle-orm";

import { db } from "@/db";
import { order, order as ordersTable, orderProduct } from "@/db/schema";

interface Params {
  from: string;
  to: string;
}

export const getDashboard = async ({ from, to }: Params) => {
  const chartStartDate = dayjs().subtract(10, "days").startOf("day").toDate(); // coleta a data de dias 10 atrás
  const chartEndDate = dayjs().add(10, "days").endOf("day").toDate(); // coleta a data de 10 dias a frente

  const [
    [totalRevenue],
    [totalOrders],
    [totalProductsSold],
    pendingOrders,
    topCustomers,
    dailyOrdersData,
  ] = await Promise.all([
    // coleta o faturamento
    db
      .select({
        total: sum(ordersTable.total),
      })
      .from(ordersTable)
      .where(
        and(
          gte(ordersTable.createdAt, new Date(from)), // gte = greater than or equal to (maior ou igual a)
          lte(ordersTable.createdAt, new Date(to)), // lte = less than or equal to (menor ou igual a)
        ),
      ),
    // coleta a quantidade de pedidos
    db
      .select({
        total: count(),
      })
      .from(ordersTable)
      .where(
        and(
          gte(ordersTable.createdAt, new Date(from)), // gte = greater than or equal to (maior ou igual a)
          lte(ordersTable.createdAt, new Date(to)), // lte = less than or equal to (menor ou igual a)
        ),
      ),
    // coleta a quantidade de produtos vendidos
    db
      .select({
        total: sum(orderProduct.quantity),
      })
      .from(orderProduct)
      .where(
        and(
          gte(orderProduct.createdAt, new Date(from)), // gte = greater than or equal to (maior ou igual a)
          lte(orderProduct.createdAt, new Date(to)), // lte = less than or equal to (menor ou igual a)
        ),
      ),

    // coleta os pedidos pendentes
    db.query.order.findMany({
      where: and(
        eq(order.status, "IN_PROGRESS"),
        gte(order.createdAt, new Date(from)),
        lte(order.createdAt, new Date(to)),
      ),
      orderBy: desc(order.createdAt),
    }),

    // coleta o top 10 clientes que mais compraram
    db
      .select({
        customerName: order.customerName,
        orders: count(order.id),
      })
      .from(order)
      .groupBy(order.customerName)
      .orderBy(desc(count(order.id)))
      .limit(10),

    // coleta os dados diários
    db
      .select({
        date: sql<string>`DATE(${order.createdAt})`.as("date"),
        orders: count(order.id),
        revenue: sql<number>`COALESCE(SUM(${order.total}), 0)`.as("revenue"),
      })
      .from(order)
      .where(
        and(
          gte(order.createdAt, chartStartDate),
          lte(order.createdAt, chartEndDate),
        ),
      )
      .groupBy(sql`DATE(${order.createdAt})`)
      .orderBy(sql`DATE(${order.createdAt})`),
  ]);

  return {
    totalRevenue,
    totalOrders,
    totalProductsSold,
    pendingOrders,
    topCustomers,
    dailyOrdersData,
  };
};
