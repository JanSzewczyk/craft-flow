import { build } from "mimicry-js";

import { type ContractorListResult } from "~/features/projects/types/contractor";
import { paginationMetaBuilder } from "../../../../tests/builders/pagination.builder";

import { clientContractorListItemBuilder } from "./client-contractor-list-item.builder";

/**
 * Builder for ContractorListResult test data.
 *
 * @example
 * const result = contractorListResultBuilder.one();
 *
 * @example
 * const empty = contractorListResultBuilder.one({ traits: "empty" });
 *
 * @example
 * const many = contractorListResultBuilder.one({ traits: "manyItems" });
 */
export const contractorListResultBuilder = build<ContractorListResult>({
  fields: {
    items: () => clientContractorListItemBuilder.many(3),
    pagination: () => paginationMetaBuilder.one()
  },
  traits: {
    empty: {
      overrides: {
        items: () => [],
        pagination: () => paginationMetaBuilder.one({ traits: "singlePage" })
      }
    },
    singlePage: {
      overrides: {
        pagination: () => paginationMetaBuilder.one({ traits: "singlePage" })
      }
    },
    manyItems: {
      overrides: {
        items: () => clientContractorListItemBuilder.many(10)
      }
    }
  }
});
