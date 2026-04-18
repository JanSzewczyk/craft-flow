"use client";

import * as React from "react";

import { EyeIcon, MoreHorizontalIcon, Trash2Icon, TriangleAlertIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  toast
} from "@szum-tech/design-system";
import Link from "next/link";
import { type ClientListItem } from "~/features/crm/server/db/queries";
import { type ActionResponse } from "~/lib/action-types";

type ClientRowActionsProps = {
  client: ClientListItem;
  onDeleteAction(id: string): ActionResponse<{ id: string }>;
};

export function ClientRowActions({ client, onDeleteAction }: ClientRowActionsProps) {
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [warningOpen, setWarningOpen] = React.useState(false);
  const [, startTransition] = React.useTransition();

  function handleDeleteClick() {
    if (client.hasProjects) {
      setWarningOpen(true);
    } else {
      setDeleteOpen(true);
    }
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await onDeleteAction(client.id);
      if (result.success) {
        toast.success("Sukces", { description: result.message ?? "Klient został usunięty" });
      } else {
        toast.error("Błąd", { description: result.error });
      }
    });
  }

  return (
    <React.Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-7" aria-label="Więcej opcji">
            <MoreHorizontalIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/app/clients/${client.id}`}>
              <EyeIcon aria-hidden="true" />
              Zobacz szczegóły
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="error" onClick={handleDeleteClick}>
            <Trash2Icon aria-hidden="true" />
            Usuń
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation dialog — client without projects */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usuń klienta</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć klienta <strong>&quot;{client.name}&quot;</strong>? Tej operacji nie można
              cofnąć.
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

      {/* Warning dialog — client has projects */}
      <AlertDialog open={warningOpen} onOpenChange={setWarningOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-error/10 text-error dark:bg-error/20 dark:text-error">
              <TriangleAlertIcon />
            </AlertDialogMedia>
            <AlertDialogTitle>Nie można usunąć klienta</AlertDialogTitle>
            <AlertDialogDescription>
              Ten klient ma przypisane aktywne lub archiwalne projekty. Aby go usunąć, musisz najpierw skasować
              wszystkie powiązane z nim zlecenia.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setWarningOpen(false)}>Rozumiem</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
}
