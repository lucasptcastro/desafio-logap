"use client";
import { DataTable } from "@/components/ui/data-table";
import { menuCategory, product } from "@/db/schema";

import { productsTableColumns } from "./table-columns";

type ProductsTableClientProps = {
  products: (typeof product.$inferSelect)[];
  menuCategories: (typeof menuCategory.$inferSelect)[];
};

export function ProductsTableClient({
  products,
  menuCategories,
}: ProductsTableClientProps) {
  return (
    <DataTable data={products} columns={productsTableColumns(menuCategories)} />
  );
}
