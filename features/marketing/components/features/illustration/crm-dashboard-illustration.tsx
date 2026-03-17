import { Award, Plus, Search, Star, Clock, Sprout } from "lucide-react";

const CUSTOMERS = [
  {
    name: "Anna Kowalska",
    status: "Stały Klient",
    statusIcon: Star,
    statusColor: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    lastProject: "Renowacja szafy",
    value: "4 200 PLN"
  },
  {
    name: "Jan Nowak",
    status: "W trakcie",
    statusIcon: Clock,
    statusColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    lastProject: "Stół dębowy Loft",
    value: "7 800 PLN"
  },
  {
    name: "Katarzyna Zielona",
    status: "Nowy",
    statusIcon: Sprout,
    statusColor: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
    lastProject: "Wycena: Krzesła",
    value: "--"
  },
  {
    name: "Marek Wiśniewski",
    status: "Stały Klient",
    statusIcon: Star,
    statusColor: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    lastProject: "Kuchnia na wymiar",
    value: "28 500 PLN"
  }
] as const;

export function CrmDashboardIllustration() {
  return (
    <div className="relative rounded-2xl bg-slate-200 p-2 shadow-2xl dark:bg-slate-800">
      <div className="aspect-[16/10] overflow-hidden rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
        {/* Header */}
        <div className="flex h-10 items-center justify-between border-b border-slate-200 bg-slate-50 px-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <Award className="text-primary size-4" aria-hidden="true" />
            <span className="text-foreground text-xs font-bold">Baza Klientów</span>
          </div>
          <div className="flex gap-2">
            <div className="flex size-6 items-center justify-center rounded bg-slate-200 dark:bg-slate-800">
              <Search className="size-3 text-slate-400" aria-hidden="true" />
            </div>
            <div className="bg-primary flex size-6 items-center justify-center rounded text-white">
              <Plus className="size-3" aria-hidden="true" />
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-muted-foreground border-b border-slate-100 dark:border-slate-800">
                <th className="pb-2 font-medium">Klient</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Ostatnia realizacja</th>
                <th className="pb-2 text-right font-medium">Wartość</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {CUSTOMERS.map((customer) => {
                const StatusIcon = customer.statusIcon;
                return (
                  <tr key={customer.name}>
                    <td className="text-foreground py-3 font-bold">{customer.name}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-bold ${customer.statusColor}`}
                      >
                        <StatusIcon className="size-[10px]" aria-hidden="true" /> {customer.status}
                      </span>
                    </td>
                    <td className="text-muted-foreground py-3">{customer.lastProject}</td>
                    <td className="text-foreground py-3 text-right font-bold">{customer.value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
