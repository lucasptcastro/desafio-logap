import { UserSquare } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getInitials } from "@/helpers/initials";

interface TopCustomersProps {
  customers: {
    customerName: string;
    orders: number;
  }[];
}

export function TopCustomers({ customers }: TopCustomersProps) {
  return (
    <Card className="mx-auto w-full border-[#F4F4F5] shadow-none">
      <CardContent>
        {/* Header */}
        <div className="mb-8 flex flex-col justify-center gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserSquare className="text-muted-foreground" />
              <CardTitle className="text-base">Clientes mais ativos</CardTitle>
            </div>

            <Link
              href="/customer-orders"
              className="text-sm font-semibold text-[#9CA7B2]"
            >
              Ver todos
            </Link>
          </div>
          <hr className="h-[1px] w-full bg-[#F4F4F5] opacity-30" />
        </div>

        {/* Doctors List */}
        <ScrollArea className="h-72">
          <div className="space-y-6">
            {customers.map((customer) => (
              <div
                key={customer.customerName}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gray-100 text-lg font-medium text-gray-600">
                      {getInitials(customer.customerName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm">{customer.customerName}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground text-sm font-medium">
                    {customer.orders} pedidos
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
