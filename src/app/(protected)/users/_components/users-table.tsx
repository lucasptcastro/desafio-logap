"use client";
import { DataTable } from "@/components/ui/data-table";
import { rolesTable, usersTable } from "@/db/schema";

import { usersTableColumns } from "./table-columns";

type UsersTableClientProps = {
  users: (typeof usersTable.$inferSelect)[];
  roles: (typeof rolesTable.$inferSelect)[];
};

export function UsersTableClient({ users, roles }: UsersTableClientProps) {
  return <DataTable data={users} columns={usersTableColumns(roles)} />;
}
