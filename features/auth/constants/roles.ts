export const Role = {
  CONTRACTOR: "CONTRACTOR",
  CLIENT: "CLIENT"
} as const;

export type Role = (typeof Role)[keyof typeof Role];
