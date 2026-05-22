import { type PaginationMeta } from "~/types/pagination";

export type Client = {
  id: string;
  contractorId: string;
  name: string;
  email: string;
  phone: string | null;
  clerkUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ClientListItem = {
  id: string;
  contractorId: string;
  name: string;
  email: string;
  phone: string | null;
  clerkUserId: string | null;
  hasProjects: boolean;
  createdAt: Date;
};

export type ClientListOptions = {
  search?: string;
  page: number;
  perPage: number;
};

export type ClientListResult = {
  items: Array<ClientListItem>;
  pagination: PaginationMeta;
};
