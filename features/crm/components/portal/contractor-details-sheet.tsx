"use client";

import * as React from "react";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@szum-tech/design-system";
import { useRouter } from "next/navigation";
import { ContractorDetailsContent } from "~/features/crm/components/portal/contractor-details-content";
import { type ClientContractorListItem } from "~/features/projects/types/contractor";

type ContractorDetailsSheetProps = {
  contractor: ClientContractorListItem;
};

export function ContractorDetailsSheet({ contractor }: ContractorDetailsSheetProps) {
  const router = useRouter();

  function handleOpenChange(open: boolean) {
    if (!open) {
      setTimeout(() => {
        router.back();
      }, 200);
    }
  }

  return (
    <Sheet defaultOpen onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="overflow-y-auto sm:max-w-150">
        <SheetHeader>
          <SheetTitle>{contractor.companyName}</SheetTitle>
          <SheetDescription>ID Wykonawcy: {contractor.id.slice(0, 8)}</SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <ContractorDetailsContent contractor={contractor} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
