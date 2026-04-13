import { LockIcon, PlusIcon } from "lucide-react";

import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@szum-tech/design-system";
import Link from "next/link";
import { type TemplateLimits } from "~/features/templates/server/services/templates-list.service";

type CreateTemplateButtonProps = {
  limits: TemplateLimits;
};

export function CreateTemplateButton({ limits }: CreateTemplateButtonProps) {
  const isAtLimit = limits.used >= limits.max;

  if (isAtLimit) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0}>
            <Button disabled startIcon={<LockIcon />}>
              Utwórz nowy szablon
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>Osiągnięto limit szablonów. Zwiększ plan.</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Button asChild startIcon={<PlusIcon />}>
      <Link href="/app/templates/create">Utwórz nowy szablon</Link>
    </Button>
  );
}
