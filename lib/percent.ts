export function parsePercentInput(input: string | number): number {
  if (typeof input === "number") {
    if (!Number.isFinite(input)) return 0;
    if (input > 1) return input / 100;
    if (input < 0) return 0;
    return input;
  }

  const cleaned = input.replace("%", "").trim();
  if (!cleaned) return 0;
  const parsed = Number(cleaned);
  if (!Number.isFinite(parsed)) return 0;
  if (parsed > 1) return parsed / 100;
  if (parsed < 0) return 0;
  return parsed;
}

export function normalizePercentValue(input: string | number): number {
  const value = parsePercentInput(input);
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

export function formatPercentDisplay(value: number): string {
  if (!Number.isFinite(value)) return "0%";
  return `${(value * 100)
    .toFixed(4)
    .replace(/\.?0+$/, "")}%`;
}
