"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { DeleteConfirmDialog } from "@/app/(private)/components/ui/DeleteConfigmDialog";
import { deleteVideoAction } from "@/lib/actions/videos.actions";
import { toast } from "sonner";

export function DeleteVideoButton({ id, title }: { id: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    const result = await deleteVideoAction(id);
    setLoading(false);
    setOpen(false);
    if (result.success) {
      toast.success("Vídeo excluído.");
      router.refresh();
    } else {
      toast.error("Erro ao excluir.", { description: result.message });
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
      <DeleteConfirmDialog
        open={open}
        itemName={title}
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
