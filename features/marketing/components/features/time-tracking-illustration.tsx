import { BarChart3, Calendar, Clock } from "lucide-react";

export function TimeTrackingIllustration() {
  return (
    <div className="flex min-h-[400px] flex-col bg-white p-6">
      {/* Dashboard header */}
      <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="text-body-sm font-semibold text-foreground">Dashboard</h3>
          <p className="text-body-xs text-muted-foreground">Marzec 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" aria-hidden="true" />
        </div>
      </div>

      {/* 3 Empty cards */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded border border-border bg-white p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span className="text-body-xs">Czas pracy</span>
          </div>
          <p className="text-heading-h3 mt-2 text-muted-foreground">--</p>
        </div>
        <div className="rounded border border-border bg-white p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            <span className="text-body-xs">Zlecenia</span>
          </div>
          <p className="text-heading-h3 mt-2 text-muted-foreground">--</p>
        </div>
        <div className="rounded border border-border bg-white p-4">
          <div className="text-body-xs text-muted-foreground">Efektywność</div>
          <p className="text-heading-h3 mt-2 text-muted-foreground">--</p>
        </div>
      </div>

      {/* Manage button */}
      <button
        className="w-full rounded bg-[#2563EB] px-4 py-2 text-[14px] font-medium text-white"
        style={{ backgroundColor: "#2563EB" }}
      >
        Zarządzaj
      </button>
    </div>
  );
}
