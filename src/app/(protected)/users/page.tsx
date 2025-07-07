import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getUserRole } from "@/actions/get-user-role";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";

import AddUserButton from "./_components/add-user-button";
import { UsersTableClient } from "./_components/users-table";

export default async function UsersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const userRole = await getUserRole({ userId: session.user.id });

  if (!userRole?.data) {
    redirect("/login");
  }

  const userRoleName = userRole.data[0].roleName.toLowerCase();

  if (userRoleName === "vendedor") {
    redirect("/customerOrders");
  }

  if (userRoleName !== "administrador") {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          redirect("/login");
        },
      },
    });
  }

  const users = await db.query.usersTable.findMany();

  const roles = await db.query.rolesTable.findMany();

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink className="font-semibold">
                  Menu Principal
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-primary" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-primary font-semibold">
                  Usuários
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <PageTitle>Usuários</PageTitle>
          <PageDescription>
            Gerencie os usuários cadastrados no sistema
          </PageDescription>
        </PageHeaderContent>

        <PageActions>
          <AddUserButton roles={roles} />
        </PageActions>
      </PageHeader>

      <PageContent>
        <div>
          <UsersTableClient users={users} roles={roles} />
        </div>
      </PageContent>
    </PageContainer>
  );
}
