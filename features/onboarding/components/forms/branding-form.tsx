"use client";

import * as React from "react";

import { ArrowLeftIcon, ArrowRightIcon, ImageIcon, UploadIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Field, FieldGroup, FieldLabel, Input, toast } from "@szum-tech/design-system";
import { brandingSchema, type BrandingFormData } from "~/features/onboarding/schemas/branding-schema";
import { type ActionResponse, type RedirectAction } from "~/lib/action-types";

type BrandingFormProps = {
  defaultValues: {
    logoUrl: string | null;
    brandColor: string;
  };
  onContinueAction: (formData: BrandingFormData) => RedirectAction;
  uploadLogoAction: (formData: FormData) => ActionResponse<{ url: string }>;
  onBackAction: () => void;
};

export function BrandingForm({ defaultValues, onContinueAction, uploadLogoAction, onBackAction }: BrandingFormProps) {
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

    const result = await uploadLogoAction(formData);

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
    const result = await onContinueAction(data);

    if (!result.success) {
      toast.error("Błąd", { description: result.error });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-6">
      <FieldGroup className="container-xl">
        <Field>
          <FieldLabel>Logo firmy</FieldLabel>
          <label
            htmlFor="logo-upload"
            className="border-border hover:border-primary/50 flex cursor-pointer flex-col items-center justify-center gap-3 rounded border-2 border-dashed p-8 transition-colors"
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
      </FieldGroup>

      <div className="flex justify-between gap-4 pt-6">
        <Button variant="outline" startIcon={<ArrowLeftIcon />} onClick={onBackAction}>
          Wróć
        </Button>
        <Button type="submit" loading={form.formState.isSubmitting} endIcon={<ArrowRightIcon />}>
          Dalej
        </Button>
      </div>
    </form>
  );
}
