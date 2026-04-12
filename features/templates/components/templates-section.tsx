"use client";

import * as React from "react";

import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Progress,
  toast
} from "@szum-tech/design-system";
import Link from "next/link";
import { CreateTemplateButton } from "~/features/templates/components/create-template-button";
import { CreateTemplateCard } from "~/features/templates/components/create-template-card";
import { CreateTemplateSheet } from "~/features/templates/components/create-template-sheet";
import { EditTemplateSheet } from "~/features/templates/components/edit-template-sheet";
import { TemplateCard } from "~/features/templates/components/template-card";
import { TemplatesEmptyState } from "~/features/templates/components/templates-empty-state";
import { TemplatesPagination } from "~/features/templates/components/templates-pagination";
import { TemplatesSearch } from "~/features/templates/components/templates-search";
import { deleteTemplateAction } from "~/features/templates/server/actions/delete-template.action";
import { duplicateTemplateAction } from "~/features/templates/server/actions/duplicate-template.action";
import { type PaginationMeta, type TemplateListItem } from "~/features/templates/server/db/queries";
import { type TemplateLimits } from "~/features/templates/server/services/templates-list.service";

type TemplatesSectionProps = {
  items: TemplateListItem[];
  limits: TemplateLimits;
  pagination: PaginationMeta;
  defaultSearch: string;
};

export function TemplatesSection({ items, limits, pagination, defaultSearch }: TemplatesSectionProps) {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editItem, setEditItem] = React.useState<TemplateListItem | null>(null);
  const [, startTransition] = React.useTransition();

  const isAtLimit = limits.used >= limits.max;

  function handleCreate() {
    setCreateOpen(true);
  }

  function handleEdit(item: TemplateListItem) {
    setEditItem(item);
  }

  function handleDuplicate(id: string) {
    startTransition(async () => {
      const result = await duplicateTemplateAction(id);
      if (result.success) {
        toast.success("Sukces", { description: result.message ?? "Szablon został zduplikowany" });
      } else {
        toast.error("Błąd", { description: result.error });
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteTemplateAction(id);
      if (result.success) {
        toast.success("Sukces", { description: result.message ?? "Szablon został usunięty" });
      } else {
        toast.error("Błąd", { description: result.error });
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/app/dashboard">Craft Flow</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Moje Szablony</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-heading-h1">Moje Szablony</h1>
          <p className="text-lead text-muted-foreground">
            Zarządzaj powtarzalnymi procesami swoich projektów rzemieślniczych
          </p>
        </div>

        <div className="flex shrink-0 sm:gap-3">
          <div className="space-y-2">
            <Badge variant="outline" className="hidden sm:flex">
              <span className="text-muted-foreground font-bold uppercase">Wykorzystanie:</span>{" "}
              <span className="text-primary">
                {limits.used} z {limits.max} szablonów
              </span>
            </Badge>
            <Progress value={(limits.used / limits.max) * 100} />
          </div>

          <CreateTemplateButton onClick={handleCreate} limits={limits} />
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <TemplatesSearch defaultValue={defaultSearch} />
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <TemplatesEmptyState onCreateClick={handleCreate} />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <TemplateCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                isLastTemplate={items.length === 1}
              />
            ))}

            {!isAtLimit ? <CreateTemplateCard onClick={handleCreate} /> : null}
          </div>

          <TemplatesPagination pagination={pagination} />
        </div>
      )}

      <CreateTemplateSheet open={createOpen} onOpenChange={setCreateOpen} />
      <EditTemplateSheet
        item={editItem}
        open={editItem !== null}
        onOpenChange={(open) => {
          if (!open) setEditItem(null);
        }}
      />
    </div>
  );
}
