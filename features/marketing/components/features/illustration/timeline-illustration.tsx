import { Check, CheckCircle2, Settings2 } from "lucide-react";

export function TimelineIllustration() {
  return (
    <div className="relative rounded-2xl bg-slate-200 p-2 shadow-2xl dark:bg-slate-800">
      <div className="aspect-[16/10] overflow-hidden rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
        {/* Browser header */}
        <div className="flex h-10 items-center gap-2 border-b border-slate-200 px-4 dark:border-slate-800">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-red-400" />
            <div className="size-3 rounded-full bg-yellow-400" />
            <div className="size-3 rounded-full bg-green-400" />
          </div>
          <div className="mx-4 flex h-6 flex-1 items-center rounded bg-slate-100 px-2 text-[10px] text-slate-400 dark:bg-slate-800">
            app.craftflow.pl/projekty/renowacja-biurka
          </div>
        </div>
        {/* Content */}
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-foreground text-heading-h4 font-bold">Oś Czasu Projektu</h3>
            <button className="bg-primary rounded-lg px-3 py-1.5 text-xs font-bold text-white">Zakończ etap</button>
          </div>
          {/* Timeline */}
          <div className="relative space-y-6 before:absolute before:top-2 before:bottom-0 before:left-[11px] before:w-0.5 before:bg-slate-100 before:content-[''] dark:before:bg-slate-800">
            {/* Completed step with images */}
            <div className="relative flex gap-4">
              <div className="z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                <Check className="size-3" aria-hidden="true" />
              </div>
              <div className="flex-1 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <p className="text-foreground text-sm font-bold">Czyszczenie i szlifowanie</p>
                  <span className="text-muted-foreground text-[10px]">Wczoraj</span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
                    <Settings2 className="size-8 text-slate-400" aria-hidden="true" />
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
                    <CheckCircle2 className="size-8 text-slate-300" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
            {/* In progress step */}
            <div className="relative flex gap-4">
              <div className="bg-primary z-10 flex size-6 shrink-0 items-center justify-center rounded-full text-white ring-4 ring-white dark:ring-slate-900">
                <div className="size-2 animate-pulse rounded-full bg-white" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-foreground text-sm font-bold">Nakładanie bejcy (W trakcie)</p>
                  <div className="text-primary">
                    <Settings2 className="size-4" aria-hidden="true" />
                  </div>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">Status: Klient oczekuje na zdjęcia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
