import { z } from "zod";

export const upsertMenuCategorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  restaurantId: z
    .string()
    .min(1, { message: "ID do restaurante é obrigatório" }),
});

export type UpsertMenuCategorySchema = z.infer<typeof upsertMenuCategorySchema>;
