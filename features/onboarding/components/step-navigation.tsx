"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { Button } from "@szum-tech/design-system";
import Link from "next/link";

type StepNavigationProps = {
  backHref?: string;
  isSubmitting: boolean;
  isLastStep?: boolean;
};

export function StepNavigation({ backHref, isSubmitting, isLastStep }: StepNavigationProps) {
  return (
    <div className="flex justify-between gap-4 pt-6">
      {backHref ? (
        <Button variant="outline" asChild>
          <Link href={backHref}>
            <ArrowLeftIcon className="size-4" />
            Wróć
          </Link>
        </Button>
      ) : (
        <div />
      )}
      <Button type="submit" loading={isSubmitting}>
        {isLastStep ? "Zakończ" : "Dalej"}
        {!isLastStep && <ArrowRightIcon className="size-4" />}
      </Button>
    </div>
  );
}
