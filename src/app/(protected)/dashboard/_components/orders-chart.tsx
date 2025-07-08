"use client";

import dayjs from "dayjs";
import { Target } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/helpers/format-currency";

export const description = "An area chart with gradient fill";

interface DailyOrder {
  date: string;
  orders: number;
  revenue: number | null;
}

interface OrdersChartProps {
  dailyOrdersData: DailyOrder[];
}

export function OrdersChart({ dailyOrdersData }: OrdersChartProps) {
  // Gera 15 dias (data atual + 7 dias atrás + 7 dias a frente)
  const chartDays = Array.from({ length: 15 }).map((_item, index) =>
    dayjs()
      .subtract(7 - index, "days")
      .format("YYYY-MM-DD"),
  );

  // Coleta os dados para cada um dos 15 dias
  const chartData = chartDays.map((date) => {
    const dataForDay = dailyOrdersData.find((item) => item.date === date);
    return {
      date: dayjs(date).format("DD/MM"),
      fullDate: date,
      orders: dataForDay?.orders || 0, // se dataForDay for undefined/null retorna 0
      revenue: Number(dataForDay?.revenue) || 0, // se dataForDay for undefined/null retorna 0
    };
  });

  const chartConfig = {
    orders: {
      label: "Pedidos",
      color: "#0B68F7",
    },
    revenue: {
      label: "Faturamento",
      color: "#10B981",
    },
  } satisfies ChartConfig;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = (props: any) => (
    <ChartTooltipContent
      {...props}
      formatter={(value, name) => {
        if (name === "revenue") {
          return (
            <>
              <div className="h-3 w-3 rounded bg-[#10B981]" />
              <span className="text-muted-foreground">Faturamento:</span>
              <span className="font-semibold">
                {formatCurrency(Number(value))}
              </span>
            </>
          );
        }
        return (
          <>
            <div className="h-3 w-3 rounded bg-[#0B68F7]" />
            <span className="text-muted-foreground">Pedidos:</span>
            <span className="font-semibold">{value}</span>
          </>
        );
      }}
      labelFormatter={(label, payload) => {
        if (payload && payload[0]) {
          return dayjs(payload[0].payload?.fullDate).format(
            "DD/MM/YYYY (dddd)",
          );
        }
        return label;
      }}
    />
  );

  return (
    <Card className="h-fit border-[#F4F4F5] shadow-none">
      <CardHeader className="flex flex-row items-center gap-2">
        <Target className="text-muted-foreground" />
        <CardTitle>Pedidos e faturamento</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <AreaChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {/* Coluna horizontal com as datas */}
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            {/* Coluna vertical com alguns valores */}
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            {/* Coluna vertical com alguns valores formatados */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCurrency(value)}
            />
            {/* Tooltip personalizado para exibir o faturamento e os agendamentos */}
            <ChartTooltip content={CustomTooltip} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="orders"
              stroke="var(--color-orders)"
              fill="var(--color-orders)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)" // cor da linha do chart
              fill="var(--color-revenue)" // cor do preenchimento  do chart
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
