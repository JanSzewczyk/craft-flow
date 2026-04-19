import { fn } from "storybook/test";
import { type ActionResponse } from "~/lib/action-types";

export const deleteClientAction = fn(
  async (): ActionResponse<{ id: string }> => ({
    success: true,
    data: { id: "mock-id" },
    message: "Klient został usunięty"
  })
).mockName("deleteClientAction");
