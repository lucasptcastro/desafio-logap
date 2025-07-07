"use client";

import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { product } from "@/db/schema";

interface ProductHeaderProps {
  product: Pick<typeof product.$inferSelect, "name" | "imageUrl">;
}

const ProductHeader = ({ product }: ProductHeaderProps) => {
  const handleOrdersClick = () => router.push(`/orders`);

  const router = useRouter();

  return (
    <div className="relative min-h-[300px] w-full">
      <Button
        className="absolute top-4 left-4 z-50 rounded-full"
        variant={"secondary"}
        size={"icon"}
        onClick={() => router.back()}
      >
        <ChevronLeftIcon />
      </Button>

      <Image
        src={product.imageUrl}
        fill
        alt={product.name}
        className="object-contain"
      />

      <Button
        onClick={handleOrdersClick}
        className="absolute top-4 right-4 z-50 rounded-full"
        variant={"secondary"}
        size={"icon"}
      >
        <ScrollTextIcon />
      </Button>
    </div>
  );
};

export default ProductHeader;
