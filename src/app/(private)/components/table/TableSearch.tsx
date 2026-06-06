"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";

interface TableSearchProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  setPage: (page: number) => void;
}

export function TableSearch({
  searchQuery,
  setSearchQuery,
  setPage,
}: TableSearchProps) {
  return (
    <InputGroup className="w-full sm:w-[250px]">
      <InputGroupInput
        placeholder="Buscar por título ou slug..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setPage(1);
        }}
      />
      <InputGroupAddon>
        <SearchIcon className="h-4 w-4 text-muted-foreground" />
      </InputGroupAddon>
    </InputGroup>
  );
}
