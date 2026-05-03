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
  clients: Client[];
  templates: Template[];
  onCreateAction: (data: ProjectFormData) => RedirectAction;
};

export function CreateProjectForm({ clients, templates, onCreateAction }: CreateProjectFormProps) {
  const router = useRouter();
  const [clientMode, setClientMode] = React.useState<"existing" | "new">("existing");
  const [clientDisplayName, setClientDisplayName] = React.useState("");

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: null,
      templateId: "",
      clientId: undefined,
      newClient: undefined
    }
  });

  function switchToNew() {
    form.setValue("clientId", undefined);
    form.setValue("newClient", { name: "", email: "", phone: null });
    setClientDisplayName("");
    setClientMode("new");
  }

  function switchToExisting() {
    form.setValue("newClient", undefined);
    form.setValue("clientId", undefined);
    setClientDisplayName("");
    setClientMode("existing");
  }

  async function handleSubmit(data: ProjectFormData) {
    const result = await onCreateAction(data);
    if (!result.success) {
      toast.error("Błąd", { description: result.error });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-8">
      <div className="container-xl w-full space-y-6">
        <div>
          <h2 className="text-heading-h3">Szczegóły projektu</h2>
          <p className="text-muted-foreground text-body-sm mt-1">Podaj nazwę i opis nowego projektu</p>
        </div>

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
              Opis <span className="text-muted-foreground text-xs">(Opcjonalne)</span>
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
      </div>

      {/* Sekcja 2: Szablon etapów */}
      <div className="container-xl w-full space-y-6">
        <div>
          <h2 className="text-heading-h3">Szablon etapów</h2>
          <p className="text-muted-foreground text-body-sm mt-1">Wybierz szablon, który zdefiniuje etapy projektu</p>
        </div>

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
      </div>

      {/* Sekcja 3: Klient */}
      <div className="container-xl w-full space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-heading-h3">Klient</h2>
            <p className="text-muted-foreground text-body-sm mt-1">
              {clientMode === "existing"
                ? "Przypisz istniejącego klienta do projektu"
                : "Utwórz nowego klienta i przypisz go do projektu"}
            </p>
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

        {clientMode === "existing" ? (
          <Controller
            name="clientId"
            control={form.control}
            render={({ field, fieldState }) => (
              <ClientCombobox
                clients={clients}
                value={field.value ?? null}
                displayName={clientDisplayName}
                onChange={(clientId, name) => {
                  field.onChange(clientId ?? undefined);
                  setClientDisplayName(name);
                }}
                error={fieldState.error?.message ?? form.formState.errors.clientId?.message}
              />
            )}
          />
        ) : (
          <div className="flex flex-col gap-4">
            <FieldGroup>
              <Field data-invalid={!!form.formState.errors.newClient?.name}>
                <FieldLabel htmlFor="new-client-name">Imię i nazwisko</FieldLabel>
                <Input id="new-client-name" placeholder="Jan Kowalski" {...form.register("newClient.name")} />
                <FieldError errors={[form.formState.errors.newClient?.name]} />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field data-invalid={!!form.formState.errors.newClient?.email}>
                <FieldLabel htmlFor="new-client-email">E-mail</FieldLabel>
                <Input
                  id="new-client-email"
                  type="email"
                  placeholder="jan@example.com"
                  {...form.register("newClient.email")}
                />
                <FieldError errors={[form.formState.errors.newClient?.email]} />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field data-invalid={!!form.formState.errors.newClient?.phone}>
                <FieldLabel htmlFor="new-client-phone">
                  Telefon <span className="text-muted-foreground text-xs">(Opcjonalne)</span>
                </FieldLabel>
                <Input id="new-client-phone" type="tel" placeholder="+48 ..." {...form.register("newClient.phone")} />
                <FieldError errors={[form.formState.errors.newClient?.phone]} />
              </Field>
            </FieldGroup>
          </div>
        )}
      </div>

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
