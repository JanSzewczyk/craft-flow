import { fn } from "storybook/test";
import { type ActionResponse } from "~/lib/action-types";

export const updateStepCompletionAction = fn(
  async (): ActionResponse<void> => ({ success: true, data: undefined })
).mockName("updateStepCompletionAction");
