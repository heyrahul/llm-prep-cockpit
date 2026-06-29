import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ItemStatus, StudyContent } from '../types';
import { decryptContent, hashPassphrase } from '../lib/crypto';
import { scheduleNext, type Rating, type SrsEntry } from '../lib/srs';
import { levelForXp, XP_QUESTION_GOT_IT, XP_TOPIC_MASTERED, type Level } from '../lib/xp';
import { todayKey, yesterdayKey } from '../lib/date';
import { playChime, playTick } from '../lib/sound';
import { burstConfetti } from '../lib/confetti';

const STATUS_CYCLE: ItemStatus[] = ['not-started', 'learning', 'shaky', 'mastered'];

export interface StreakState {
  count: number;
  lastActiveDate: string | null;
  history: string[]; // YYYY-MM-DD days the user was active, for the heatmap
  lastCelebratedMilestone: number;
}

export interface Settings {
  theme: 'dark' | 'light';
  soundEnabled: boolean;
}

export interface ExportedProgress {
  exportedAt: string;
  xp: number;
  topicStatus: Record<string, ItemStatus>;
  questionSrs: Record<string, SrsEntry>;
  streak: StreakState;
  settings: Settings;
}

interface ProgressState {
  unlocked: boolean;
  content: StudyContent | null;
  passphraseHash: string | null;

  xp: number;
  topicStatus: Record<string, ItemStatus>;
  questionSrs: Record<string, SrsEntry>;
  streak: StreakState;
  settings: Settings;
  pendingLevelUp: Level | null;
  lastCompletedModuleId: string | null;

