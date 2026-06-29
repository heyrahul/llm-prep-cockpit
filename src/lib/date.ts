function keyFor(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayKey(): string {
  return keyFor(new Date());
}

export function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return keyFor(d);
}

export function daysAgoKey(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return keyFor(d);
}
