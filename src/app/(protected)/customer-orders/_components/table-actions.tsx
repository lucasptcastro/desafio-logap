import { EditIcon, MoreVerticalIcon } from "lucide-react";
import { useState } from "react";

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
import { order } from "@/db/schema";

import { UpdateOrderForm } from "./update-order-form";

interface CustomerOrdersTableActionsProps {
  order: typeof order.$inferSelect;
}

export const CustomerOrdersTableActions = ({
  order,
}: CustomerOrdersTableActionsProps) => {
  const [upsertDialogIsOpen, setUpsertDialogIsOpen] = useState(false);

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
            <DropdownMenuLabel>Nº Pedido - {order.id}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setUpsertDialogIsOpen(true)}>
              <EditIcon />
              Editar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <UpdateOrderForm
          onSuccess={() => setUpsertDialogIsOpen(false)}
          isOpen={upsertDialogIsOpen}
          order={order}
        />
      </Dialog>
    </>
  );
};
