"use client";

import { ColumnDef } from "@tanstack/react-table";

import { menuCategory } from "@/db/schema";

import { MenuCategoriesTableActions } from "./table-actions";

type MenuCategory = typeof menuCategory.$inferSelect;

export const menuCategoriesTableColumns: ColumnDef<MenuCategory>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Nome",
  },
  {
    id: "actions",
    cell: (params) => {
      const menuCategory = params.row.original;
      return <MenuCategoriesTableActions menuCategory={menuCategory} />;
    },
  },
];
