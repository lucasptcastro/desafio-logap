"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { rolesTable } from "@/db/schema";

import { CreateUserForm } from "./create-user-form";

interface AddUserButtonProps {
  roles: (typeof rolesTable.$inferSelect)[];
}

const AddUserButton = ({ roles }: AddUserButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Adicionar usuário
        </Button>
      </DialogTrigger>
      <CreateUserForm
        onSuccess={() => setIsOpen(false)}
        isOpen={isOpen}
        roles={roles}
      />
    </Dialog>
  );
};

export default AddUserButton;
