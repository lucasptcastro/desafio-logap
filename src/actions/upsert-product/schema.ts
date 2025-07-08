import { z } from "zod";

export const upsertProductSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  description: z.string().min(1, { message: "Descrição é obrigatória" }),
  price: z.number().min(1, { message: "O preço é obrigatório" }),
  imageUrl: z.string().url({ message: "URL da imagem inválida" }),
  ingredients: z
    .array(z.string())
    .min(1, { message: "Pelo menos um ingrediente é obrigatório" }),
  restaurantId: z
    .string()
    .min(1, { message: "ID do restaurante é obrigatório" }),
  menuCategoryId: z
    .string()
    .min(1, { message: "ID da categoria do menu é obrigatório" }),
});

export type UpsertProductSchema = z.infer<typeof upsertProductSchema>;
