import { Header, Separator } from "@szum-tech/design-system";
import { ThemeToggle } from "~/components/ui/theme-toggle";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <Header>
        <div className="flex w-full items-center justify-between">
          <h1 className="text-heading-h3">Craft Flow</h1>
          <ThemeToggle />
        </div>
      </Header>

      {/* Main Content */}
      <main className="container flex-1 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-heading-h2 mb-6">Welcome to Craft Flow</h2>
          <p className="text-lead text-muted-foreground">Your modern Next.js application is ready to be built.</p>
        </div>
      </main>

      <Separator />

      {/* Footer */}
      <footer className="border-border/40 border-t py-6">
        <div className="container text-center">
          <p className="text-body-sm text-muted-foreground">© {new Date().getFullYear()} Craft Flow</p>
        </div>
      </footer>
    </div>
  );
}
