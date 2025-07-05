import { z } from "zod";

export const updateUserSchema = z.object({
  id: z.string().uuid().min(1, { message: "ID é obrigatório" }),
  name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  roleId: z.string().uuid().min(1, { message: "Perfil é obrigatório" }),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
