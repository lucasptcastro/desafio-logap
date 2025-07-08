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
import { DataTable } from "@/components/ui/data-table";
import {
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

import { customerOrdersTableColumns } from "./_components/table-columns";

export default async function CustomerOrdersPage() {
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

  if (userRoleName !== "administrador" && userRoleName !== "vendedor") {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          redirect("/login");
        },
      },
    });
  }

  const orders = await db.query.order.findMany();

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
                  Pedidos
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <PageTitle>Pedidos</PageTitle>
          <PageDescription>
            Gerencie os pedidos realizados no sistema
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>

      <PageContent>
        <DataTable data={orders} columns={customerOrdersTableColumns} />
      </PageContent>
    </PageContainer>
  );
}
