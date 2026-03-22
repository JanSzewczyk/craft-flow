"use client";

import * as React from "react";

import { ImageIcon, UploadIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel, Input, toast } from "@szum-tech/design-system";
import { useRouter } from "next/navigation";
import { StepNavigation } from "~/features/onboarding/components/step-navigation";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { brandingSchema, type BrandingFormData } from "~/features/onboarding/schemas/branding-schema";
import { saveStep } from "~/features/onboarding/server/actions/save-step";
import { uploadLogo } from "~/features/onboarding/server/actions/upload-logo";

type BrandingFormProps = {
  defaultValues: {
    logoUrl: string | null;
    brandColor: string;
  };
};

export function BrandingForm({ defaultValues }: BrandingFormProps) {
  const router = useRouter();
  const [logoPreview, setLogoPreview] = React.useState<string | null>(defaultValues.logoUrl);
  const [uploading, setUploading] = React.useState(false);

  const form = useForm<BrandingFormData>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      logoUrl: defaultValues.logoUrl,
      brandColor: defaultValues.brandColor
    }
  });

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadLogo(formData);

    if (result.success) {
      form.setValue("logoUrl", result.data.url);
      setLogoPreview(result.data.url);
      toast.success("Logo przesłane");
    } else {
      toast.error("Błąd", { description: result.error });
    }
    setUploading(false);
  }

  async function handleSubmit(data: BrandingFormData) {
    const result = await saveStep(OnboardingStep.BRANDING, OnboardingStep.TEMPLATE, {
      logoUrl: data.logoUrl ?? null,
      brandColor: data.brandColor
    });

    if (result.success) {
      router.push("/onboarding/template");
    } else {
      toast.error("Błąd", { description: result.error });
    }
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-heading-h2 text-foreground">Twoja Marka, Twój Styl</h1>
        <p className="text-muted-foreground text-body-sm mt-2">Wgraj logo i wybierz kolor przewodni swojego portalu</p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-6">
        <Field>
          <FieldLabel>Logo firmy</FieldLabel>
          <label
            htmlFor="logo-upload"
            className="border-border hover:border-primary/50 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors"
          >
            {logoPreview ? (
              <img src={logoPreview} alt="Logo preview" className="max-h-24 max-w-48 object-contain" />
            ) : (
              <>
                <div className="bg-muted rounded-full p-3">
                  {uploading ? (
                    <UploadIcon className="text-muted-foreground size-6 animate-pulse" />
                  ) : (
                    <ImageIcon className="text-muted-foreground size-6" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-body-sm text-foreground font-medium">
                    {uploading ? "Przesyłanie..." : "Kliknij lub przeciągnij plik"}
                  </p>
                  <p className="text-body-xs text-muted-foreground mt-1">PNG, JPG lub SVG (max 2MB)</p>
                </div>
              </>
            )}
            <input
              id="logo-upload"
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </Field>

        <Field>
          <FieldLabel htmlFor="brandColor">Kolor przewodni</FieldLabel>
          <div className="flex items-center gap-3">
            <input
              type="color"
              id="brandColor"
              className="size-10 cursor-pointer rounded border-0"
              value={form.watch("brandColor")}
              onChange={(e) => form.setValue("brandColor", e.target.value)}
            />
            <Input
              value={form.watch("brandColor")}
              onChange={(e) => form.setValue("brandColor", e.target.value)}
              placeholder="#10B981"
              className="font-mono"
            />
          </div>
        </Field>

        <StepNavigation backHref="/onboarding/company-details" isSubmitting={form.formState.isSubmitting} />
      </form>
    </div>
  );
}
