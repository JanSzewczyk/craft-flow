export const Role = {
  CONTRACTOR: "CONTRACTOR"
} as const;

export type Role = (typeof Role)[keyof typeof Role];