  unlock: (passphrase: string) => Promise<{ ok: boolean; error?: string }>;
  lock: () => void;
  touchStreak: () => void;
  cycleTopicStatus: (topicId: string) => void;
  setTopicStatus: (topicId: string, status: ItemStatus) => void;
  rateQuestion: (questionId: string, rating: Rating) => void;
  toggleTheme: () => void;
  toggleSound: () => void;
  clearLevelUp: () => void;
  clearCompletedModule: () => void;
  exportProgress: () => string;
  importProgress: (json: string) => { ok: boolean; error?: string };
}

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      unlocked: false,
      content: null,
      passphraseHash: null,

      xp: 0,
      topicStatus: {},
      questionSrs: {},
      streak: { count: 0, lastActiveDate: null, history: [], lastCelebratedMilestone: 0 },
      settings: { theme: 'dark', soundEnabled: true },
      pendingLevelUp: null,
      lastCompletedModuleId: null,

      unlock: async (passphrase) => {
        const storedHash = get().passphraseHash;
        if (storedHash) {
          const attemptHash = await hashPassphrase(passphrase);
          if (attemptHash !== storedHash) {
            return { ok: false, error: 'Wrong passphrase.' };
          }
        }
        try {
          const content = await decryptContent(passphrase);
          const hash = storedHash ?? (await hashPassphrase(passphrase));
          set({ unlocked: true, content, passphraseHash: hash });
          get().touchStreak();
          return { ok: true };
        } catch {
          return { ok: false, error: 'Wrong passphrase.' };
        }
      },

      lock: () => set({ unlocked: false, content: null }),

      touchStreak: () => {
        const today = todayKey();
        const yesterday = yesterdayKey();
        set((state) => {
          if (state.streak.lastActiveDate === today) return state;
          const continued = state.streak.lastActiveDate === yesterday;
          const count = continued ? state.streak.count + 1 : 1;
          const history = [...state.streak.history, today].slice(-120);

          const hitMilestone = STREAK_MILESTONES.find(
            (m) => m === count && m > state.streak.lastCelebratedMilestone,
          );
          if (hitMilestone && state.settings.soundEnabled) {
            burstConfetti();
            playChime();
          }

          return {
            streak: {
              count,
              lastActiveDate: today,
              history,
              lastCelebratedMilestone: hitMilestone ?? state.streak.lastCelebratedMilestone,
            },
          };
        });
      },

      cycleTopicStatus: (topicId) => {
        const current = get().topicStatus[topicId] ?? 'not-started';
        const nextIndex = (STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length;
        get().setTopicStatus(topicId, STATUS_CYCLE[nextIndex]);
      },

      setTopicStatus: (topicId, status) => {
        const state = get();
        const wasMastered = state.topicStatus[topicId] === 'mastered';
        const xpDelta = !wasMastered && status === 'mastered' ? XP_TOPIC_MASTERED : 0;

        if (state.settings.soundEnabled) playTick();

        const newXp = state.xp + xpDelta;
        const prevLevel = levelForXp(state.xp);
        const newLevel = levelForXp(newXp);

        let completedModuleId: string | null = null;
        if (xpDelta > 0 && state.content) {
          const owningModule = state.content.modules.find((m) => m.topics.some((t) => t.id === topicId));
          if (owningModule) {
            const allMastered = owningModule.topics.every((t) =>
              t.id === topicId ? true : state.topicStatus[t.id] === 'mastered',
            );
            if (allMastered) completedModuleId = owningModule.id;
          }
        }

        if (completedModuleId && state.settings.soundEnabled) burstConfetti();

        set({
          topicStatus: { ...state.topicStatus, [topicId]: status },
          xp: newXp,
          pendingLevelUp: newLevel.level > prevLevel.level ? newLevel : state.pendingLevelUp,
          lastCompletedModuleId: completedModuleId ?? state.lastCompletedModuleId,
        });
      },

      rateQuestion: (questionId, rating) => {
        const state = get();
        const previous = state.questionSrs[questionId];
        const isFirstGotIt = !previous && rating === 'got-it';
        const entry = scheduleNext(previous, rating);

        if (state.settings.soundEnabled) playTick();

        const newXp = state.xp + (isFirstGotIt ? XP_QUESTION_GOT_IT : 0);
        const prevLevel = levelForXp(state.xp);
        const newLevel = levelForXp(newXp);

        set({
          questionSrs: { ...state.questionSrs, [questionId]: entry },
          xp: newXp,
          pendingLevelUp: newLevel.level > prevLevel.level ? newLevel : state.pendingLevelUp,
        });
      },

      toggleTheme: () =>
        set((state) => ({ settings: { ...state.settings, theme: state.settings.theme === 'dark' ? 'light' : 'dark' } })),

      toggleSound: () => set((state) => ({ settings: { ...state.settings, soundEnabled: !state.settings.soundEnabled } })),

      clearLevelUp: () => set({ pendingLevelUp: null }),
      clearCompletedModule: () => set({ lastCompletedModuleId: null }),

      exportProgress: () => {
        const state = get();
        const payload: ExportedProgress = {
          exportedAt: new Date().toISOString(),
          xp: state.xp,
          topicStatus: state.topicStatus,
          questionSrs: state.questionSrs,
          streak: state.streak,
          settings: state.settings,
        };
        return JSON.stringify(payload, null, 2);
      },

      importProgress: (json) => {
        try {
          const parsed = JSON.parse(json) as Partial<ExportedProgress>;
          if (typeof parsed.xp !== 'number' || typeof parsed.topicStatus !== 'object') {
            return { ok: false, error: 'That file does not look like a progress export.' };
          }
          set({
            xp: parsed.xp,
            topicStatus: parsed.topicStatus ?? {},
            questionSrs: parsed.questionSrs ?? {},
            streak: parsed.streak ?? { count: 0, lastActiveDate: null, history: [], lastCelebratedMilestone: 0 },
            settings: parsed.settings ?? { theme: 'dark', soundEnabled: true },
          });
          return { ok: true };
        } catch {
          return { ok: false, error: 'Could not parse that file as JSON.' };
        }
      },
    }),
    {
      name: 'llm-prep-cockpit:progress',
      version: 1,
    },
  ),
);
