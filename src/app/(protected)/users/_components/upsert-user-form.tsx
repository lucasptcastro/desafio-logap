"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { addUserRole } from "@/actions/add-user-role";
import { updateUser } from "@/actions/update-user";
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
import { rolesTable, usersTable } from "@/db/schema";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  roleId: z.string().min(1, { message: "Perfil é obrigatório" }),
});

interface UpsertUserFormProps {
  isOpen: boolean;
  onSuccess?: () => void;
  user?: typeof usersTable.$inferSelect;
  roles?: (typeof rolesTable.$inferSelect)[];
}

export const UpsertUserForm = ({
  isOpen,
  onSuccess,
  user,
  roles,
}: UpsertUserFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: user?.id ?? "",
      name: user?.name ?? "",
      email: user?.email ?? "",
      roleId: user?.roleId ?? "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: user?.id ?? "",
        name: user?.name ?? "",
        email: user?.email ?? "",
        roleId: user?.roleId ?? "",
      });
    }
  }, [isOpen, form, user]);

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
        password: "BemVindo!",
      },
      {
        onSuccess: ({ data }) => {
          addUserRoleAction.execute({
            userId: data.user.id,
            roleId: values.roleId,
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

  const updateUserAction = useAction(updateUser, {
    onSuccess: () => {
      toast.success("Usuário atualizado com sucesso.");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao atualizar o usuário.");
    },
  });

  const onUpdateUser = (values: z.infer<typeof formSchema>) => {
    updateUserAction.execute({
      id: values.id,
      name: values.name,
      email: values.email,
      roleId: values.roleId,
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{user ? user.name : "Adicionar usuário"}</DialogTitle>
        <DialogDescription>
          {user
            ? "Edite as informações desse usuário."
            : "Adicione um novo usuário."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={
            !user
              ? form.handleSubmit(onSubmit)
              : form.handleSubmit(onUpdateUser)
          }
          className="space-y-4"
        >
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
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Perfil</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um perfil" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles?.map((role) => (
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
              disabled={
                !user ? form.formState.isSubmitting : updateUserAction.isPending
              }
              className="w-full"
            >
              {!user ? (
                form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Criar"
                )
              ) : updateUserAction.isPending ? (
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
