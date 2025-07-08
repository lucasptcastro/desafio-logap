import { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatCurrency } from "@/helpers/format-currency";

import { CartContext } from "../_contexts/cart";
import CartProductItem from "./cart-product-item";
import FinishOrderDialog from "./finish-order-dialog";

const CartSheet = () => {
  const [finishOrderDialogIsOpen, setFinishOrderDialogIsOpen] =
    useState<boolean>(false);

  const { isOpen, toggleCart, products, total } = useContext(CartContext);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={toggleCart}>
        <SheetContent className="w-[80%]">
          <SheetHeader>
            <SheetTitle className="text-left">Sacola</SheetTitle>
          </SheetHeader>

          <div className="flex h-full flex-col px-2 py-5">
            <div className="flex-auto space-y-3">
              {products.map((product) => (
                <CartProductItem key={product.id} product={product} />
              ))}
            </div>

            <Card className="mb-6">
              <CardContent className="p-5">
                <div className="flex justify-between">
                  <p className="text-muted-foreground text-sm">Total</p>
                  <p className="text-sm font-semibold">
                    {formatCurrency(total)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full rounded"
              onClick={() => setFinishOrderDialogIsOpen(true)}
            >
              Finalizar pedido
            </Button>

            <FinishOrderDialog
              open={finishOrderDialogIsOpen}
              onOpenChange={setFinishOrderDialogIsOpen}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CartSheet;
