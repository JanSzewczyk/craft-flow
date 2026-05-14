export const ProjectStatus = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  ARCHIVED: "ARCHIVED",
  DELETED: "DELETED"
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export const ProjectStatuses = Object.values(ProjectStatus) as Array<ProjectStatus>;

export type ClientProjectStep = {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  completedAt: Date | null;
  orderIndex: number;
};

export type ClientProjectListItem = {
  id: string;
  name: string;
  status: ProjectStatus;
  contractorCompanyName: string;
  totalSteps: number;
  completedSteps: number;
  startedAt: Date | null;
  completedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
};

export type ClientProjectDetail = ClientProjectListItem & {
  description: string | null;
  contractorEmail: string;
  contractorPhone: string | null;
  contractorLogoUrl: string | null;
  steps: Array<ClientProjectStep>;
};

export type PublicProjectView = {
  id: string;
  client: {
    id: string;
    name: string;
    email: string;
  };
  name: string;
  status: Extract<ProjectStatus, "ACTIVE" | "COMPLETED">;
  clientName: string;
  steps: Array<{
    id: string;
    title: string;
    description: string | null;
    isCompleted: boolean;
    completedAt: Date | null;
    createdAt: Date;
    orderIndex: number;
  }>;
  contractor: {
    companyName: string;
    brandColor: string | null;
    logoUrl: string | null;
  };
};
