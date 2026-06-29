import type { StudyContent } from '../types';

export interface DrillPoolItem {
  type: 'drill' | 'question';
  moduleId: string;
  moduleTitle: string;
  moduleEmoji: string;
  text: string;
}

export function buildDrillPool(content: StudyContent): DrillPoolItem[] {
  const pool: DrillPoolItem[] = [];
  for (const m of content.modules) {
    pool.push({ type: 'drill', moduleId: m.id, moduleTitle: m.title, moduleEmoji: m.emoji, text: m.drill });
    for (const q of m.unlocks) {
      pool.push({ type: 'question', moduleId: m.id, moduleTitle: m.title, moduleEmoji: m.emoji, text: q.text });
    }
  }
  return pool;
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function pickDeterministic<T>(pool: T[], seed: string): T {
  return pool[hashString(seed) % pool.length];
}
