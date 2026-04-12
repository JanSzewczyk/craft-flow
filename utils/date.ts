/**
 * Formats a date as a human-readable relative time string in Polish.
 *
 * Examples: "Przed chwilą", "5 min temu", "3 godz. temu", "2 dn. temu", "12 sty"
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMinutes < 1) return "Przed chwilą";
  if (diffMinutes < 60) return `${diffMinutes} min temu`;
  if (diffHours < 24) return `${diffHours} godz. temu`;
  if (diffDays < 7) return `${diffDays} dn. temu`;
  return new Date(date).toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
}
