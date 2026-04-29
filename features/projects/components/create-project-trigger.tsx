"use client";

import * as React from "react";

import { PlusIcon } from "lucide-react";

import { Button } from "@szum-tech/design-system";
import { type Client } from "~/features/crm/server/db/schema";
import { type Template } from "~/features/templates/server/db/schema";
import { type ActionResponse } from "~/lib/action-types";

import { type CreateProjectFormData } from "../schemas/project-schema";
import { type Project } from "../server/db/schema";

import { CreateProjectSheet } from "./create-project-sheet";

type CreateProjectTriggerProps = {
  clients: Client[];
  templates: Template[];
  onCreateAction: (data: CreateProjectFormData) => ActionResponse<Project>;
};

export function CreateProjectTrigger({ clients, templates, onCreateAction }: CreateProjectTriggerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button startIcon={<PlusIcon />} onClick={() => setIsOpen(true)}>
        Nowy projekt
      </Button>
      <CreateProjectSheet
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        clients={clients}
        templates={templates}
        onCreateAction={onCreateAction}
      />
    </>
  );
}
