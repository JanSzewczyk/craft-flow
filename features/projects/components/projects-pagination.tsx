"use client";

import { useCallback } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button, Select, SelectContent, SelectItem } from "@szum-tech/design-system";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type PaginationMeta } from "~/types/pagination";

const PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

type ProjectsPaginationProps = {
  pagination: PaginationMeta;
};

export function ProjectsPagination({ pagination }: ProjectsPaginationProps) {
  const { currentPage: page, perPage, totalPages, hasNextPage, hasPrevPage } = pagination;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [router, pathname, searchParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateParams({ page: newPage <= 1 ? undefined : String(newPage) });
    },
    [updateParams]
  );

  const handlePerPageChange = useCallback(
    (value: string) => {
      updateParams({ perPage: value === "10" ? undefined : value, page: undefined });
    },
    [updateParams]
  );

  return (
    <div className="flex items-center justify-between">
      <div className="text-mute flex items-center gap-2">
        <span>Wierszy na stronę:</span>
        <Select value={String(perPage)} onValueChange={handlePerPageChange}>
          <SelectContent>
            {PER_PAGE_OPTIONS.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-mute">
          Strona {page} z {totalPages}
        </span>
        <Button variant="outline" size="icon" disabled={!hasPrevPage} onClick={() => handlePageChange(page - 1)}>
          <ChevronLeftIcon className="size-4" aria-hidden="true" />
          <span className="sr-only">Poprzednia strona</span>
        </Button>
        <Button variant="outline" size="icon" disabled={!hasNextPage} onClick={() => handlePageChange(page + 1)}>
          <ChevronRightIcon className="size-4" aria-hidden="true" />
          <span className="sr-only">Następna strona</span>
        </Button>
      </div>
    </div>
  );
}
