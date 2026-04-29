"use client";

import * as React from "react";

import { CheckIcon, PlusIcon, XIcon } from "lucide-react";

import { type Client } from "~/features/crm/server/db/schema";
import { Field, FieldLabel, Input } from "@szum-tech/design-system";
import { cn } from "@szum-tech/design-system/utils";

export type ExistingClientValue = { type: "existing"; id: string; name: string; email: string };
export type NewClientValue = { type: "new"; name: string; email?: string; phone?: string | null };
export type ClientComboboxValue = ExistingClientValue | NewClientValue;

type ClientComboboxProps = {
  clients: Client[];
  value: ClientComboboxValue | null;
  onChange: (val: ClientComboboxValue) => void;
  error?: string;
};

export function ClientCombobox({ clients, value, onChange, error }: ClientComboboxProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isLocked = value !== null;
  const isNewClient = value?.type === "new";

  const filteredClients = React.useMemo(() => {
    if (!searchTerm.trim()) return clients;
    const lower = searchTerm.toLowerCase();
    return clients.filter((c) => c.name.toLowerCase().includes(lower) || c.email.toLowerCase().includes(lower));
  }, [clients, searchTerm]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  }

  function handleInputFocus() {
    if (!isLocked) {
      setIsOpen(true);
    }
  }

  function handleSelectExisting(client: Client) {
    onChange({ type: "existing", id: client.id, name: client.name, email: client.email });
    setSearchTerm(client.name);
    setIsOpen(false);
  }

  function handleCreateNew() {
    const name = searchTerm.trim();
    if (!name) return;
    onChange({ type: "new", name, email: undefined, phone: null });
    setIsOpen(false);
  }

  function handleClear() {
    onChange({ type: "new", name: "", email: undefined, phone: null });
    setSearchTerm("");
    setIsOpen(false);
    // Reset to no value by calling with a sentinel — parent Controller will reset via field.onChange
    // Actually we need to signal "cleared" — we use a workaround: call with empty new client
    // Parent will handle this via the Controller mapping
  }

  function handleNewClientEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (value?.type === "new") {
      onChange({ ...value, email: e.target.value || undefined });
    }
  }

  function handleNewClientPhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (value?.type === "new") {
      onChange({ ...value, phone: e.target.value || null });
    }
  }

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const inputDisplayValue = isLocked ? (value.name ?? "") : searchTerm;
  const showDropdown = isOpen && !isLocked;
  const showCreateOption = searchTerm.trim().length > 0;

  return (
    <div ref={containerRef} className="relative flex flex-col gap-4">
      <div className="relative">
        <Field data-invalid={!!error}>
          <FieldLabel htmlFor="client-combobox">Klient</FieldLabel>
          <div className="relative">
            <Input
              id="client-combobox"
              ref={inputRef}
              value={inputDisplayValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              readOnly={isLocked}
              placeholder="Wyszukaj lub utwórz klienta..."
              autoComplete="off"
              aria-autocomplete="list"
              aria-expanded={showDropdown}
              aria-haspopup="listbox"
              className={cn("pr-10", isLocked && "cursor-default")}
            />
            {isLocked ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                aria-label="Wyczyść wybór klienta"
              >
                <XIcon className="size-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
          {error ? (
            <p data-slot="field-error" className="text-error text-body-xs mt-1">
              {error}
            </p>
          ) : null}
        </Field>

        {showDropdown ? (
          <div
            role="listbox"
            aria-label="Lista klientów"
            className="border-border bg-popover text-popover-foreground absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border shadow-md"
          >
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => handleSelectExisting(client)}
                  className="hover:bg-accent hover:text-accent-foreground flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left transition-colors"
                >
                  <span className="text-body-sm font-medium">{client.name}</span>
                  <span className="text-mute">{client.email}</span>
                </button>
              ))
            ) : (
              <p className="text-muted-foreground px-3 py-2 text-sm">Brak pasujących klientów</p>
            )}

            {showCreateOption ? (
              <button
                type="button"
                onClick={handleCreateNew}
                className="border-border hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 border-t px-3 py-2 text-left transition-colors"
              >
                <PlusIcon className="text-primary size-4" aria-hidden="true" />
                <span className="text-body-sm">
                  Utwórz klienta: <strong>{searchTerm.trim()}</strong>
                </span>
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* New client extra fields — animated expansion */}
      <div
        className={cn(
          "grid transition-all duration-200",
          isNewClient ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
        aria-hidden={!isNewClient}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4">
            {isNewClient ? (
              <div className="bg-muted/40 border-border flex items-start gap-2 rounded-md border px-3 py-2">
                <CheckIcon className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <p className="text-body-sm text-muted-foreground">
                  Nowy klient zostanie utworzony. Podaj adres e-mail, aby wysłać mu link do projektu.
                </p>
              </div>
            ) : null}

            <Field data-invalid={false}>
              <FieldLabel htmlFor="new-client-email">
                E-mail <span className="text-error text-xs">*</span>
              </FieldLabel>
              <Input
                id="new-client-email"
                type="email"
                placeholder="jan@example.com"
                value={isNewClient ? (value.email ?? "") : ""}
                onChange={handleNewClientEmailChange}
                disabled={!isNewClient}
                tabIndex={isNewClient ? 0 : -1}
              />
            </Field>

            <Field data-invalid={false}>
              <FieldLabel htmlFor="new-client-phone">
                Telefon <span className="text-muted-foreground text-xs">(Opcjonalne)</span>
              </FieldLabel>
              <Input
                id="new-client-phone"
                type="tel"
                placeholder="+48 ..."
                value={isNewClient ? (value.phone ?? "") : ""}
                onChange={handleNewClientPhoneChange}
                disabled={!isNewClient}
                tabIndex={isNewClient ? 0 : -1}
              />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}
