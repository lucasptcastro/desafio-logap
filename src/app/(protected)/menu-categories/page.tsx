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

import AddMenuCategoryButton from "./_components/add-category-button";
import { MenuCategoriesTableClient } from "./_components/menu-categories.table";

export default async function ProductsPage() {
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

  const menuCategories = await db.query.menuCategory.findMany();

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
                  Categorias do menu
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <PageTitle>Categorias do menu</PageTitle>
          <PageDescription>
            Gerencie as categorias do menu disponíveis no sistema
          </PageDescription>
        </PageHeaderContent>

        <PageActions>
          <AddMenuCategoryButton />
        </PageActions>
      </PageHeader>

      <PageContent>
        <MenuCategoriesTableClient menuCategories={menuCategories} />
      </PageContent>
    </PageContainer>
  );
}
