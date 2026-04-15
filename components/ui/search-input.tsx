"use client";

import * as React from "react";

import { Input } from "@szum-tech/design-system";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SearchInputProps = {
  defaultValue: string;
  placeholder: string;
  className?: string;
};

export function SearchInput({ defaultValue, placeholder, className }: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = React.useState(defaultValue);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(null);

  const pushSearch = React.useCallback(
    (search: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }
      params.delete("page");
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [router, pathname, searchParams]
  );

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        pushSearch(newValue);
      }, 300);
    },
    [pushSearch]
  );

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Input
      type="search"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      className={className ?? "max-w-60 min-w-40"}
    />
  );
}
