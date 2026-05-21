import { build } from "mimicry-js";

import { type PaginationMeta } from "~/types/pagination";

/**
 * Builder for PaginationMeta test data.
 *
 * @example
 * const pagination = paginationMetaBuilder.one();
 *
 * @example
 * const pagination = paginationMetaBuilder.one({ traits: "firstPage" });
 *
 * @example
 * const pagination = paginationMetaBuilder.one({ traits: "singlePage" });
 */
export const paginationMetaBuilder = build<PaginationMeta>({
  fields: {
    totalCount: 50,
    totalPages: 5,
    currentPage: 2,
    perPage: 10,
    hasNextPage: true,
    hasPrevPage: true
  },
  traits: {
    firstPage: {
      overrides: {
        currentPage: 1,
        hasPrevPage: false,
        hasNextPage: true
      }
    },
    middlePage: {
      overrides: {
        currentPage: 3,
        hasPrevPage: true,
        hasNextPage: true
      }
    },
    lastPage: {
      overrides: {
        currentPage: 5,
        hasPrevPage: true,
        hasNextPage: false
      }
    },
    singlePage: {
      overrides: {
        totalCount: 5,
        totalPages: 1,
        currentPage: 1,
        perPage: 10,
        hasNextPage: false,
        hasPrevPage: false
      }
    }
  }
});
