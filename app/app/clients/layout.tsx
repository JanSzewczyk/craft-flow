import * as React from "react";

export default function ClientsLayout({ children, sheet }: { children: React.ReactNode; sheet: React.ReactNode }) {
  return (
    <>
      {children}
      {sheet}
    </>
  );
}
