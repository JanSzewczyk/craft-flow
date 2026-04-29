"use client";

import * as React from "react";

import { XIcon } from "lucide-react";

import { Field, FieldLabel, Input } from "@szum-tech/design-system";
import { cn } from "@szum-tech/design-system/utils";
import { type Client } from "~/features/crm/server/db/schema";

type ClientComboboxProps = {
  clients: Client[];
  value: string | null;
  displayName: string;
  onChange: (clientId: string | null, clientName: string) => void;
  error?: string;
};

export function ClientCombobox({ clients, value, displayName, onChange, error }: ClientComboboxProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const isSelected = value !== null;

  const filteredClients = React.useMemo(() => {
    if (!searchTerm.trim()) return clients;
    const lower = searchTerm.toLowerCase();
    return clients.filter((c) => c.name.toLowerCase().includes(lower) || c.email.toLowerCase().includes(lower));
  }, [clients, searchTerm]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  }

  function handleSelect(client: Client) {
    onChange(client.id, client.name);
    setSearchTerm(client.name);
    setIsOpen(false);
  }

  function handleClear() {
    onChange(null, "");
    setSearchTerm("");
    setIsOpen(false);
  }

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const inputValue = isSelected ? displayName : searchTerm;

  return (
    <div ref={containerRef} className="relative">
      <Field data-invalid={!!error}>
        <FieldLabel htmlFor="client-combobox">Klient</FieldLabel>
        <div className="relative">
          <Input
            id="client-combobox"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => {
              if (!isSelected) setIsOpen(true);
            }}
            readOnly={isSelected}
            placeholder="Wyszukaj klienta..."
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={isOpen && !isSelected}
            aria-haspopup="listbox"
            className={cn("pr-10", isSelected && "cursor-default")}
          />
          {isSelected ? (
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

      {isOpen && !isSelected ? (
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
                onClick={() => handleSelect(client)}
                className="hover:bg-accent hover:text-accent-foreground flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left transition-colors"
              >
                <span className="text-body-sm font-medium">{client.name}</span>
                <span className="text-muted-foreground text-body-xs">{client.email}</span>
              </button>
            ))
          ) : (
            <p className="text-muted-foreground px-3 py-2 text-sm">Brak pasujących klientów</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
