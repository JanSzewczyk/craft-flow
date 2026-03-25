"use client";

import * as React from "react";

import { InfoIcon } from "lucide-react";
import { type DefaultValues } from "react-hook-form";

import { Alert, AlertTitle } from "@szum-tech/design-system";
import { BrandingPreview } from "~/features/onboarding/components/branding-preview";
import { BrandingForm } from "~/features/onboarding/components/forms/branding-form";
import { type BrandingFormData } from "~/features/onboarding/schemas/branding-schema";
import { type ActionResponse, type RedirectAction } from "~/lib/action-types";

type BrandingViewProps = {
  defaultValues?: DefaultValues<BrandingFormData> | null;
  onContinueAction: (formData: BrandingFormData) => RedirectAction;
  uploadLogoAction: (formData: FormData) => ActionResponse<{ url: string }>;
  deleteLogoAction?: (logoUrl: string) => ActionResponse<void>;
  onBackAction: () => void;
};

export function BrandingView({
  defaultValues,
  onContinueAction,
  uploadLogoAction,
  deleteLogoAction,
  onBackAction
}: BrandingViewProps) {
  const [state, setState] = React.useState<Partial<BrandingFormData>>(defaultValues ?? {});

  return (
    <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_auto]">
      <div className="flex flex-col gap-8">
        <Alert>
          <InfoIcon />
          <AlertTitle>Funkcja dostępna w planie Standard i Premium.</AlertTitle>
        </Alert>

        <BrandingForm
          defaultValues={defaultValues}
          onContinueAction={onContinueAction}
          uploadLogoAction={uploadLogoAction}
          deleteLogoAction={deleteLogoAction}
          onBackAction={onBackAction}
          onValuesChange={setState}
        />
      </div>

      <div className="flex flex-col items-center justify-center lg:sticky lg:top-32">
        <BrandingPreview brandColor={state?.brandColor} logoUrl={state?.logoUrl} />
      </div>
    </div>
  );
}
