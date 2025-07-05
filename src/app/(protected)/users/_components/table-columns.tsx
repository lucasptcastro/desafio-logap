"use client";

import { ColumnDef } from "@tanstack/react-table";

import { usersTable } from "@/db/schema";

import { UsersTableActions } from "./table-actions";

type User = typeof usersTable.$inferSelect;

export const usersTableColumns: ColumnDef<User>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Nome",
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "role",
    accessorKey: "role",
    header: "Perfil",
  },
  {
    id: "actions",
    cell: (params) => {
      const user = params.row.original;
      return <UsersTableActions user={user} />;
    },
  },
];
