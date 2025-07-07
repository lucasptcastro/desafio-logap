"use client";

import clsx from "clsx";
import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
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
  if (status === "IN_PROGRESS") return "Em andamento";
  if (status === "CANCELED") return "Cancelado";
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
            <Badge
              className={clsx("", {
                "bg-red-100 text-red-500": order.status === "CANCELED",
                "bg-yellow-100 text-yellow-500": order.status === "IN_PROGRESS",
                "bg-green-100 text-green-500": order.status === "FINISHED",
              })}
            >
              {getStatusLabel(order.status)}
            </Badge>

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
