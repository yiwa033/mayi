export function normalizeMonthValue(input: string): string {
  const raw = input.trim();
  if (!raw) return "";
  const match = raw.match(/^(\d{4})[-/](\d{1,2})(?:[-/]\d{1,2})?$/);
  if (match) {
    const year = match[1];
    const month = match[2].padStart(2, "0");
    return `${year}-${month}`;
  }
  const compact = raw.match(/^(\d{4})(\d{2})$/);
  if (compact) {
    return `${compact[1]}-${compact[2]}`;
  }
  return raw.slice(0, 7);
}

export function formatMonthValue(input: string): string {
  return normalizeMonthValue(input);
}
