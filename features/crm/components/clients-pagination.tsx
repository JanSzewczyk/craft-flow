"use client";

import { useCallback } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@szum-tech/design-system";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type PaginationMeta } from "~/types/pagination";

type ClientsPaginationProps = {
  pagination: PaginationMeta;
};

export function ClientsPagination({ pagination }: ClientsPaginationProps) {
  const { currentPage: page, totalPages, hasNextPage, hasPrevPage } = pagination;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newPage <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(newPage));
      }
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [router, pathname, searchParams]
  );

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-2">
      <span className="text-mute">
        Strona {page} z {totalPages}
      </span>
      <Button variant="outline" size="icon" disabled={!hasPrevPage} onClick={() => handlePageChange(page - 1)}>
        <ChevronLeftIcon aria-hidden="true" />
        <span className="sr-only">Poprzednia strona</span>
      </Button>
      <Button variant="outline" size="icon" disabled={!hasNextPage} onClick={() => handlePageChange(page + 1)}>
        <ChevronRightIcon aria-hidden="true" />
        <span className="sr-only">Następna strona</span>
      </Button>
    </div>
  );
}
