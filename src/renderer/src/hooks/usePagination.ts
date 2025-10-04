import { useState, useEffect, useMemo } from "react";

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage?: number;
  resetDependencies?: unknown[];
}

export function usePagination<T>({ items, itemsPerPage = 20, resetDependencies = [] }: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = useMemo(() => items.slice(startIndex, startIndex + itemsPerPage), [items, startIndex, itemsPerPage]);

  // Reset to page 1 when dependencies change
  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetDependencies);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(totalPages, page)));

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    totalItems: items.length
  };
}
