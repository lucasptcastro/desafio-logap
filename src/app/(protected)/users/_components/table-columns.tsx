"use client";

import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";

import { Badge } from "@/components/ui/badge";
import { rolesTable, usersTable } from "@/db/schema";

import { UsersTableActions } from "./table-actions";

type User = typeof usersTable.$inferSelect;

export const usersTableColumns = (
  roles: (typeof rolesTable.$inferSelect)[],
): ColumnDef<User>[] => [
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
    accessorKey: "roleId",
    header: "Perfil",
    cell: (params) => {
      const roleUser = roles.find(
        (role) => params.row.original.roleId === role.id,
      );

      return (
        <Badge
          className={clsx("", {
            "bg-blue-100 text-blue-500": roleUser?.name === "Administrador",
            "bg-orange-100 text-orange-500": roleUser?.name === "Cliente",
            "bg-green-100 text-green-500": roleUser?.name === "Vendedor",
          })}
        >
          {roleUser?.name}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: (params) => {
      const user = params.row.original;
      return <UsersTableActions user={user} roles={roles} />;
    },
  },
];
