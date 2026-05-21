import * as React from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@szum-tech/design-system";
import { expect, fn } from "storybook/test";
import { brandingSchema, type BrandingFormData } from "~/features/contractor/schemas/branding-schema";
import { brandingFormBuilder } from "~/features/contractor/test/builders";

import preview from "~/.storybook/preview";

import { BrandingFormFields, type LogoState } from "./branding-form-fields";

/*
 * Test plan:
 * 1. EmptyLogo — logoState.mode = "none"
 *    - Renders file upload dropzone
 *    - Renders brand color field and preset swatches
 *    - Dropzone is visible with upload text
 *    - onFilesChange is called when files change
 * 2. WithUrl — logoState.mode = "url", logo is an external URL
 *    - Renders logo item with image and remove button
 *    - Does not render the file upload dropzone
 *    - Clicking remove button calls onRemoveLogo
 * 3. WithFile — logoState.mode = "file", file uploaded
 *    - Renders file list (not dropzone)
 *    - File remove button calls onRemoveLogo
 */

type FormWrapperProps = {
  defaultValues?: Partial<BrandingFormData>;
  logoState?: LogoState;
  files?: Array<File>;
  onFilesChange?: (files: Array<File>) => void;
  onUpload?: (
    files: Array<File>,
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    }
  ) => Promise<void>;
  onRemoveLogo?: () => void;
  onFileReject?: (file: File, message: string) => void;
  onSubmit?: (data: BrandingFormData) => void;
};

function FormWrapper({
  defaultValues,
  logoState = { mode: "none" },
  files = [],
  onFilesChange,
  onUpload,
  onRemoveLogo,
  onFileReject,
  onSubmit
}: FormWrapperProps) {
  const form = useForm<BrandingFormData>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      logoUrl: null,
      brandColor: "#2563EB",
      ...defaultValues
    }
  });

  return (
    <form onSubmit={form.handleSubmit((data) => onSubmit?.(data))} noValidate>
      <BrandingFormFields
        form={form}
        logoState={logoState}
        files={files}
        onFilesChange={onFilesChange ?? (() => undefined)}
        onUpload={onUpload ?? (() => Promise.resolve())}
        onRemoveLogo={onRemoveLogo ?? (() => undefined)}
        onFileReject={onFileReject ?? (() => undefined)}
      />
      <Button type="submit" className="mt-4">
        Zapisz
      </Button>
    </form>
  );
}

const meta = preview.meta({
  title: "Features/Contractor/Form/Branding Form Fields",
  component: FormWrapper,
  parameters: {
    layout: "padded"
  }
});

const brandingData = brandingFormBuilder.one({
  overrides: { brandColor: "#2563EB" }
});

// ---------------------------------------------------------------------------
// Story 1: Empty logo (mode: "none")
// ---------------------------------------------------------------------------

export const EmptyLogo = meta.story({
  render: (args) => (
    <FormWrapper
      logoState={args.logoState}
      onFilesChange={args.onFilesChange}
      onRemoveLogo={args.onRemoveLogo}
      onFileReject={args.onFileReject}
    />
  ),
  args: {
    logoState: { mode: "none" },
    onFilesChange: fn(),
    onRemoveLogo: fn(),
    onFileReject: fn()
  }
});

EmptyLogo.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Upload dropzone is visible", async () => {
    await expect(canvas.getByText("Kliknij lub przeciągnij plik")).toBeVisible();
    await expect(canvas.getByText("PNG, JPG lub SVG (max 2MB)")).toBeVisible();
  });

  await step("Brand color section is visible", async () => {
    await expect(canvas.getByText("Kolor przewodni")).toBeVisible();
    await expect(canvas.getByLabelText("Pick Color")).toBeVisible();
  });

  await step("Preset color swatches are visible", async () => {
    await expect(canvas.getByRole("radio", { name: "Niebieski" })).toBeInTheDocument();
    await expect(canvas.getByRole("radio", { name: "Fioletowy" })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Story 2: With URL logo (mode: "url")
// ---------------------------------------------------------------------------

const urlLogoState: LogoState = {
  mode: "url",
  url: "https://placehold.co/64x64/2563EB/white?text=Logo"
};

export const WithUrl = meta.story({
  render: (args) => (
    <FormWrapper
      defaultValues={{ logoUrl: urlLogoState.url, brandColor: brandingData.brandColor }}
      logoState={args.logoState}
      onRemoveLogo={args.onRemoveLogo}
    />
  ),
  args: {
    logoState: urlLogoState,
    onRemoveLogo: fn()
  }
});

WithUrl.test("Renders logo item instead of dropzone", async ({ canvas, step }) => {
  await step("Logo image is visible", async () => {
    const img = canvas.getByRole("img", { name: "Logo firmy" });
    await expect(img).toBeVisible();
  });

  await step("Upload dropzone is not rendered", async () => {
    await expect(canvas.queryByText("Kliknij lub przeciągnij plik")).not.toBeInTheDocument();
  });
});

WithUrl.test("Clicking remove button calls onRemoveLogo", async ({ canvas, userEvent, args }) => {
  const removeButton = canvas.getByRole("button");
  await userEvent.click(removeButton);
  await expect(args.onRemoveLogo).toHaveBeenCalledOnce();
});

// ---------------------------------------------------------------------------
// Story 3: With file logo (mode: "file")
// ---------------------------------------------------------------------------

const mockFile = new File(["content"], "logo.png", { type: "image/png" });
const fileLogoState: LogoState = { mode: "file", file: mockFile };

export const WithFile = meta.story({
  render: (args) => (
    <FormWrapper
      defaultValues={{ logoUrl: null, brandColor: brandingData.brandColor }}
      logoState={args.logoState}
      files={[mockFile]}
      onFilesChange={args.onFilesChange}
      onRemoveLogo={args.onRemoveLogo}
    />
  ),
  args: {
    logoState: fileLogoState,
    onFilesChange: fn(),
    onRemoveLogo: fn()
  }
});

WithFile.test("Renders file list instead of dropzone", async ({ canvas }) => {
  await expect(canvas.queryByText("Kliknij lub przeciągnij plik")).not.toBeInTheDocument();
});

WithFile.test("Clicking file remove button calls onRemoveLogo", async ({ canvas, userEvent, args }) => {
  const removeButton = canvas.getByRole("button", { name: /remove logo\.png/i });
  await userEvent.click(removeButton);
  await expect(args.onRemoveLogo).toHaveBeenCalledOnce();
});
