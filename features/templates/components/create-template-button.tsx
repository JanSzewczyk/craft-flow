import { LockIcon, PlusIcon } from "lucide-react";

import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@szum-tech/design-system";
import { type TemplateLimits } from "~/features/templates/server/services/templates-list.service";

type CreateTemplateButtonProps = {
  limits: TemplateLimits;
  onClick: () => void;
};

export function CreateTemplateButton({ limits, onClick }: CreateTemplateButtonProps) {
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
    <Button startIcon={<PlusIcon />} onClick={onClick}>
      Utwórz nowy szablon
    </Button>
  );
}
