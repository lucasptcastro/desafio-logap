"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { menuCategory } from "@/db/schema";

import { UpsertProductForm } from "./upsert-product-form";

interface AddProductButtonProps {
  menuCategories: (typeof menuCategory.$inferSelect)[];
}

const AddProductButton = ({ menuCategories }: AddProductButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Adicionar produto
        </Button>
      </DialogTrigger>
      <UpsertProductForm
        onSuccess={() => setIsOpen(false)}
        isOpen={isOpen}
        menuCategories={menuCategories}
      />
    </Dialog>
  );
};

export default AddProductButton;
