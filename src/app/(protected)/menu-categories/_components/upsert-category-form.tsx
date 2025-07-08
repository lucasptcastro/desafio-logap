"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { upsertMenuCategory } from "@/actions/upsert-menu-category";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { menuCategory } from "@/db/schema";

const formSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  restaurantId: z
    .string()
    .min(1, { message: "ID do restaurante é obrigatório" }),
});

interface UpsertMenuCategoryFormProps {
  isOpen: boolean;
  onSuccess?: () => void;
  menuCategory?: typeof menuCategory.$inferSelect;
}

export const UpsertMenuCategoryForm = ({
  isOpen,
  onSuccess,
  menuCategory,
}: UpsertMenuCategoryFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: menuCategory?.name ?? "",
      restaurantId: "df286b2b-54c4-4bec-9715-950e8000f895",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: menuCategory?.name ?? "",
        restaurantId: "df286b2b-54c4-4bec-9715-950e8000f895",
      });
    }
  }, [isOpen, form, menuCategory]);

  const upsertMenuCategoryAction = useAction(upsertMenuCategory, {
    onSuccess: () => {
      toast.success("Categoria salva com sucesso");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao salvar a categoria");
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    upsertMenuCategoryAction.execute({
      ...values,
      id: menuCategory?.id,
    });
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {menuCategory ? menuCategory.name : "Adicionar categoria"}
        </DialogTitle>
        <DialogDescription>
          {menuCategory
            ? "Edite as informações dessa categoria."
            : "Adicione uma nova categoria."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da categoria</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome da categoria" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button
              type="submit"
              disabled={upsertMenuCategoryAction.isPending}
              className="w-full"
            >
              {menuCategory ? (
                upsertMenuCategoryAction.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Atualizar"
                )
              ) : upsertMenuCategoryAction.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Criar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
