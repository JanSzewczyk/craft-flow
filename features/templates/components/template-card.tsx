"use client";

import * as React from "react";

import { CopyIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Item,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  toast
} from "@szum-tech/design-system";
import Link from "next/link";
import { type TemplateListItem } from "~/features/templates/server/db/queries";
import { type ActionResponse } from "~/lib/action-types";
import { formatRelativeTime } from "~/utils/date";

type TemplateCardProps = {
  item: TemplateListItem;
  isLastTemplate: boolean;
  onDeleteAction(id: string): ActionResponse;
  onDuplicateAction(id: string): ActionResponse;
};

export function TemplateCard({ item, isLastTemplate, onDeleteAction, onDuplicateAction }: TemplateCardProps) {
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [, startTransition] = React.useTransition();

  function handleDuplicate() {
    startTransition(async () => {
      const result = await onDuplicateAction(item.id);
      if (result.success) {
        toast.success("Sukces", { description: result.message ?? "Szablon został zduplikowany" });
      } else {
        toast.error("Błąd", { description: result.error });
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await onDeleteAction(item.id);
      if (result.success) {
        toast.success("Sukces", { description: result.message ?? "Szablon został usunięty" });
      } else {
        toast.error("Błąd", { description: result.error });
      }
    });
  }

  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2">
            {item.name}
            <Badge>
              {item.stepsCount} {item.stepsCount === 1 ? "etap" : item.stepsCount < 5 ? "etapy" : "etapów"}
            </Badge>
          </CardTitle>
          <CardDescription>Ostatnia edycja: {formatRelativeTime(item.updatedAt)}</CardDescription>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-7" aria-label="Więcej opcji">
                  <MoreHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/app/templates/${item.id}/edit`}>
                    <PencilIcon />
                    Edytuj
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <CopyIcon aria-hidden="true" />
                  Duplikuj
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="error" onClick={() => setDeleteOpen(true)}>
                  <Trash2Icon aria-hidden="true" />
                  Usuń
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>

        <CardContent>
          {item.description ? <p className="text-body-sm pb-4">{item.description}</p> : null}
          {item.previewSteps.length > 0 ? (
            <ItemGroup>
              {item.previewSteps.map((step, index) => (
                <Item className="px-0 py-1" key={index}>
                  <ItemMedia variant="icon" className="font-code size-6">
                    0{index + 1}
                  </ItemMedia>
                  <ItemTitle>{step}</ItemTitle>
                </Item>
              ))}
              {item.stepsCount > item.previewSteps.length ? (
                <li className="text-mute list-none pt-3 text-center">
                  +{item.stepsCount - item.previewSteps.length} więcej kroków
                </li>
              ) : null}
            </ItemGroup>
          ) : null}
        </CardContent>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usuń szablon</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć szablon <strong>&quot;{item.name}&quot;</strong>? Tej operacji nie można
              cofnąć.
              {isLastTemplate ? (
                <>
                  <br />
                  <span className="text-warning text-body-xs pt-4">
                    To Twój ostatni szablon. Tworzenie nowych projektów będzie wymagało ręcznego wpisywania etapów.
                  </span>
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDelete();
                setDeleteOpen(false);
              }}
            >
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
}
