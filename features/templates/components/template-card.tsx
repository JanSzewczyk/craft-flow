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
  CardFooter,
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
  ItemTitle
} from "@szum-tech/design-system";
import { type TemplateListItem } from "~/features/templates/server/db/queries";
import { formatRelativeTime } from "~/utils/date";

type TemplateCardProps = {
  item: TemplateListItem;
  onEdit: (item: TemplateListItem) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  isLastTemplate: boolean;
};

export function TemplateCard({ item, onEdit, onDuplicate, onDelete, isLastTemplate }: TemplateCardProps) {
  const [deleteOpen, setDeleteOpen] = React.useState(false);

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
                <DropdownMenuItem onClick={() => onDuplicate(item.id)}>
                  <CopyIcon className="size-4" aria-hidden="true" />
                  Duplikuj
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="error" onClick={() => setDeleteOpen(true)}>
                  <Trash2Icon className="size-4" aria-hidden="true" />
                  Usuń
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>

        <CardContent>
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

        <CardFooter>
          <Button variant="outline" size="sm" fullWidth startIcon={<PencilIcon />} onClick={() => onEdit(item)}>
            Edytuj
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usuń szablon</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć szablon <strong>&quot;{item.name}&quot;</strong>? Tej operacji nie można
              cofnąć.
              {isLastTemplate ? (
                <span className="mt-2 block font-medium text-amber-600 dark:text-amber-400">
                  To Twój ostatni szablon. Tworzenie nowych projektów będzie wymagało ręcznego wpisywania etapów.
                </span>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(item.id);
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
