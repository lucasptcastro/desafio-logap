import { EditIcon, Loader2, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { deleteMenuCategory } from "@/actions/delete-menu-category";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
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
import { menuCategory as menuCategoriesTable } from "@/db/schema";

import { UpsertMenuCategoryForm } from "./upsert-category-form";

interface MenuCategoriesTableActionsProps {
  menuCategory: typeof menuCategoriesTable.$inferSelect;
}

export const MenuCategoriesTableActions = ({
  menuCategory,
}: MenuCategoriesTableActionsProps) => {
  const [upsertDialogIsOpen, setUpsertDialogIsOpen] = useState(false);

  const deleteMenuCategoryAction = useAction(deleteMenuCategory, {
    onSuccess: () => {
      toast.success("Categoria deletada com sucesso.");
    },
    onError: () => {
      toast.error("Erro ao deletar a categoria.");
    },
  });

  const handleDeleteMenuCategoryClick = () => {
    if (!menuCategory) return;
    deleteMenuCategoryAction.execute({ id: menuCategory.id });
  };

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
            <DropdownMenuLabel>{menuCategory.name}</DropdownMenuLabel>
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
                    Tem certeza que deseja deletar essa categoria?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação não pode ser revertida. Isso irá deletar a
                    categoria permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteMenuCategoryClick}
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    {deleteMenuCategoryAction.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Excluir"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>

        <UpsertMenuCategoryForm
          onSuccess={() => setUpsertDialogIsOpen(false)}
          isOpen={upsertDialogIsOpen}
          menuCategory={menuCategory}
        />
      </Dialog>
    </>
  );
};
