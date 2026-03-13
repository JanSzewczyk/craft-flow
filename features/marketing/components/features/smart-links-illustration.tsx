import { Lock, Link2 } from "lucide-react";

export function SmartLinksIllustration() {
  return (
    <div className="flex min-h-[400px] items-center justify-center bg-white p-6">
      {/* Smartphone mockup - black iPhone frame */}
      <div className="relative mx-auto max-w-[280px] rounded-[32px] border-4 border-black bg-white shadow-2xl">
        {/* Phone notch/camera */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-7 w-28 rounded-full bg-black" />

        {/* Phone screen - white background */}
        <div className="flex flex-col p-4 pt-10">
          {/* App header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#2563EB]/10">
                <Link2 className="text-[#2563EB] h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-body-sm font-medium text-foreground">
                Smart Linki
              </span>
            </div>
          </div>

          {/* Secure badge */}
          <div className="mb-6 rounded bg-[#10B981]/10 p-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <Lock className="text-[#10B981] h-4 w-4" aria-hidden="true" />
              <span className="text-body-xs font-medium text-[#10B981]">
                Bezpieczne połączenie
              </span>
            </div>
          </div>

          {/* Links list */}
          <div className="flex flex-col gap-3 mb-6">
            {[
              { name: "Panel klienta", icon: "user" },
              { name: "Status zlecenia", icon: "file" },
              { name: "Harmonogram", icon: "calendar" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-border bg-[#F3F4F6] p-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#2563EB]/10">
                  <span className="text-body-xs text-[#2563EB]">
                    {item.name.charAt(0)}
                  </span>
                </div>
                <span className="text-body-xs text-foreground">{item.name}</span>
              </div>
            ))}
          </div>

          {/* Login button */}
          <button
            className="w-full rounded bg-[#2563EB] px-4 py-2 text-[14px] font-medium text-white"
            style={{ backgroundColor: "#2563EB" }}
          >
            Zaloguj się
          </button>
        </div>
      </div>
    </div>
  );
}
