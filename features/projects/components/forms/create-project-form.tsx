"use client";

import * as React from "react";

import { Controller, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
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
import { type Client } from "~/features/crm/types/client";
import { type Template } from "~/features/templates/server/db/schema";
import { type RedirectAction } from "~/lib/action-types";

import { projectSchema, type ProjectFormData } from "../../schemas/project-schema";

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
        mode: "existing"
      }
    }
  });

  const clientMode = useWatch({ control: form.control, name: "client.mode" });

  function switchToNew() {
    form.setValue("client", { mode: "new", email: "", name: "", phone: null });
  }

  function switchToExisting() {
    form.setValue("client", { mode: "existing", clientId: "" });
  }

  async function handleSubmit(data: ProjectFormData) {
    const result = await onCreateAction(data);
    if (!result.success) {
      toast.error("Błąd", { description: result.error });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Szczegóły projektu</FieldLegend>
          <FieldDescription>Podaj nazwię i opis nowego projektu</FieldDescription>

          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="project-name">Nazwa projektu</FieldLabel>
              <Input
                id="project-name"
                placeholder="np. Remont łazienki"
                invalid={!!form.formState.errors.name}
                {...form.register("name")}
              />
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
                invalid={!!form.formState.errors.description}
                {...form.register("description", { setValueAs: (val: string) => val || null })}
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
                render={({ field, fieldState }) => {
                  const selectedClient = clients.find((c) => c.id === field.value) ?? null;
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="client-combobox">Klient</FieldLabel>
                      <Combobox
                        items={clients}
                        value={selectedClient}
                        onValueChange={(client) => field.onChange(client?.id ?? null)}
                        itemToStringLabel={(client) => client.name}
                        isItemEqualToValue={(a, b) => a.id === b.id}
                        filter={(client, query) => {
                          const q = query.toLowerCase();
                          return client.name.toLowerCase().includes(q) || client.email.toLowerCase().includes(q);
                        }}
                      >
                        <ComboboxInput
                          id="client-combobox"
                          placeholder="Wyszukaj klienta..."
                          showClear
                          aria-invalid={fieldState.invalid}
                        />
                        <ComboboxContent>
                          <ComboboxEmpty>Brak pasujących klientów</ComboboxEmpty>
                          <ComboboxList>
                            {(client) => (
                              <ComboboxItem key={client.id} value={client}>
                                {client.name}
                                <span className="text-mute">{client.email}</span>
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  );
                }}
              />
            ) : (
              <React.Fragment>
                <Field data-invalid={!!form.formState.errors.client?.name}>
                  <FieldLabel htmlFor="new-client-name">imię i nazwisko</FieldLabel>
                  <Input
                    id="new-client-name"
                    placeholder="Jan Kowalski"
                    {...form.register("client.name")}
                    invalid={!!form.formState.errors.client?.name}
                  />
                  <FieldError errors={[form.formState.errors.client?.name]} />
                </Field>

                <Field data-invalid={!!form.formState.errors.client?.email}>
                  <FieldLabel htmlFor="new-client-email">E-mail</FieldLabel>
                  <Input
                    id="new-client-email"
                    type="email"
                    placeholder="jan@example.com"
                    invalid={!!form.formState.errors.client?.email}
                    {...form.register("client.email")}
                  />
                  <FieldError errors={[form.formState.errors.client?.email]} />
                </Field>

                <Field data-invalid={!!form.formState.errors.client?.phone}>
                  <FieldLabel htmlFor="new-client-phone">
                    Telefon <span className="text-mute">(Opcjonalne)</span>
                  </FieldLabel>
                  <Input
                    id="new-client-phone"
                    type="tel"
                    placeholder="+48 ..."
                    invalid={!!form.formState.errors.client?.phone}
                    {...form.register("client.phone", { setValueAs: (val: string) => val || null })}
                  />
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
