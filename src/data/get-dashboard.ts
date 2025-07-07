import { endOfDay, startOfDay } from "date-fns";
import dayjs from "dayjs";
import { and, count, desc, eq, gte, lte, sql, sum } from "drizzle-orm";

import { db } from "@/db";
import { order, order as ordersTable, orderProduct } from "@/db/schema";

interface Params {
  from: string;
  to: string;
}

export const getDashboard = async ({ from, to }: Params) => {
  const now = new Date(); // data atual
  const start = startOfDay(now); // cria uma data no formato 2025-06-18T00:00:00 (horário de início do dia)
  const end = endOfDay(now); // cria uma data no formato 2025-06-18T23:59:59.999 (horário de fim do dia)

  const chartStartDate = dayjs().subtract(10, "days").startOf("day").toDate(); // coleta a data de dias 10 atrás
  const chartEndDate = dayjs().add(10, "days").endOf("day").toDate(); // coleta a data de 10 dias a frente

  const [
    [totalRevenue],
    [totalOrders],
    [totalProductsSold],
    pendingOrders,
    // [totalPatients],
    // [totalDoctors],
    // topDoctors,
    // topSpecialties,
    // todayAppointments,
    // dailyAppointmentsData,
  ] = await Promise.all([
    db
      .select({
        total: sum(ordersTable.total),
      })
      .from(ordersTable)
      .where(
        and(
          gte(ordersTable.createdAt, new Date(from)), // gte = greater than or equal to (maior ou igual a)
          lte(ordersTable.createdAt, new Date(to)), // lte = less than or equal to (menor ou igual a)
        ),
      ),
    // coleta a quantidade de agendamentos onde a clínica é a do usuário e a data está entre as datas selecionadas
    db
      .select({
        total: count(),
      })
      .from(ordersTable)
      .where(
        and(
          gte(ordersTable.createdAt, new Date(from)), // gte = greater than or equal to (maior ou igual a)
          lte(ordersTable.createdAt, new Date(to)), // lte = less than or equal to (menor ou igual a)
        ),
      ),
    db
      .select({
        total: sum(orderProduct.quantity),
      })
      .from(orderProduct)
      .where(
        and(
          gte(orderProduct.createdAt, new Date(from)), // gte = greater than or equal to (maior ou igual a)
          lte(orderProduct.createdAt, new Date(to)), // lte = less than or equal to (menor ou igual a)
        ),
      ),
    // // coleta a quantidade de pacientes onde a clínica é a do usuário
    // db
    //   .select({ total: count() })
    //   .from(patientsTable)
    //   .where(eq(patientsTable.clinicId, session.user.clinic.id)),
    // // coleta a quantidade de médicos onde a clínica é a do usuário
    // db
    //   .select({
    //     total: count(),
    //   })
    //   .from(doctorsTable)
    //   .where(eq(doctorsTable.clinicId, session.user.clinic.id)),
    // // coleta os 10 médicos que mais possuem agendamentos e ordena de forma decrescente
    // db
    //   .select({
    //     id: doctorsTable.id,
    //     name: doctorsTable.name,
    //     avatarImageUrl: doctorsTable.avatarImageUrl,
    //     specialty: doctorsTable.specialty,
    //     appointments: count(appointmentsTable.id),
    //   })
    //   .from(doctorsTable)
    //   .leftJoin(
    //     appointmentsTable,
    //     and(
    //       eq(appointmentsTable.doctorId, doctorsTable.id),
    //       gte(appointmentsTable.date, new Date(from)),
    //       lte(appointmentsTable.date, new Date(to)),
    //     ),
    //   )
    //   .where(eq(doctorsTable.clinicId, session.user.clinic.id))
    //   .groupBy(doctorsTable.id)
    //   .orderBy(desc(count(appointmentsTable.id)))
    //   .limit(10),
    // // Coleta os agendamentos por especialidade
    // db
    //   .select({
    //     specialty: doctorsTable.specialty,
    //     appointments: count(appointmentsTable.id),
    //   })
    //   .from(appointmentsTable)
    //   .innerJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
    //   .where(
    //     and(
    //       eq(appointmentsTable.clinicId, session.user.clinic.id),
    //       gte(appointmentsTable.date, new Date(from)),
    //       lte(appointmentsTable.date, new Date(to)),
    //     ),
    //   )
    //   .groupBy(doctorsTable.specialty)
    //   .orderBy(desc(count(appointmentsTable.id)))
    //   .limit(10),
    // // coleta os agendamentos de hoje
    db.query.order.findMany({
      where: and(
        eq(order.status, "IN_PROGRESS"),
        gte(order.createdAt, start),
        lte(order.createdAt, end),
      ),
      orderBy: desc(order.createdAt),
    }),
    // db
    //   .select({
    //     date: sql<string>`DATE(${appointmentsTable.date})`.as("date"),
    //     appointments: count(appointmentsTable.id),
    //     revenue:
    //       sql<number>`COALESCE(SUM(${appointmentsTable.appointmentPriceInCents}), 0)`.as(
    //         "revenue",
    //       ),
    //   })
    //   .from(appointmentsTable)
    //   .where(
    //     and(
    //       eq(appointmentsTable.clinicId, session.user.clinic.id),
    //       gte(appointmentsTable.date, chartStartDate),
    //       lte(appointmentsTable.date, chartEndDate),
    //     ),
    //   )
    //   .groupBy(sql`DATE(${appointmentsTable.date})`)
    //   .orderBy(sql`DATE(${appointmentsTable.date})`),
  ]);

  return {
    totalRevenue,
    totalOrders,
    totalProductsSold,
    pendingOrders,
    // totalAppointments,
    // totalPatients,
    // totalDoctors,
    // topDoctors,
    // topSpecialties,
    // todayAppointments,
    // dailyAppointmentsData,
  };
};
