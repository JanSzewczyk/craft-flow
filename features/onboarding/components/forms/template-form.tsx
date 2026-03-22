"use client";

import { GripVerticalIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

import { Button, Input, toast } from "@szum-tech/design-system";
import { useRouter } from "next/navigation";
import { StepNavigation } from "~/features/onboarding/components/step-navigation";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { templateSchema } from "~/features/onboarding/schemas/template-schema";
import { saveStep } from "~/features/onboarding/server/actions/save-step";

type TemplateFormProps = {
  defaultValues: { templateSteps: string[] };
  backHref: string;
};

type FormValues = {
  steps: { value: string }[];
};

export function TemplateForm({ defaultValues, backHref }: TemplateFormProps) {
  const router = useRouter();

  const form = useForm<FormValues>({
    defaultValues: {
      steps: defaultValues.templateSteps.map((s) => ({ value: s }))
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "steps"
  });

  async function handleSubmit(data: FormValues) {
    const templateSteps = data.steps.map((s) => s.value).filter((v) => v.trim() !== "");

    const parsed = templateSchema.safeParse({ templateSteps });
    if (!parsed.success) {
      toast.error("Błąd", { description: "Dodaj co najmniej jeden etap" });
      return;
    }

    const result = await saveStep(OnboardingStep.TEMPLATE, OnboardingStep.EMAIL, { templateSteps });

    if (result.success) {
      router.push("/onboarding/email");
    } else {
      toast.error("Błąd", { description: result.error });
    }
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-heading-h2 text-foreground">Zdefiniuj swój proces</h1>
        <p className="text-muted-foreground text-body-sm mt-2">Z jakich kroków zazwyczaj składa się Twoje zlecenie?</p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <GripVerticalIcon className="text-muted-foreground size-5 shrink-0 cursor-grab" />
              <span className="text-muted-foreground text-body-sm w-6 shrink-0 text-center">{index + 1}.</span>
              <Input placeholder="Nazwa etapu" {...form.register(`steps.${index}.value`)} />
              {fields.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                  <TrashIcon className="size-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button type="button" variant="outline" onClick={() => append({ value: "" })} className="self-start">
          <PlusIcon className="size-4" />
          Dodaj kolejny etap
        </Button>

        <StepNavigation backHref={backHref} isSubmitting={form.formState.isSubmitting} />
      </form>
    </div>
  );
}
