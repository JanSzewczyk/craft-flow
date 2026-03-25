"use server";

import { redirect } from "next/navigation";
import { type RedirectAction } from "~/lib/action-types";

export async function finalizeOnboardingAction(): RedirectAction {
  redirect("/onboarding/success");
}
