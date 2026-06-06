"use client";

import React from "react";
import useTableFilter from "@/hooks/useTableFilter"; // O hook arrumado acima
import { usePagination } from "@/hooks/usePagination"; // Seu hook de paginação
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableHeaderActions from "./TableHeaderActions";
import { TableSearch } from "./TableSearch";
import { TableSortControl } from "./TableSortControl";
import { TablePagination } from "./TablePagination";

// Interface Genérica
interface DataTableShellProps<T> {
  title: string;
  newButtonLink: string;
  data: T[];
  renderHeader: () => React.ReactNode;
  renderRow: (item: T) => React.ReactNode;
}

// T deve ter pelo menos o que o hook precisa
export default function DataTableShell<
  T extends { id: string; created_at: string },
>({
  title,
  newButtonLink,
  data,
  renderHeader,
  renderRow,
}: DataTableShellProps<T>) {
  // Lógica centralizada
  const { sortedData, searchQuery, setSearchQuery, sortOption, setSortOption } =
    useTableFilter(data);

  const {
    paginatedData,
    currentPage,
    totalPages,
    setPage,
    itemsPerPage,
    totalItems,
    setItemsPerPage,
  } = usePagination(sortedData);

  return (
    <div className="mt-10 w-full space-y-6">
      <TableHeaderActions title={title} newButtonLink={newButtonLink} />

      <div className="flex items-center justify-start gap-6">
        <TableSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <TableSortControl
          sortOption={sortOption}
          setSortOption={setSortOption}
          setPage={setPage}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>{renderHeader()}</TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <React.Fragment key={item.id}>{renderRow(item)}</React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        setPage={setPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
}
