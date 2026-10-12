/**
 * Parses and validates search parameters from a raw query object.
 * Extracts `search` (trimmed string) and `page` (positive integer, defaults to 1).
 * Returns normalized values suitable for API queries or pagination.
 */
export function parseSearchParams(raw: Record<string, string | string[] | undefined>) {
  const search = typeof raw.search === "string" ? raw.search.trim() : "";
  const pageRaw = typeof raw.page === "string" ? Number.parseInt(raw.page, 10) : 1;
  const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? pageRaw : 1;
  return { search, page };
}
