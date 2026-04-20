"use client";

import { ImageIcon, XIcon } from "lucide-react";
import { Controller, type UseFormReturn } from "react-hook-form";

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
  FileUploadList,
  Input,
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
  RadioGroup,
  RadioGroupItem
} from "@szum-tech/design-system";
import { cn } from "@szum-tech/design-system/utils";
import Image from "next/image";
import { type BrandingFormData } from "~/features/contractor/schemas/branding-schema";
import { BRAND_COLOR_PRESETS } from "~/features/onboarding/constants/branding-colors";

export type LogoState = { mode: "none" } | { mode: "url"; url: string } | { mode: "file"; file: File };

type BrandingFormFieldsProps = {
  form: UseFormReturn<BrandingFormData>;
  logoState: LogoState;
  files: File[];
  onFilesChange: (files: File[]) => void;
  onUpload: (
    files: File[],
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    }
  ) => Promise<void>;
  onRemoveLogo: () => void;
  onFileReject: (file: File, message: string) => void;
};

function getFilenameFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    return pathname.split("/").pop() ?? "logo";
  } catch {
    return "logo";
  }
}

export function BrandingFormFields({
  form,
  logoState,
  files,
  onFilesChange,
  onUpload,
  onRemoveLogo,
  onFileReject
}: BrandingFormFieldsProps) {
  return (
    <FieldGroup>
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
              <Button variant="ghost" size="icon" onClick={onRemoveLogo}>
                <XIcon />
              </Button>
            </ItemActions>
          </Item>
        )}
        {logoState.mode === "none" && (
          <FileUpload
            value={files}
            onValueChange={onFilesChange}
            maxFiles={1}
            maxSize={2 * 1024 * 1024}
            accept="image/png, image/jpeg, image/svg+xml"
            onUpload={onUpload}
            onFileReject={onFileReject}
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
            onValueChange={onFilesChange}
            maxFiles={1}
            maxSize={2 * 1024 * 1024}
            accept="image/png, image/jpeg, image/svg+xml"
            onUpload={onUpload}
            onFileReject={onFileReject}
          >
            <FileUploadList orientation="horizontal">
              {files.map((file) => (
                <FileUploadItem key={file.name} value={file} className="w-full">
                  <FileUploadItemPreview />
                  <FileUploadItemMetadata />
                  <FileUploadItemDelete asChild onClick={onRemoveLogo}>
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
  );
}
