"use client";

import * as React from "react";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  toast
} from "@szum-tech/design-system";
import { useRouter } from "next/navigation";
import { type Client } from "~/features/crm/server/db/schema";
import { type Template } from "~/features/templates/server/db/schema";
import { type ActionResponse } from "~/lib/action-types";

import { createProjectSchema, type CreateProjectFormData } from "../schemas/project-schema";
import { type Project } from "../server/db/schema";

import { ClientCombobox, type ClientComboboxValue } from "./client-combobox";

type CreateProjectFormProps = {
  clients: Client[];
  templates: Template[];
  onCreateAction: (data: CreateProjectFormData) => ActionResponse<Project>;
};

export function CreateProjectForm({ clients, templates, onCreateAction }: CreateProjectFormProps) {
  const router = useRouter();

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      templateId: "",
      client: { name: "", email: undefined, phone: null }
    }
  });

  const [comboboxValue, setComboboxValue] = React.useState<ClientComboboxValue | null>(null);

  async function handleSubmit(data: CreateProjectFormData) {
    const result = await onCreateAction(data);

    if (result.success) {
      toast.success("Projekt utworzony pomyślnie!");
      router.push(`/app/projects/${result.data.id}`);
    } else {
      toast.error("Błąd", { description: result.error });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-6">
      <div className="container-xl w-full space-y-6">
        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.name}>
            <FieldLabel htmlFor="project-name">Nazwa projektu</FieldLabel>
            <Input id="project-name" placeholder="np. Remont łazienki" {...form.register("name")} />
            <FieldError errors={[form.formState.errors.name]} />
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Controller
            control={form.control}
            name="templateId"
            render={({ field: { onChange, value, ...rest }, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="project-template">Szablon etapów</FieldLabel>
                <Select
                  placeholder="Wybierz szablon..."
                  invalid={fieldState.invalid}
                  onValueChange={onChange}
                  value={value}
                  className="w-full"
                  {...rest}
                >
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </FieldGroup>

        <Controller
          name="client"
          control={form.control}
          render={({ field }) => (
            <ClientCombobox
              clients={clients}
              value={comboboxValue}
              onChange={(val) => {
                setComboboxValue(val);
                if (val.type === "existing") {
                  field.onChange({ id: val.id, name: val.name, email: undefined, phone: null });
                } else {
                  field.onChange({ name: val.name, email: val.email, phone: val.phone });
                }
              }}
              error={
                form.formState.errors.client?.message ??
                form.formState.errors.client?.name?.message ??
                form.formState.errors.client?.email?.message
              }
            />
          )}
        />
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <Button type="button" variant="secondary" onClick={() => router.push("/app/projects")}>
          Anuluj
        </Button>
        <Button type="submit" loading={form.formState.isSubmitting}>
          Utwórz szkic projektu
        </Button>
      </div>
    </form>
  );
}
