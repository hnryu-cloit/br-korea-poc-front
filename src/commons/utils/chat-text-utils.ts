export function extractCandidateText(candidate: unknown): string | null {
  if (typeof candidate === "string") {
    const trimmed = candidate.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (!candidate || typeof candidate !== "object") return null;
  const source = candidate as Record<string, unknown>;
  for (const key of ["question", "prompt", "query", "label", "candidate", "text"]) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

export const dedupeStrings = (items: string[]): string[] =>
  Array.from(new Set(items.map((s) => s.trim()).filter(Boolean)));