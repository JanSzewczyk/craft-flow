"use client";

import * as React from "react";

import { type DefaultValues } from "react-hook-form";

import { type BrandingFormData } from "~/features/contractor/schemas/branding-schema";
import { BrandingPreview } from "~/features/onboarding/components/branding-preview";
import { DEFAULT_BRAND_COLOR } from "~/features/onboarding/constants/branding-colors";
import { type ActionResponse } from "~/lib/action-types";

import { BrandingForm } from "./form/branding-form";

type BrandingEditorProps = {
  defaultValues?: DefaultValues<BrandingFormData> | null;
  onSaveAction(data: BrandingFormData): ActionResponse;
  uploadLogoAction(formData: FormData): ActionResponse<{ url: string }>;
  deleteLogoAction?(logoUrl: string): ActionResponse<void>;
};

export function BrandingEditor({
  defaultValues,
  onSaveAction,
  uploadLogoAction,
  deleteLogoAction
}: BrandingEditorProps) {
  const [previewValues, setPreviewValues] = React.useState<Partial<BrandingFormData>>({
    brandColor: (defaultValues?.brandColor as string) ?? DEFAULT_BRAND_COLOR,
    logoUrl: (defaultValues?.logoUrl as string) ?? undefined
  });

  return (
    <div className="flex gap-8">
      <BrandingForm
        defaultValues={defaultValues}
        onSaveAction={onSaveAction}
        uploadLogoAction={uploadLogoAction}
        deleteLogoAction={deleteLogoAction}
        onValuesChange={setPreviewValues}
      />
      <div className="hidden lg:block">
        <BrandingPreview brandColor={previewValues.brandColor} logoUrl={previewValues.logoUrl} />
      </div>
    </div>
  );
}
