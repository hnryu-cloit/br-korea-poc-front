export const formatUpdatedAt = (updatedAt?: string) => {
  if (!updatedAt) return undefined;

  // 1) "YYYY-MM-DD HH:mm" (legacy)
  // 2) "YYYY-MM-DDTHH:mm:ss" (ISO-like without timezone)
  // Both are timezone-less server local strings, so render as-is without timezone conversion.
  const plainMatch = updatedAt.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/);
  if (plainMatch) return updatedAt;

  const isoNoTzMatch = updatedAt.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(:\d{2})?$/);
  if (isoNoTzMatch) {
    const [, datePart, hour, minute] = isoNoTzMatch;
    return `${datePart} ${hour}:${minute}`;
  }

  // For timestamps with timezone offset/Z, convert to client local time.
  const parsed = new Date(updatedAt);
  const date = Number.isNaN(parsed.getTime()) ? null : parsed;
  if (!date) return updatedAt;

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}`;
};
