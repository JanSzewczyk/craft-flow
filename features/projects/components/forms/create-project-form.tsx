"use client";

import * as React from "react";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Input,
  Select,
  SelectContent,
  SelectItem,
  Textarea,
  toast
} from "@szum-tech/design-system";
import { useRouter } from "next/navigation";
import { type Client } from "~/features/crm/server/db/schema";
import { type Template } from "~/features/templates/server/db/schema";
import { type RedirectAction } from "~/lib/action-types";

import { projectSchema, type ProjectFormData } from "../../schemas/project-schema";
import { ClientCombobox } from "../client-combobox";

type CreateProjectFormProps = {
  clients: Array<Client>;
  templates: Array<Template>;
  onCreateAction(data: ProjectFormData): RedirectAction;
};

export function CreateProjectForm({ clients, templates, onCreateAction }: CreateProjectFormProps) {
  const router = useRouter();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      client: {
        mode: "new"
      }
    }
  });

  const clientMode = form.watch("client.mode");

  function switchToNew() {
    form.setValue("client", { mode: "new" });
  }

  function switchToExisting() {
    form.setValue("client", { mode: "existing" });
  }

  async function handleSubmit(data: ProjectFormData) {
    const result = await onCreateAction(data);
    if (!result.success) {
      toast.error("Błąd", { description: result.error });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Szczegóły projektu</FieldLegend>
          <FieldDescription>Podaj nazwę i opis nowego projektu</FieldDescription>

          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="project-name">Nazwa projektu</FieldLabel>
              <Input id="project-name" placeholder="np. Remont łazienki" {...form.register("name")} />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.description}>
              <FieldLabel htmlFor="project-description">
                Opis <span className="text-mute">(Opcjonalne)</span>
              </FieldLabel>
              <Textarea
                id="project-description"
                placeholder="Krótki opis zakresu prac..."
                rows={3}
                {...form.register("description")}
              />
              <FieldError errors={[form.formState.errors.description]} />
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Szablon etapów</FieldLegend>
          <FieldDescription>Wybierz szablon, który zdefiniuje etapy projektu</FieldDescription>

          <FieldGroup>
            <Controller
              control={form.control}
              name="templateId"
              render={({ field: { onChange, value, ...rest }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="project-template">Szablon</FieldLabel>
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
        </FieldSet>

        <FieldSet>
          <div className="flex flex-row items-end justify-between">
            <div>
              <FieldLegend>Klient</FieldLegend>
              <FieldDescription>
                {clientMode === "existing"
                  ? "Przypisz istniejącego klienta do projektu"
                  : "Utwórz nowego klienta i przypisz go do projektu"}
              </FieldDescription>
            </div>
            {clientMode === "existing" ? (
              <Button type="button" variant="secondary" size="sm" onClick={switchToNew}>
                + Nowy klient
              </Button>
            ) : (
              <Button type="button" variant="ghost" size="sm" onClick={switchToExisting}>
                Wybierz istniejącego
              </Button>
            )}
          </div>

          <FieldGroup>
            {clientMode === "existing" ? (
              <Controller
                name="client.clientId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <ClientCombobox
                    clients={clients}
                    value={field.value ?? null}
                    displayName={clientDisplayName}
                    onChange={(clientId, name) => {
                      field.onChange(clientId ?? "");
                      setClientDisplayName(name);
                    }}
                    error={fieldState.error?.message}
                  />
                )}
              />
            ) : (
              <React.Fragment>
                <Field data-invalid={!!form.formState.errors.client?.name}>
                  <FieldLabel htmlFor="new-client-name">Imię i nazwisko</FieldLabel>
                  <Input id="new-client-name" placeholder="Jan Kowalski" {...form.register("client.name")} />
                  <FieldError errors={[form.formState.errors.client?.name]} />
                </Field>

                <Field data-invalid={!!form.formState.errors.client?.email}>
                  <FieldLabel htmlFor="new-client-email">E-mail</FieldLabel>
                  <Input
                    id="new-client-email"
                    type="email"
                    placeholder="jan@example.com"
                    {...form.register("client.email")}
                  />
                  <FieldError errors={[form.formState.errors.client?.email]} />
                </Field>

                <Field data-invalid={!!form.formState.errors.client?.phone}>
                  <FieldLabel htmlFor="new-client-phone">
                    Telefon <span className="text-mute">(Opcjonalne)</span>
                  </FieldLabel>
                  <Input id="new-client-phone" type="tel" placeholder="+48 ..." {...form.register("client.phone")} />
                  <FieldError errors={[form.formState.errors.client?.phone]} />
                </Field>
              </React.Fragment>
            )}
          </FieldGroup>
        </FieldSet>
      </FieldGroup>

      <div className="flex justify-end gap-3 pt-2">
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
