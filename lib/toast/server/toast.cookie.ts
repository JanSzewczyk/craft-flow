import "server-only";

import { cookies } from "next/headers";
import { TOAST_COOKIE_MAX_AGE, TOAST_COOKIE_NAME } from "~/lib/toast/constants";
import { type ToastMessage, type ToastType } from "~/lib/toast/types";

export async function setToastCookie(message: string, type: ToastType = "success", duration?: number): Promise<void> {
  const cookieStore = await cookies();

  const payload: ToastMessage = { type, message, ...(duration !== undefined && { duration }) };

  cookieStore.set(TOAST_COOKIE_NAME, JSON.stringify(payload), {
    maxAge: TOAST_COOKIE_MAX_AGE,
    httpOnly: false, // must be readable by client JS
    path: "/",
    sameSite: "lax"
  });
}
