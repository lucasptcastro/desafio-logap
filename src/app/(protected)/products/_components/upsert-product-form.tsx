"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { upsertProduct } from "@/actions/upsert-product";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { menuCategory, product } from "@/db/schema";

const formSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  description: z.string().min(1, { message: "Descrição é obrigatória" }),
  price: z.number().min(1, { message: "O preço é obrigatório" }),
  imageUrl: z.string().url({ message: "URL da imagem inválida" }),
  ingredients: z
    .string()
    .min(1, { message: "Pelo menos um ingrediente é obrigatório" }),
  restaurantId: z
    .string()
    .min(1, { message: "ID do restaurante é obrigatório" }),
  menuCategoryId: z
    .string()
    .min(1, { message: "ID da categoria do menu é obrigatório" }),
});

interface UpsertProductFormProps {
  isOpen: boolean;
  onSuccess?: () => void;
  product?: typeof product.$inferSelect;
  menuCategories?: (typeof menuCategory.$inferSelect)[];
}

export const UpsertProductForm = ({
  isOpen,
  onSuccess,
  product,
  menuCategories,
}: UpsertProductFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      imageUrl: product?.imageUrl ?? "",
      ingredients: product?.ingredients?.join(", ") ?? "",
      menuCategoryId: product?.menuCategoryId ?? "",
      restaurantId: "df286b2b-54c4-4bec-9715-950e8000f895",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: product?.name ?? "",
        description: product?.description ?? "",
        price: product?.price ?? 0,
        imageUrl: product?.imageUrl ?? "",
        ingredients: product?.ingredients?.join(", ") ?? "",
        menuCategoryId: product?.menuCategoryId ?? "",
        restaurantId: "df286b2b-54c4-4bec-9715-950e8000f895",
      });
    }
  }, [isOpen, form, product]);

  const upsertProductAction = useAction(upsertProduct, {
    onSuccess: () => {
      toast.success("Produto salvo com sucesso");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao salvar o produto");
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const ingredientsArray = values.ingredients
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean); // remove strings vazias

    upsertProductAction.execute({
      ...values,
      ingredients: ingredientsArray,
      id: product?.id,
    });
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {product ? product.name : "Adicionar produto"}
        </DialogTitle>
        <DialogDescription>
          {product
            ? "Edite as informações desse produto."
            : "Adicione um novo produto."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do produto</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome do produto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite a descrição do produto"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço do produto</FormLabel>
                <FormControl>
                  <NumericFormat
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value.floatValue);
                    }}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    thousandSeparator="."
                    allowNegative={false}
                    allowLeadingZeros={false}
                    customInput={Input}
                    prefix="R$"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL da imagem</FormLabel>
                <FormControl>
                  <Input placeholder="Digite a URL da imagem" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ingredients"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ingredientes</FormLabel>
                <FormControl>
                  <Input placeholder="Digite os ingredientes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="menuCategoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria do Menu</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {menuCategories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button
              type="submit"
              disabled={upsertProductAction.isPending}
              className="w-full"
            >
              {product ? (
                upsertProductAction.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Atualizar"
                )
              ) : upsertProductAction.isPending ? (
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
