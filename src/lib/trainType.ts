const PREFIX_RE = /^[A-Za-zÀ-ÖØ-öø-ÿ]+/;

function prefix(trainNumber: string): string | null {
  const match = trainNumber.match(PREFIX_RE);
  return match ? match[0].toUpperCase() : null;
}

export function trainTypeLabel(trainNumber: string): string {
  return prefix(trainNumber) ?? "TRAIN";
}

export function trainTypeColor(trainNumber: string): string {
  const p = prefix(trainNumber);
  if (p === "ICE") return "var(--brass-amber)";
  if (p === "EC" || p === "IC") return "var(--steel-blue)";
  return "var(--rust-vermilion)";
}
