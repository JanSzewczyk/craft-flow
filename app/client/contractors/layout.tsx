import * as React from "react";

export default function ContractorsLayout({ children, sheet }: { children: React.ReactNode; sheet: React.ReactNode }) {
  return (
    <React.Fragment>
      {children}
      {sheet}
    </React.Fragment>
  );
}
