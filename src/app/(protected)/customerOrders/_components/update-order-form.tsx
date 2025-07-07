"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updateOrder } from "@/actions/update-order-status";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { order as ordersTable } from "@/db/schema";

const formSchema = z.object({
  id: z.number(),
  status: z.string(),
});

interface UpdateOrderFormProps {
  isOpen: boolean;
  onSuccess?: () => void;
  order: typeof ordersTable.$inferSelect;
}

export const UpdateOrderForm = ({
  isOpen,
  onSuccess,
  order,
}: UpdateOrderFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: order?.id ?? 0,
      status: order?.status ?? "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(order);
    }
  }, [isOpen, form, order]);

  const updateOrderAction = useAction(updateOrder, {
    onSuccess: () => {
      toast.success("Pedido atualizado com sucesso.");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao atualizar o pedido.");
    },
  });

  const onUpdateOrder = (values: z.infer<typeof formSchema>) => {
    updateOrderAction.execute({
      id: values.id,
      status: values.status,
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Atualizar pedido</DialogTitle>
        <DialogDescription>Edite as informações desse pedido</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onUpdateOrder)} className="space-y-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status do pedido</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CANCELED">Cancelado</SelectItem>
                    <SelectItem value="IN_PROGRESS">Em andamento</SelectItem>
                    <SelectItem value="FINISHED">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button
              type="submit"
              disabled={updateOrderAction.isPending}
              className="w-full"
            >
              {updateOrderAction.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Atualizar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
