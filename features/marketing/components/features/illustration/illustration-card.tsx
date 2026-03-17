import { Card, CardContent, CardHeader, CardTitle } from "@szum-tech/design-system";
import { cn } from "@szum-tech/design-system/utils";

type IllustrationCardProps = {
  gradientClass: string;
  icon: React.ReactNode;
  cardTitle: string;
  children: React.ReactNode;
};

export function IllustrationCard({ gradientClass, icon, cardTitle, children }: IllustrationCardProps) {
  return (
    <div className={cn("relative aspect-4/3 overflow-hidden rounded-2xl bg-linear-to-br shadow-sm", gradientClass)}>
      <div className="absolute inset-0 flex items-center justify-center">{icon}</div>
      <div className="absolute right-6 bottom-6 left-6">
        <Card className="shadow-md">
          <CardHeader className="pt-4 pb-2">
            <CardTitle className="text-body-sm">{cardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
