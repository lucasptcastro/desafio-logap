"use client";

import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";

import { Badge } from "@/components/ui/badge";
import { order } from "@/db/schema";
import { cpfMask } from "@/helpers/cpf-mask";
import { formatCurrency } from "@/helpers/format-currency";

type PendingOrder = typeof order.$inferSelect;

export const pendingOrdersTableColumns: ColumnDef<PendingOrder>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "Nº Pedido",
  },
  {
    id: "customerName",
    accessorKey: "customerName",
    header: "Cliente",
  },
  {
    id: "customerCpf",
    accessorKey: "customerCpf",
    header: "CPF",
    cell: (params) => {
      return <span>{cpfMask(params.row.original.customerCpf)}</span>;
    },
  },
  {
    id: "total",
    accessorKey: "total",
    header: "Total",
    cell: (params) => {
      return <span>{formatCurrency(params.row.original.total)}</span>;
    },
  },
  {
    id: "consumptionMethod",
    accessorKey: "consumptionMethod",
    header: "Método de Consumo",
    cell: (params) => {
      return (
        <Badge
          className={clsx("", {
            "bg-blue-100 text-blue-500":
              params.row.original.consumptionMethod === "DINE_IN",
            "bg-purple-100 text-purple-500":
              params.row.original.consumptionMethod === "TAKEAWAY",
          })}
        >
          {params.row.original.consumptionMethod === "DINE_IN"
            ? "No Restaurante"
            : ""}
          {params.row.original.consumptionMethod === "TAKEAWAY"
            ? "Para Viagem"
            : ""}
        </Badge>
      );
    },
  },
  {
    id: "statys",
    accessorKey: "status",
    header: "Status",
    cell: (params) => {
      return (
        <Badge
          className={clsx("", {
            "bg-red-100 text-red-500":
              params.row.original.status === "CANCELED",
            "bg-yellow-100 text-yellow-500":
              params.row.original.status === "IN_PROGRESS",
            "bg-green-100 text-green-500":
              params.row.original.status === "FINISHED",
          })}
        >
          {params.row.original.status === "CANCELED" ? "Cancelado" : ""}
          {params.row.original.status === "IN_PROGRESS" ? "Em andamento" : ""}
          {params.row.original.status === "FINISHED" ? "Finalizado" : ""}
        </Badge>
      );
    },
  },
];
