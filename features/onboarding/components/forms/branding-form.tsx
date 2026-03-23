import * as React from "react";

import { ArrowLeftIcon, ArrowRightIcon, ImageIcon, XIcon } from "lucide-react";
import { Controller, type DefaultValues, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  ColorPicker,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerHueSlider,
  ColorPickerInput,
  ColorPickerSwatch,
  ColorPickerTrigger,
  ColorSwatch,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  Input,
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
  RadioGroup,
  RadioGroupItem,
  toast
} from "@szum-tech/design-system";
import { cn } from "@szum-tech/design-system/utils";
import Image from "next/image";
import { BRAND_COLOR_PRESETS, DEFAULT_BRAND_COLOR } from "~/features/onboarding/constants/branding-colors";
import { brandingSchema, type BrandingFormData } from "~/features/onboarding/schemas/branding-schema";
import { type ActionResponse, type RedirectAction } from "~/lib/action-types";

type LogoState = { mode: "none" } | { mode: "url"; url: string } | { mode: "file"; file: File };

function getInitialLogoState(defaultValues?: DefaultValues<BrandingFormData> | null): LogoState {
  if (defaultValues?.logoUrl) {
    return { mode: "url", url: defaultValues.logoUrl as string };
  }
  return { mode: "none" };
}

function getFilenameFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    return pathname.split("/").pop() ?? "logo";
  } catch {
    return "logo";
  }
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

  form.watch((value) => {
    onValuesChange?.({ brandColor: value.brandColor, logoUrl: value.logoUrl });
  });

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
        <Field>
          <FieldLabel>Logo firmy</FieldLabel>
          {logoState.mode === "url" && (
            <Item variant="outline" role="listitem">
              <ItemMedia variant="image">
                <Image src={logoState.url} alt="Logo firmy" width="64" height="64" className="max-h-16 max-w-32" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{getFilenameFromUrl(logoState.url)}</ItemTitle>
              </ItemContent>
              <ItemActions>
                <Button variant="ghost" size="icon" onClick={handleRemoveLogo}>
                  <XIcon />
                </Button>
              </ItemActions>
            </Item>
          )}
          {logoState.mode === "none" && (
            <FileUpload
              value={files}
              onValueChange={setFiles}
              maxFiles={1}
              maxSize={2 * 1024 * 1024}
              accept="image/png, image/jpeg, image/svg+xml"
              onUpload={handleUpload}
              onFileReject={handleFileReject}
            >
              <FileUploadDropzone className="flex flex-col items-center justify-center gap-3 p-8">
                <div className="bg-muted rounded-full p-3">
                  <ImageIcon className="text-muted-foreground size-6" />
                </div>
                <div className="text-center">
                  <p className="text-body-sm text-foreground font-medium">Kliknij lub przeciągnij plik</p>
                  <p className="text-body-xs text-muted-foreground mt-1">PNG, JPG lub SVG (max 2MB)</p>
                </div>
              </FileUploadDropzone>
            </FileUpload>
          )}
          {logoState.mode === "file" && (
            <FileUpload
              value={files}
              onValueChange={setFiles}
              maxFiles={1}
              maxSize={2 * 1024 * 1024}
              accept="image/png, image/jpeg, image/svg+xml"
              onUpload={handleUpload}
              onFileReject={handleFileReject}
            >
              <FileUploadList orientation="horizontal">
                {files.map((file) => (
                  <FileUploadItem key={file.name} value={file} className="w-full">
                    <FileUploadItemPreview />
                    <FileUploadItemMetadata />
                    <FileUploadItemDelete asChild onClick={handleRemoveLogo}>
                      <Button variant="ghost" size="icon-sm" aria-label={`Remove ${file.name}`}>
                        ✕
                      </Button>
                    </FileUploadItemDelete>
                  </FileUploadItem>
                ))}
              </FileUploadList>
            </FileUpload>
          )}
          <FieldError errors={[form.formState.errors.logoUrl]} />
        </Field>

        <Controller
          control={form.control}
          name="brandColor"
          render={({ field: { onChange, value, ...fieldProps }, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="brand-color">Kolor przewodni</FieldLabel>
              <div className="space-y-6">
                <RadioGroup
                  onValueChange={onChange}
                  value={value}
                  aria-invalid={!!fieldState.error}
                  orientation="horizontal"
                  className="flex flex-row"
                  {...fieldProps}
                >
                  {BRAND_COLOR_PRESETS.map((color) => (
                    <label
                      key={color.value}
                      className="has-focus-visible:border-ring has-focus-visible:ring-ring/50 flex-0 rounded border border-transparent has-focus-visible:ring"
                    >
                      <RadioGroupItem value={color.value} aria-label={color.label} className="sr-only" />
                      <ColorSwatch
                        className={cn(
                          "cursor-pointer transition-all",
                          value === color.value ? "ring-primary ring-2" : ""
                        )}
                        style={{ backgroundColor: color.value }}
                      />
                    </label>
                  ))}
                </RadioGroup>

                <div className="flex flex-row gap-2">
                  <ColorPicker value={value} onValueChange={onChange} defaultFormat="hex">
                    <ColorPickerTrigger asChild>
                      <button type="button" aria-label="Pick Color">
                        <ColorPickerSwatch className="size-8" style={{ backgroundColor: value }} />
                      </button>
                    </ColorPickerTrigger>
                    <ColorPickerContent>
                      <ColorPickerArea />
                      <div className="flex items-center gap-2">
                        <ColorPickerEyeDropper />
                        <ColorPickerHueSlider />
                      </div>
                      <ColorPickerInput withoutAlpha />
                    </ColorPickerContent>
                  </ColorPicker>

                  <Input
                    id="brand-color"
                    value={value}
                    onChange={onChange}
                    name="brandColor"
                    aria-invalid={!!fieldState.error}
                  />
                </div>
              </div>

              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
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
