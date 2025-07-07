import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { product } from "@/db/schema";
import { formatCurrency } from "@/helpers/format-currency";

interface ProductProps {
  products: (typeof product.$inferSelect)[];
}

const Products = ({ products }: ProductProps) => {
  const searchParams = useSearchParams();
  const consumptionMethod = searchParams.get("consumptionMethod");

  return (
    <div className="space-y-3 px-5">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/menu/${product.id}?consumptionMethod=${consumptionMethod}`}
          className="flex items-center justify-between gap-10 border-b py-3"
        >
          {/* ESQUERDA */}
          <div>
            <h3 className="text-sm font-medium">{product.name}</h3>
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {product.description}
            </p>

            <p className="pt-3 text-sm font-semibold">
              {formatCurrency(product.price)}
            </p>
          </div>

          {/* DIREITA */}
          <div className="relative min-h-[82px] min-w-[120px]">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="rounded-lg object-contain"
            />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Products;
