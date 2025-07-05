import { z } from "zod";

export const addUserRoleSchema = z.object({
  userId: z.string().min(1, { message: "ID é obrigatório" }),
  roleId: z.string().min(1, { message: "Perfil é obrigatório" }),
});

export type AddUserRoleSchema = z.infer<typeof addUserRoleSchema>;
