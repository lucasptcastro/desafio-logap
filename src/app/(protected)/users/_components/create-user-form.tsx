"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { addUserRole } from "@/actions/add-user-role";
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
import { rolesTable } from "@/db/schema";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  role: z.string().uuid().min(1, { message: "Perfil é obrigatório" }),
});

interface CreateUserFormProps {
  isOpen: boolean;
  onSuccess?: () => void;
  roles: (typeof rolesTable.$inferSelect)[];
}

export const CreateUserForm = ({
  isOpen,
  onSuccess,
  roles,
}: CreateUserFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const addUserRoleAction = useAction(addUserRole, {
    onSuccess: () => {
      toast.success("Usuário criado com sucesso");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao adicionar usuário");
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // função assíncrona usando a instância do better-auth para criar um usuário com email e senha
    await authClient.signUp.email(
      {
        email: values.email,
        name: values.name,
        password: "Teste123@",
      },
      {
        onSuccess: ({ data }) => {
          addUserRoleAction.execute({
            userId: data.user.id,
            roleId: values.role,
          });
        },
        onError: (ctx) => {
          if (ctx.error.code === "USER_ALREADY_EXISTS") {
            toast.error("E-mail já cadastrado");
            return;
          }

          toast.error("Erro ao criar usuário");
        },
      },
    );
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar usuário</DialogTitle>
        <DialogDescription>Adicione um novo usuário</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do usuário</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o nome completo do usuário"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="exemplo@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Perfil</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um perfil" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
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
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Criar usuário"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
