import React from "react";

export function usePagination<T>(data: T[], itemsPerPageDefault = 15) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(itemsPerPageDefault);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedData = React.useMemo(() => {
    return data.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [data, currentPage, itemsPerPage]);

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return {
    paginatedData,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    setItemsPerPage,
    setPage,
    setCurrentPage,
  };
}
