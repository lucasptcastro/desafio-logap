import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { getDashboard } from "@/data/get-dashboard";
import { auth } from "@/lib/auth";

import { DatePicker } from "./_components/date-picker";
import { OrdersChart } from "./_components/orders-chart";
import { pendingOrdersTableColumns } from "./_components/pending-orders-table-columns";
import { StatsCards } from "./_components/stats-cards";
import { TopCustomers } from "./_components/top-customers";

interface DashboardPageProps {
  searchParams: Promise<{
    from: string;
    to: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  const { from, to } = await searchParams;

  if (!from || !to) {
    redirect(
      `/dashboard?from=${dayjs().format("YYYY-MM-DD")}&to=${dayjs().add(1, "month").format("YYYY-MM-DD")}`,
    );
  }

  const {
    totalRevenue,
    totalOrders,
    totalProductsSold,
    pendingOrders,
    dailyOrdersData,
    topCustomers,
  } = await getDashboard({
    from,
    to,
  });

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
                  Dashboard
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            <span className="text-muted-foreground font-sans font-medium">
              Acesse uma visão geral detalhada das principais métricas e
              resultados dos agendamentos e faturamento da sua clínica
            </span>
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <DatePicker />
        </PageActions>
      </PageHeader>
      <PageContent>
        <StatsCards
          totalOrders={Number(totalOrders.total)}
          totalRevenue={Number(totalRevenue.total)}
          totalProductsSold={Number(totalProductsSold.total)}
        />

        <div className="grid grid-cols-[2.25fr_1fr] gap-4">
          <OrdersChart dailyOrdersData={dailyOrdersData} />
          <TopCustomers customers={topCustomers} />
        </div>
        <Card className="border-[#F4F4F5] shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="text-muted-foreground" />
                <CardTitle className="text-base">Pedidos pendentes</CardTitle>
              </div>
              <Link
                href="customerOrders"
                className="text-sm font-semibold text-[#9CA7B2]"
              >
                Ver todos
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={pendingOrdersTableColumns}
              data={pendingOrders}
            />
          </CardContent>
        </Card>
      </PageContent>
    </PageContainer>
  );
}
