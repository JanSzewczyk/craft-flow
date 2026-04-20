import { fn } from "storybook/test";
import { type ClientListResult } from "~/features/crm/server/db/queries";
import { clientListItemBuilder } from "~/features/crm/test/builders";
import { type SupabaseServiceResult } from "~/lib/supabase/errors";

const defaultResult: ClientListResult = {
  items: [
    clientListItemBuilder.one({ traits: "registered", overrides: { name: "Anna Kowalska" } }),
    clientListItemBuilder.one({ traits: "noPhone", overrides: { name: "Jan Nowak" } }),
    clientListItemBuilder.one({ traits: "withProjects", overrides: { name: "Maria Wiśniewska" } }),
    clientListItemBuilder.one({ overrides: { name: "Piotr Zieliński" } }),
    clientListItemBuilder.one({ traits: "registered", overrides: { name: "Katarzyna Wójcik" } })
  ],
  pagination: {
    totalCount: 25,
    totalPages: 3,
    currentPage: 1,
    perPage: 10,
    hasNextPage: true,
    hasPrevPage: false
  }
};

export const getClientList = fn(
  async (): Promise<SupabaseServiceResult<ClientListResult>> => [null, defaultResult]
).mockName("getClientList");
