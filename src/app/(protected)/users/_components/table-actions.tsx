import { EditIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

// import { deletePatient } from "@/actions/delete-patient";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usersTable } from "@/db/schema";

// import UpsertPatientForm from "./upsert-patient-form";

interface UsersTableActionsProps {
  user: typeof usersTable.$inferSelect;
}

export const UsersTableActions = ({ user }: UsersTableActionsProps) => {
  const [upsertDialogIsOpen, setUpsertDialogIsOpen] = useState(false);

  //   const deleteUserAction = useAction(deleteUser, {
  //     onSuccess: () => {
  //       toast.success("Paciente deletado com sucesso.");
  //     },
  //     onError: () => {
  //       toast.error("Erro ao deletar paciente.");
  //     },
  //   });

  //   const handleDeleteUserClick = () => {
  //     if (!user) return;
  //     deleteUserAction.execute({ id: user.id });
  //   };

  return (
    <>
      <Dialog open={upsertDialogIsOpen} onOpenChange={setUpsertDialogIsOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon">
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setUpsertDialogIsOpen(true)}>
              <EditIcon />
              Editar
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <TrashIcon />
                  Excluir
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem certeza que deseja deletar esse paciente?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação não pode ser revertida. Isso irá deletar o
                    paciente e todas as consultas agendadas.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                {/* <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeletePatientClick}>
                    Deletar
                  </AlertDialogAction>
                </AlertDialogFooter> */}
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </Dialog>
    </>
  );
};
