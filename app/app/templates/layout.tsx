import * as React from "react";

export default function TemplatesLayout({ children, sheet }: { children: React.ReactNode; sheet: React.ReactNode }) {
  return (
    <>
      {children}
      {sheet}
    </>
  );
}
