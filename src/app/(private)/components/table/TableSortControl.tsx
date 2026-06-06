"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableSortControlProps {
  sortOption: "az" | "za" | "recent" | "oldest";
  setSortOption: (value: "az" | "za" | "recent" | "oldest") => void;
  setPage: (page: number) => void;
}

export function TableSortControl({
  sortOption,
  setSortOption,
  setPage,
}: TableSortControlProps) {
  return (
    <Select
      value={sortOption}
      onValueChange={(value: "az" | "za" | "recent" | "oldest") => {
        setSortOption(value);
        setPage(1);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Ordenar por..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="recent">Mais recentes</SelectItem>
        <SelectItem value="oldest">Mais antigos</SelectItem>
        <SelectItem value="az">A - Z</SelectItem>
        <SelectItem value="za">Z - A</SelectItem>
      </SelectContent>
    </Select>
  );
}
