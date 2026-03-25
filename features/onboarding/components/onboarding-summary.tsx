"use client";

import React, { useTransition } from "react";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BuildingIcon,
  ImageIcon,
  LayoutTemplateIcon,
  MailIcon,
  PaletteIcon,
  SparklesIcon
} from "lucide-react";

import {
  Avatar,
  AvatarImage,
  Badge,
  Button,
  ColorSwatch,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  toast
} from "@szum-tech/design-system";
import Link from "next/link";
import { type Plan, PlanId } from "~/features/billing/constants";
import { INDUSTRIES } from "~/features/onboarding/constants";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { type OnboardingState } from "~/features/onboarding/server/db";
import { type PlanFeatures } from "~/features/onboarding/server/services/step-service";
import { type RedirectAction } from "~/lib/action-types";

type OnboardingSummaryProps = {
  plan: Plan;
  onboardingState: OnboardingState;
  planFeatures: PlanFeatures;
  onFinalizeAction(): RedirectAction;
  onBackAction(): void;
};

export function OnboardingSummary({
  plan,
  onboardingState,
  planFeatures,
  onFinalizeAction,
  onBackAction
}: OnboardingSummaryProps) {
  const [isPending, startTransition] = useTransition();

  function handleFinalize() {
    startTransition(async () => {
      const result = await onFinalizeAction();

      if (!result.success) {
        toast.error("Błąd", { description: result.error });
      }
    });
  }

  const { companyDetails, branding, templateConfig, emailConfig } = onboardingState;

  return (
    <div className="flex flex-col gap-8">
      <ItemGroup className="flex flex-col gap-6">
        {/* Firma */}
        <Item>
          <ItemMedia>
            <BuildingIcon className="text-muted-foreground size-6" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-muted-foreground font-bold uppercase">Twój Plan & Firma</ItemTitle>
            <ItemDescription>
              <span className="text-foreground inline-flex items-center gap-x-3">
                <span>{companyDetails?.companyName}</span>
                <span className="bg-muted-foreground/30 size-1 rounded-full" />
                <span className="text-muted-foreground">
                  {INDUSTRIES.find((ind) => ind.value === companyDetails?.industry)?.label}
                </span>
                <span className="bg-muted-foreground/30 size-1 rounded-full" />
                <Badge
                  variant={plan.id === PlanId.BASIC ? "outline" : plan.id === PlanId.STANDARD ? "secondary" : "primary"}
                >
                  {plan.name}
                </Badge>
              </span>
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Link
              href={OnboardingStep.COMPANY_DETAILS}
              className="text-primary/60 hover:text-primary text-xs font-semibold transition-colors"
            >
              Edytuj
            </Link>
          </ItemActions>
        </Item>

        <ItemSeparator />

        {/* Branding — conditional */}
        {planFeatures.branding && (
          <>
            <Item>
              <ItemMedia>
                <PaletteIcon className="text-muted-foreground size-6" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-muted-foreground font-bold uppercase">Wygląd Portalu</ItemTitle>
                <ItemDescription>
                  <div className="mt-1 flex items-center gap-6">
                    {branding?.logoUrl && (
                      <span className="text-foreground flex items-center gap-2 text-base font-medium">
                        <Avatar className="size-10">
                          <AvatarImage src={branding?.logoUrl} />
                        </Avatar>
                        Logo przesłane
                      </span>
                    )}
                    {branding?.brandColor && (
                      <span className="flex items-center gap-3">
                        <ColorSwatch color={branding.brandColor} />
                        <span className="text-muted-foreground font-mono">{branding.brandColor}</span>
                      </span>
                    )}
                  </div>
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Link
                  href={OnboardingStep.BRANDING}
                  className="text-primary/60 hover:text-primary text-xs font-semibold transition-colors"
                >
                  Edytuj
                </Link>
              </ItemActions>
            </Item>
            <ItemSeparator />
          </>
        )}

        {/* Szablon */}
        <Item>
          <ItemMedia>
            <LayoutTemplateIcon className="text-muted-foreground size-6" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-muted-foreground font-bold uppercase">Proces Pracy</ItemTitle>
            <ItemDescription>
              <span className="text-foreground text-heading-h4">{templateConfig?.name}</span>
              <p>{templateConfig?.description}</p>
            </ItemDescription>

            <div className="mt-4 flex flex-wrap items-start gap-4">
              {templateConfig?.steps?.map((step, i) => (
                <React.Fragment key={step.title}>
                  <div>
                    <p className="text-foreground text-sm font-semibold">{step.title}</p>
                    {step.description && (
                      <p className="text-muted-foreground text-body-xs mt-0.5">{step.description}</p>
                    )}
                  </div>
                  {i < (templateConfig.steps?.length ?? 0) - 1 && (
                    <ArrowRightIcon className="text-muted-foreground/40 size-4 shrink-0" />
                  )}
                </React.Fragment>
              ))}
              {!templateConfig?.steps?.length && (
                <span className="text-muted-foreground/60 text-base font-medium">—</span>
              )}
            </div>
          </ItemContent>
          <ItemActions>
            <Link
              href={OnboardingStep.TEMPLATE}
              className="text-primary/60 hover:text-primary text-xs font-semibold transition-colors"
            >
              Edytuj
            </Link>
          </ItemActions>
        </Item>

        {planFeatures.whitelabelEmails ? (
          <React.Fragment>
            <ItemSeparator />

            {/* E-mail */}
            <Item>
              <ItemMedia>
                <MailIcon className="text-muted-foreground size-6" />
              </ItemMedia>
              <ItemContent>
                <ItemHeader>
                  <ItemTitle className="text-muted-foreground font-bold uppercase">Komunikacja</ItemTitle>
                </ItemHeader>
                <ItemDescription className="inline-flex items-center gap-x-3">
                  <span className="text-foreground">E-mail powitalny</span>
                  {emailConfig?.emailSubject && (
                    <>
                      <span className="bg-muted-foreground/30 size-1 rounded-full" />
                      <em className="text-muted-foreground text-sm font-normal not-italic">
                        &bdquo;{emailConfig.emailSubject}...&ldquo;
                      </em>
                    </>
                  )}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Link
                  href={OnboardingStep.EMAIL}
                  className="text-primary/60 hover:text-primary text-xs font-semibold transition-colors"
                >
                  Edytuj
                </Link>
              </ItemActions>
            </Item>
          </React.Fragment>
        ) : null}
      </ItemGroup>

      {/* Actions */}
      <div className="flex items-center justify-between pt-8">
        <Button variant="ghost" startIcon={<ArrowLeftIcon />} onClick={() => onBackAction()}>
          Wróć
        </Button>
        <Button endIcon={<SparklesIcon />} loading={isPending} onClick={handleFinalize}>
          Uruchom projekt
        </Button>
      </div>
    </div>
  );
}
