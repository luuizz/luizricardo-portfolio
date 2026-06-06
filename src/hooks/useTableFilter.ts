// @/hooks/useTableFilter.ts
import React from "react";

type SortOptions = "recent" | "oldest" | "az" | "za";

interface FilterableItem {
  id: string;
  created_at: string;
  title?: string;
  name?: string;
  slug?: string | null;
}

export default function useTableFilter<T extends FilterableItem>(data: T[]) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortOption, setSortOption] = React.useState<SortOptions>("recent");

  const filteredData = React.useMemo(() => {
    const search = searchQuery.toLowerCase();

    return data.filter((item) => {
      // Normaliza para buscar em title ou name
      const text = String(item.title || item.name || "").toLowerCase();
      const slug = String(item.slug || "").toLowerCase();
      return text.includes(search) || slug.includes(search);
    });
  }, [data, searchQuery]);

  const sortedData = React.useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const valA = String(a.title || a.name || "");
      const valB = String(b.title || b.name || "");

      if (sortOption === "az") return valA.localeCompare(valB);
      if (sortOption === "za") return valB.localeCompare(valA);

      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();

      return sortOption === "recent" ? dateB - dateA : dateA - dateB;
    });
  }, [filteredData, sortOption]);

  return {
    sortedData,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
  };
}
