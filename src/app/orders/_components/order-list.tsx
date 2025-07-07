"use client";

import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { orderStatusEnum } from "@/db/schema";
import { order, orderProduct, product, restaurant } from "@/db/schema";
// import { formatCurrency } from "@/helpers/format-currency";

interface OrderListProps {
  orders: Array<
    typeof order.$inferSelect & {
      restaurant: Pick<
        typeof restaurant.$inferSelect,
        "name" | "avatarImageUrl"
      >;
      OrderProduct: Array<
        typeof orderProduct.$inferSelect & {
          product: typeof product.$inferSelect;
        }
      >;
    }
  >;
}

const getStatusLabel = (
  status: (typeof orderStatusEnum.enumValues)[number],
) => {
  if (status === "FINISHED") return "Finalizado";
  if (status === "IN_PREPARATION") return "Em andamento";
  if (status === "PENDING") return "Cancelado";
  return "";
};

const OrderList = ({ orders }: OrderListProps) => {
  const router = useRouter();
  const handleBackClick = () => router.back();

  return (
    <div className="space-y-6 p-6">
      <Button
        size="icon"
        variant="secondary"
        className="rounded-full"
        onClick={handleBackClick}
      >
        <ChevronLeftIcon />
      </Button>

      <div className="flex items-center gap-3">
        <ScrollTextIcon />

        <h2 className="text-lg font-semibold">Meus Pedidos</h2>
      </div>

      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="space-y-4 p-5">
            <div
              className={`w-fit rounded-full px-2 py-1 text-xs font-semibold text-white ${order.status === orderStatusEnum.enumValues[0] ? "bg-red-500 text-white" : order.status === orderStatusEnum.enumValues[1] ? "bg-[#f7b731] text-white" : "bg-gray-200 text-gray-500"}`}
            >
              {getStatusLabel(order.status)}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative h-5 w-5">
                <Image
                  src={order.restaurant.avatarImageUrl}
                  alt={order.restaurant.name}
                  fill
                  className="rounded-sm"
                />
              </div>

              <p className="text-sm font-semibold">{order.restaurant.name}</p>
            </div>
            <Separator />

            <div className="space-y-2">
              {order.OrderProduct.map((orderProduct) => (
                <div key={orderProduct.id} className="flex items-center gap-2">
                  <div className="font-semibol flex h-5 w-5 items-center justify-center rounded-full bg-gray-400 text-xs text-white">
                    {orderProduct.quantity}
                  </div>
                  <p className="text-sm">{orderProduct.product.name}</p>
                </div>
              ))}
            </div>

            <Separator />
            <p className="text-sm font-medium">{order.total}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderList;
