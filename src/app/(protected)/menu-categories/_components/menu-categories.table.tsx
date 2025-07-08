"use client";
import { DataTable } from "@/components/ui/data-table";
import { menuCategory } from "@/db/schema";

import { menuCategoriesTableColumns } from "./table-columns";

type MenuCategoriesTableClientProps = {
  menuCategories: (typeof menuCategory.$inferSelect)[];
};

export function MenuCategoriesTableClient({
  menuCategories,
}: MenuCategoriesTableClientProps) {
  return (
    <DataTable data={menuCategories} columns={menuCategoriesTableColumns} />
  );
}
