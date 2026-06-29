export interface Level {
  level: number;
  title: string;
  minXp: number;
}

export const LEVELS: Level[] = [
  { level: 1, title: 'Prompt Apprentice', minXp: 0 },
  { level: 2, title: 'Token Tinkerer', minXp: 150 },
  { level: 3, title: 'RAG Wrangler', minXp: 400 },
  { level: 4, title: 'Agent Architect', minXp: 800 },
  { level: 5, title: 'Eval Sentinel', minXp: 1300 },
  { level: 6, title: 'Serving Strategist', minXp: 1900 },
  { level: 7, title: 'LLM Engineer', minXp: 2600 },
];

export const XP_TOPIC_MASTERED = 10;
export const XP_QUESTION_GOT_IT = 8;

export function levelForXp(xp: number): Level {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.minXp) current = l;
  }
  return current;
}

export function nextLevel(xp: number): Level | null {
  const current = levelForXp(xp);
  const idx = LEVELS.findIndex((l) => l.level === current.level);
  return LEVELS[idx + 1] ?? null;
}

export function progressToNextLevel(xp: number): number {
  const current = levelForXp(xp);
  const next = nextLevel(xp);
  if (!next) return 1;
  return (xp - current.minXp) / (next.minXp - current.minXp);
}
