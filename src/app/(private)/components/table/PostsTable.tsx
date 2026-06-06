"use client";

import React, { useState, useTransition } from "react";
import DataTableShell from "./DataTableShell";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/app/shared/utils/format-date";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PostsWithCategory } from "@/types/dashboard";
import { ROUTES } from "@/lib/routes";
import { DeleteConfirmDialog } from "@/app/(private)/components/ui/DeleteConfigmDialog";
import { deletePostAction } from "@/lib/actions/posts.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PostsTableProps {
  data: PostsWithCategory[];
}

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  published: { label: "Publicado", variant: "default" },
  draft: { label: "Rascunho", variant: "secondary" },
  scheduled: { label: "Agendado", variant: "outline" },
};

export function PostsTable({ data }: PostsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState<string>("");
  const [, startTransition] = useTransition();
  const router = useRouter();

  function handleDeleteConfirm() {
    if (!deleteId) return;
    startTransition(async () => {
      const result = await deletePostAction(deleteId);
      if (result.success) {
        toast.success("Post excluído com sucesso.");
        router.refresh();
      } else {
        toast.error("Erro ao excluir post.", { description: result.message });
      }
      setDeleteId(null);
    });
  }

  return (
    <>
      <DataTableShell
        title="Todos os Posts"
        newButtonLink={ROUTES.blog.novo}
        data={data}
        renderHeader={() => (
          <TableRow>
            <TableHead className="min-w-[160px]">Título</TableHead>
            <TableHead className="hidden sm:table-cell">Slug</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Categoria</TableHead>
            <TableHead className="hidden lg:table-cell">Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        )}
        renderRow={(post) => {
          const status = STATUS_MAP[post.status] ?? { label: post.status, variant: "outline" as const };
          return (
            <TableRow key={post.id}>
              <TableCell className="min-w-[160px] max-w-[220px] truncate font-medium" title={post.title}>
                {post.title}
              </TableCell>
              <TableCell className="hidden max-w-[150px] truncate sm:table-cell">{post.slug}</TableCell>
              <TableCell>
                <Badge variant={status.variant}>{status.label}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {post.categories ? (
                  <Badge variant="outline">{post.categories.name}</Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="hidden lg:table-cell">{formatDate(post.created_at)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`${ROUTES.blog.root}/${post.slug}/editar`}>
                        Editar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => { setDeleteId(post.id); setDeleteTitle(post.title); }}
                    >
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        }}
      />

      <DeleteConfirmDialog
        open={!!deleteId}
        itemName={deleteTitle}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
