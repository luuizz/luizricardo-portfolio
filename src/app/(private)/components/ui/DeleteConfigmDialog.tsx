"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  itemName?: string;
}

export function DeleteConfirmDialog({
  open,
  onConfirm,
  onCancel,
  itemName = "este item",
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader className={"text-center"}>
          <DialogTitle className={"text-center font-inter text-2xl/short"}>
            Confirmar exclusão
          </DialogTitle>
        </DialogHeader>

        <p className="text-balance text-center text-sm text-muted-foreground">
          Tem certeza que deseja excluir <strong>{itemName}</strong>? Essa ação{" "}
          <strong>não poderá ser desfeita</strong>.
        </p>

        <DialogFooter className="mt-4 !justify-center">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Excluir definitivamente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
