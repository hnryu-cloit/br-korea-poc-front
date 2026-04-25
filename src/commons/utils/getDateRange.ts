export function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDateRange(referenceDateTime: string): { from: string; to: string } {
  const referenceDate = new Date(referenceDateTime);
  if (Number.isNaN(referenceDate.getTime())) {
    const fallback = new Date();
    const to = new Date(fallback);
    to.setDate(to.getDate() - 1);
    const from = new Date(to);
    from.setDate(from.getDate() - 6);

    return {
      from: formatLocalDate(from),
      to: formatLocalDate(to),
    };
  }

  const to = new Date(referenceDate);
  to.setDate(to.getDate() - 1);
  const from = new Date(to);
  from.setDate(from.getDate() - 6);

  return {
    from: formatLocalDate(from),
    to: formatLocalDate(to),
  };
}
