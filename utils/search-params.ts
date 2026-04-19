export function parseSearchParams(raw: Record<string, string | string[] | undefined>) {
  const search = typeof raw.search === "string" ? raw.search.trim() : "";
  const pageRaw = typeof raw.page === "string" ? Number.parseInt(raw.page, 10) : 1;
  const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? pageRaw : 1;
  return { search, page };
}
