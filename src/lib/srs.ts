export type Rating = 'got-it' | 'shaky';

export interface SrsEntry {
  rating: Rating;
  repetition: number;
  dueAt: number;
  lastReviewedAt: number;
}

const SHAKY_RESURFACE_MS = 10 * 60 * 1000; // 10 minutes — resurface soon
const GOT_IT_INTERVALS_DAYS = [1, 3, 7, 14, 30, 60];

export function scheduleNext(previous: SrsEntry | undefined, rating: Rating): SrsEntry {
  const now = Date.now();
  if (rating === 'shaky') {
    return { rating, repetition: 0, lastReviewedAt: now, dueAt: now + SHAKY_RESURFACE_MS };
  }
  const repetition = (previous?.rating === 'got-it' ? previous.repetition : 0) + 1;
  const days = GOT_IT_INTERVALS_DAYS[Math.min(repetition - 1, GOT_IT_INTERVALS_DAYS.length - 1)];
  return { rating, repetition, lastReviewedAt: now, dueAt: now + days * 24 * 60 * 60 * 1000 };
}

export function isDue(entry: SrsEntry | undefined): boolean {
  if (!entry) return true;
  return Date.now() >= entry.dueAt;
}
