"use client";

import * as React from "react";

import { type DefaultValues, useForm, useFormState } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, toast } from "@szum-tech/design-system";
import { BrandingFormFields, type LogoState } from "~/features/contractor/components/form/branding-form-fields";
import { brandingSchema, type BrandingFormData } from "~/features/contractor/schemas/branding-schema";
import { DEFAULT_BRAND_COLOR } from "~/features/onboarding/constants/branding-colors";
import { type ActionResponse } from "~/lib/action-types";

function getInitialLogoState(defaultValues?: DefaultValues<BrandingFormData> | null): LogoState {
  if (defaultValues?.logoUrl) {
    return { mode: "url", url: defaultValues.logoUrl as string };
  }
  return { mode: "none" };
}

type BrandingFormProps = {
  defaultValues?: DefaultValues<BrandingFormData> | null;
  onSaveAction(data: BrandingFormData): ActionResponse;
  uploadLogoAction(formData: FormData): ActionResponse<{ url: string }>;
  deleteLogoAction?(logoUrl: string): ActionResponse<void>;
  onValuesChange?(values: Partial<BrandingFormData>): void;
};

export function BrandingForm({
  defaultValues,
  onSaveAction,
  uploadLogoAction,
  deleteLogoAction,
  onValuesChange
}: BrandingFormProps) {
  const [logoState, setLogoState] = React.useState<LogoState>(() => getInitialLogoState(defaultValues));
  const [files, setFiles] = React.useState<File[]>([]);

  const form = useForm<BrandingFormData>({
    resolver: zodResolver(brandingSchema),
    defaultValues: defaultValues ?? { logoUrl: null, brandColor: DEFAULT_BRAND_COLOR }
  });

  const { isDirty, isSubmitting } = useFormState({ control: form.control });

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      onValuesChange?.({ brandColor: value.brandColor, logoUrl: value.logoUrl });
    });
    return () => subscription.unsubscribe();
  }, [form, onValuesChange]);

  async function handleUpload(
    files: File[],
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    }
  ) {
    const file = files[0];
    if (!file) return;

    options.onProgress(file, 50);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadLogoAction(formData);

    if (result.success) {
      options.onProgress(file, 100);
      options.onSuccess(file);
      form.setValue("logoUrl", result.data.url, { shouldDirty: true });
      setLogoState({ mode: "file", file });
      toast.success("Logo przesłane");
    } else {
      options.onError(file, new Error(result.error));
      toast.error("Błąd", { description: result.error });
    }
  }

  async function handleRemoveLogo() {
    const currentUrl = form.getValues("logoUrl");
    if (currentUrl && deleteLogoAction) {
      await deleteLogoAction(currentUrl);
    }
    form.setValue("logoUrl", "", { shouldValidate: false, shouldDirty: true });
    setFiles([]);
    setLogoState({ mode: "none" });
  }

  async function handleSubmit(data: BrandingFormData) {
    const result = await onSaveAction(data);

    if (result.success) {
      toast.success(result.message ?? "Zapisano");
      form.reset(data);
    } else {
      toast.error("Błąd", { description: result.error });
    }
  }

  const handleFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`
    });
  }, []);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="w-full max-w-xl gap-6">
      <BrandingFormFields
        form={form}
        logoState={logoState}
        files={files}
        onFilesChange={setFiles}
        onUpload={handleUpload}
        onRemoveLogo={handleRemoveLogo}
        onFileReject={handleFileReject}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" disabled={!isDirty} onClick={() => form.reset()}>
          Anuluj
        </Button>
        <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
          Zapisz zmiany
        </Button>
      </div>
    </form>
  );
}
