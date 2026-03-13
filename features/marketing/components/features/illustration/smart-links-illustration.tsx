import { User } from "lucide-react";

export function SmartLinksIllustration() {
  return (
    <div className="flex justify-center">
      {/* Smartphone mockup */}
      <div className="relative aspect-[9/19] w-[280px] rounded-[3rem] border-4 border-slate-800 bg-slate-900 p-3 shadow-2xl">
        {/* Phone notch */}
        <div className="absolute top-0 left-1/2 z-20 h-6 w-24 -translate-x-1/2 rounded-b-xl bg-slate-900" />
        {/* Phone screen */}
        <div className="flex h-full w-full flex-col overflow-hidden rounded-[2.2rem] bg-white dark:bg-slate-900">
          <div className="mt-8 flex flex-col items-center p-6 text-center">
            {/* Logo */}
            <div className="bg-primary/10 text-primary mb-4 flex size-16 items-center justify-center rounded-2xl">
              <User className="size-8" aria-hidden="true" />
            </div>
            <h4 className="text-foreground text-lg font-bold">Twój Portal Klienta</h4>
            <p className="text-muted-foreground mt-2 text-xs">
              Dzień dobry, Panie Marku! Projekt &quot;Stół Dębowy&quot; jest w fazie lakierowania.
            </p>
            {/* Progress section */}
            <div className="mt-8 w-full space-y-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-left dark:border-slate-700 dark:bg-slate-800">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-muted-foreground text-[10px] font-bold uppercase">Aktualny Status</span>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    Produkcja
                  </span>
                </div>
                {/* Progress bar */}
                <div className="flex h-3 gap-1.5">
                  <div className="bg-primary flex-1 rounded-sm" />
                  <div className="bg-primary flex-1 rounded-sm" />
                  <div className="bg-primary flex-1 rounded-sm" />
                  <div className="flex-1 rounded-sm bg-slate-200 dark:bg-slate-700" />
                  <div className="flex-1 rounded-sm bg-slate-200 dark:bg-slate-700" />
                </div>
                {/* Progress dots */}
                <div className="mt-2 flex justify-between">
                  <div className="bg-primary/40 size-2 rounded-full" />
                  <div className="bg-primary/40 size-2 rounded-full" />
                  <div className="bg-primary size-2 rounded-full" />
                  <div className="size-2 rounded-full bg-slate-100 dark:bg-slate-700" />
                  <div className="size-2 rounded-full bg-slate-100 dark:bg-slate-700" />
                </div>
              </div>
              {/* Action buttons */}
              <button className="bg-primary w-full rounded-xl py-3 text-sm font-bold text-white shadow-md">
                Zobacz zdjęcia
              </button>
              <button className="w-full rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                Opłać fakturę
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
