import { UserButton } from "@clerk/nextjs";
import { Header, SidebarTrigger } from "@szum-tech/design-system";

export function AppHeader() {
  return (
    <Header variant="full">
      <div className="inline-flex w-full items-center gap-x-2">
        <SidebarTrigger />
        <div className="flex-1" />
        <UserButton />
      </div>
    </Header>
  );
}
