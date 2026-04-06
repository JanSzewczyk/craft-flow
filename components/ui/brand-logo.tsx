import { cn } from "@szum-tech/design-system/utils";

export function BrandLogo() {
  return (
    <div className="text-primary flex items-center gap-2">
      <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded">
        <svg className="size-5" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
        </svg>
      </div>
      <span className="text-body-xl text-foreground font-semibold">CraftFlow</span>
    </div>
  );
}
export function CraftFlowLogo() {
  return (
    <div
      className={cn("bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded")}
    >
      <svg className="size-5" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
      </svg>
    </div>
  );
}
