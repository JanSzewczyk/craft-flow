export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  type: ToastType;
  message: string;
  duration?: number;
}
