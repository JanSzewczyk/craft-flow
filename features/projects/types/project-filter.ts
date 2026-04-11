import { ProjectStatus } from "~/features/projects/server/db/schema";

export const ProjectStatusFilter = {
  ALL: "ALL",
  [ProjectStatus.DRAFT]: ProjectStatus.DRAFT,
  [ProjectStatus.ACTIVE]: ProjectStatus.ACTIVE,
  [ProjectStatus.COMPLETED]: ProjectStatus.COMPLETED,
  [ProjectStatus.ARCHIVED]: ProjectStatus.ARCHIVED
} as const;
export type ProjectStatusFilter = (typeof ProjectStatusFilter)[keyof typeof ProjectStatusFilter];

/** All tab filter values including ALL */
export const ProjectStatusFiltersSet = new Set(Object.values(ProjectStatusFilter));

/** Type-safe check if a string is a valid filterable ProjectStatus */
export function isFilterableStatus(value: string): value is ProjectStatusFilter {
  return ProjectStatusFiltersSet.has(value);
}
