"use client";

import { ColumnDef } from "@tanstack/react-table";

import { menuCategory, product } from "@/db/schema";
import { formatCurrency } from "@/helpers/format-currency";

import { ProductsTableActions } from "./table-actions";

type Product = typeof product.$inferSelect;

export const productsTableColumns = (
  menuCategories: (typeof menuCategory.$inferSelect)[],
): ColumnDef<Product>[] => [
  {
    id: "name",
    accessorKey: "name",
    header: "Nome",
  },
  {
    id: "menuCategory",
    accessorKey: "menuCategoryId",
    header: "Categoria do Menu",
    cell: (params) => {
      const menuCategory = menuCategories.find(
        (category) => category.id === params.row.original.menuCategoryId,
      );

      return <span>{menuCategory?.name}</span>;
    },
  },
  {
    id: "price",
    accessorKey: "price",
    header: "Preço",
    cell: (params) => {
      return <span>{formatCurrency(params.row.original.price)}</span>;
    },
  },
  {
    id: "actions",
    cell: (params) => {
      const product = params.row.original;
      return (
        <ProductsTableActions
          product={product}
          menuCategories={menuCategories}
        />
      );
    },
  },
];
