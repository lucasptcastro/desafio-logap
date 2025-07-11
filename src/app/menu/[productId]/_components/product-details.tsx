"use client";

import { ChefHatIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";

import CartSheet from "@/app/menu/_components/cart-sheet";
import { CartContext } from "@/app/menu/_contexts/cart";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { product, restaurant } from "@/db/schema";
import { formatCurrency } from "@/helpers/format-currency";

interface ProductDetailsProps {
  product: Pick<
    typeof product.$inferSelect,
    "id" | "name" | "description" | "imageUrl" | "price" | "ingredients"
  > & {
    restaurant: Pick<typeof restaurant.$inferSelect, "name" | "avatarImageUrl">;
  };
}
const ProductDetails = ({ product }: ProductDetailsProps) => {
  const { toggleCart, addProduct } = useContext(CartContext);

  const [quantity, setQuantity] = useState<number>(1);

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => {
      if (prev === 1) {
        return 1;
      }

      return prev - 1;
    });
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    addProduct({
      ...product,
      quantity: quantity,
    });
    toggleCart();
  };

  return (
    <>
      <div className="relative z-50 mt-[-1.5rem] flex flex-auto flex-col overflow-hidden rounded-t-3xl p-5">
        <div className="flex-auto overflow-hidden">
          {/* RESTAURANTE */}
          <div className="flex items-center gap-1.5">
            <Image
              alt="Logo MC LogAp"
              src="/mc-logap.png"
              className="rounded"
              width={16}
              height={16}
            />

            <p className="text-cs font-semibold text-[#1D4382]">
              {product.restaurant.name}
            </p>
          </div>

          {/* NOME DO PRODUTO */}
          <h2 className="mt-1 text-xl font-semibold">{product.name}</h2>

          {/* PREÇO E QUANTIDADE */}
          <div className="mt-3 flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              {formatCurrency(product.price)}
            </h3>

            <div className="flex items-center gap-3 text-center">
              <Button
                variant="outline"
                className="h-8 w-8 rounded-xl"
                onClick={handleDecreaseQuantity}
              >
                <ChevronLeftIcon />
              </Button>
              <p className="w-4">{quantity}</p>
              <Button
                className="h-8 w-8 rounded-xl"
                onClick={handleIncreaseQuantity}
              >
                <ChevronRightIcon />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-screen">
            {/* SOBRE */}
            <div className="mt-6 h-fit space-y-3">
              <h4 className="font-semibold">Sobre</h4>
              <p className="text-muted-foreground text-sm">
                {product.description}
              </p>
            </div>

            {/* INGREDIENTES */}
            <div className="my-6 h-screen space-y-3">
              <div className="flex items-center gap-1">
                <ChefHatIcon />
                <h4 className="font-semibold">Ingredientes</h4>
              </div>

              <ul className="text-muted-fo text-muted-foreground list-disc px-5 text-sm">
                {product.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            </div>
          </ScrollArea>
        </div>

        <Button className="mt-2 w-full rounded-full" onClick={handleAddToCart}>
          Adicionar à sacola
        </Button>

        <CartSheet />
      </div>
    </>
  );
};

export default ProductDetails;
