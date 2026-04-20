"use client";

import * as React from "react";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { type DefaultValues, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FieldGroup, toast } from "@szum-tech/design-system";
import { BrandingFormFields, type LogoState } from "~/features/contractor/components";
import { brandingSchema, type BrandingFormData } from "~/features/contractor/schemas/branding-schema";
import { DEFAULT_BRAND_COLOR } from "~/features/onboarding/constants/branding-colors";
import { type ActionResponse, type RedirectAction } from "~/lib/action-types";

function getInitialLogoState(defaultValues?: DefaultValues<BrandingFormData> | null): LogoState {
  if (defaultValues?.logoUrl) {
    return { mode: "url", url: defaultValues.logoUrl as string };
  }
  return { mode: "none" };
}

type BrandingFormProps = {
  defaultValues?: DefaultValues<BrandingFormData> | null;
  onContinueAction(formData: BrandingFormData): RedirectAction;
  uploadLogoAction(formData: FormData): ActionResponse<{ url: string }>;
  deleteLogoAction?(logoUrl: string): ActionResponse<void>;
  onBackAction(): void;
  onValuesChange?(values: Partial<BrandingFormData>): void;
};

export function BrandingForm({
  defaultValues,
  onContinueAction,
  uploadLogoAction,
  deleteLogoAction,
  onBackAction,
  onValuesChange
}: BrandingFormProps) {
  const [logoState, setLogoState] = React.useState<LogoState>(() => getInitialLogoState(defaultValues));
  const [files, setFiles] = React.useState<File[]>([]);

  const form = useForm<BrandingFormData>({
    resolver: zodResolver(brandingSchema),
    defaultValues: defaultValues ?? { brandColor: DEFAULT_BRAND_COLOR }
  });

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
      form.setValue("logoUrl", result.data.url);
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
    form.setValue("logoUrl", "", { shouldValidate: false });
    setFiles([]);
    setLogoState({ mode: "none" });
  }

  async function handleSubmit(data: BrandingFormData) {
    const result = await onContinueAction(data);

    if (!result.success) {
      toast.error("Błąd", { description: result.error });
    }
  }

  const handleFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`
    });
  }, []);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-6">
      <FieldGroup className="container-xl">
        <BrandingFormFields
          form={form}
          logoState={logoState}
          files={files}
          onFilesChange={setFiles}
          onUpload={handleUpload}
          onRemoveLogo={handleRemoveLogo}
          onFileReject={handleFileReject}
        />
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
