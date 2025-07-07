"use client";

// import { Prisma } from "@prisma/client";
import { ClockIcon } from "lucide-react";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { menuCategory, product, restaurant } from "@/db/schema";
import { formatCurrency } from "@/helpers/format-currency";

import { CartContext } from "../_contexts/cart";
import CartSheet from "./cart-sheet";
import Products from "./products";

// Essa tipagem do prisma faz com que o restaurant receba o que tem na tabela restaurant com um join na tabela menuCategory que tem um join na tabela products
interface RestaurantCategoriesProps {
  restaurant: typeof restaurant.$inferSelect & {
    MenuCategory: Array<
      typeof menuCategory.$inferSelect & {
        products: Array<typeof product.$inferSelect>;
      }
    >;
  };
}

type menuCategoriesWithProducts = typeof menuCategory.$inferSelect & {
  products: Array<typeof product.$inferSelect>;
};

const RestaurantCategories = ({ restaurant }: RestaurantCategoriesProps) => {
  const [isVisible, setIsVisible] = useState(true);

  let lastScrollY = 0; // Variável para armazenar a última posição do scroll

  // Função para lidar com o scroll. Se usar scroll para baixo irá ocutar a div da sacola, senão exibe
  useEffect(() => {
    // Função que lida com o evento de scroll
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      const scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight; // Altura total do conteúdo
      const clientHeight =
        document.documentElement.clientHeight || document.body.clientHeight; // Altura visível da janela

      const maxScrollYHeight = scrollHeight - clientHeight;

      if (currentScrollY >= maxScrollYHeight) {
        setIsVisible(false);
      }

      if (currentScrollY > lastScrollY) {
        // Rolando para baixo
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY; // Garantir que o valor não fique negativo
    };

    // Adiciona o event listener para o scroll
    window.addEventListener("scroll", handleScroll);

    // Limpa o event listener ao desmontar o componente
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [selectedCategory, setSelectedCategory] =
    useState<menuCategoriesWithProducts>(restaurant.MenuCategory[0]);

  const { products, total, toggleCart, totalQuantity } =
    useContext(CartContext);

  const handleCategoryClick = (category: menuCategoriesWithProducts) => {
    setSelectedCategory(category);
  };

  const getCategoryButtonVariant = (category: menuCategoriesWithProducts) => {
    return selectedCategory.id === category.id ? "default" : "secondary";
  };

  const showProductsBag = () => {
    if (products.length <= 0) return;

    if (!isVisible) return;

    return (
      <div className="fixed right-0 bottom-0 left-0 flex w-full items-center justify-between border-t bg-white px-5 py-3">
        <div>
          <p className="text-muted-foreground text-xs">Total dos pedidos</p>

          <p className="text-sm font-semibold">
            {formatCurrency(total)}
            <span className="text-muted-foreground text-xs font-normal">
              / {totalQuantity} {totalQuantity > 1 ? "itens" : "item"}
            </span>
          </p>
        </div>

        <Button onClick={toggleCart}>Ver sacola</Button>

        <CartSheet />
      </div>
    );
  };

  return (
    <div className="relative z-50 mt-[-1.5rem] rounded-3xl bg-white">
      <div className="p-5">
        <div className="flex items-center gap-3">
          <Image
            alt="Logo MC LogAp"
            src="/mc-logap.png"
            className="rounded"
            height={45}
            width={45}
          />

          <div>
            <h2 className="text-lg font-semibold text-[#1D4382]">
              {restaurant.name}
            </h2>
            <p className="text-xs opacity-55">{restaurant.description}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1 text-xs text-green-500">
          <ClockIcon size={12} />
          <p>Aberto!</p>
        </div>
      </div>

      <ScrollArea className="w-full">
        <div className="flex w-max space-x-4 p-4 pt-0">
          {restaurant.MenuCategory.map((category) => (
            <Button
              key={category.id}
              variant={getCategoryButtonVariant(category)}
              size={"sm"}
              className="rounded-full"
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
            </Button>
          ))}
        </div>
        {/* Faz com que a rolagem seja na horizontal */}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <h3 className="px-5 pt-2 font-semibold">{selectedCategory.name}</h3>

      <Products products={selectedCategory.products} />

      {showProductsBag()}
    </div>
  );
};

export default RestaurantCategories;
