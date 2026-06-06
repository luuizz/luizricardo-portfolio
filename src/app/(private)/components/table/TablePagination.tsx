"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TablePaginationProps {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  setPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
}

export function TablePagination({
  totalItems,
  totalPages,
  currentPage,
  setPage,
  itemsPerPage,
  setItemsPerPage,
}: TablePaginationProps) {
  return (
    <div className="mt-4 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
      {/* Total de itens */}
      <p className="text-sm text-muted-foreground">
        Total: <strong>{totalItems}</strong> itens
      </p>

      {/* Botões de paginação */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => setPage(currentPage - 1)}
              className={cn(
                currentPage === 1 && "pointer-events-none opacity-40",
              )}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                isActive={currentPage === index + 1}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => setPage(currentPage + 1)}
              className={cn(
                currentPage === totalPages && "pointer-events-none opacity-40",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Select de quantidade */}
      <Select
        value={String(itemsPerPage)}
        onValueChange={(value) => {
          setItemsPerPage(Number(value));
          setPage(1);
        }}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Itens por página" />
        </SelectTrigger>
        <SelectContent>
          {[5, 10, 15, 25, 50, 75, 100, 200].map((num) => (
            <SelectItem key={num} value={String(num)}>
              Mostrar {num}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
