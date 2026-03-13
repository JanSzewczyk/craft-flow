import { Check, User, Phone, Mail } from "lucide-react";

const CUSTOMERS = [
  { name: "Jan Kowalski", phone: "+48 123 456 789", email: "jan@example.com", status: "completed" },
  { name: "Anna Nowak", phone: "+48 987 654 321", email: "anna@example.com", status: "completed" },
  { name: "Piotr Wiśniewski", phone: "+48 555 123 456", email: "piotr@example.com", status: "in-progress" },
  { name: "Marta Zając", phone: "+48 444 789 012", email: "marta@example.com", status: "pending" },
] as const;

export function CrmDashboardIllustration() {
  return (
    <div className="flex min-h-[400px] flex-col bg-white p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-body-sm font-semibold text-foreground">Klienci</h3>
      </div>

      {/* Customer table with blue header */}
      <div className="flex-1 overflow-hidden rounded border border-border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-[#2563EB]">
              <th className="text-body-xs font-medium text-white px-3 py-2 text-left">
                Klient
              </th>
              <th className="text-body-xs font-medium text-white px-3 py-2 text-left">
                Kontakt
              </th>
              <th className="text-body-xs font-medium text-white px-3 py-2 text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {CUSTOMERS.map((customer) => (
              <tr key={customer.name} className="border-b border-border last:border-b-0">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2563EB]/10">
                      <User className="text-[#2563EB] h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                    <span className="text-body-xs text-foreground">{customer.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <Phone className="text-muted-foreground h-3 w-3" aria-hidden="true" />
                      <span className="text-body-xs text-muted-foreground">
                        {customer.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="text-muted-foreground h-3 w-3" aria-hidden="true" />
                      <span className="text-body-xs text-muted-foreground">
                        {customer.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-center">
                  <div className="flex items-center justify-center">
                    <Check className="text-[#10B981] h-4 w-4" aria-hidden="true" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
