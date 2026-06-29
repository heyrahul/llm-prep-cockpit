import type { ItemStatus, Module, Question, StudyContent, Topic } from '../types';

export type ModuleState = 'not-started' | 'in-progress' | 'mastered';

export function moduleProgress(module: Module, topicStatus: Record<string, ItemStatus>) {
  const total = module.topics.length;
  const mastered = module.topics.filter((t) => topicStatus[t.id] === 'mastered').length;
  return { mastered, total, pct: total === 0 ? 0 : mastered / total };
}

export function moduleState(module: Module, topicStatus: Record<string, ItemStatus>): ModuleState {
  if (module.topics.length === 0) return 'not-started';
  const { mastered, total } = moduleProgress(module, topicStatus);
  if (mastered === total) return 'mastered';
  const anyStarted = module.topics.some((t) => (topicStatus[t.id] ?? 'not-started') !== 'not-started');
  return anyStarted ? 'in-progress' : 'not-started';
}

export function overallProgress(content: StudyContent, topicStatus: Record<string, ItemStatus>) {
  const allTopicsList = content.modules.flatMap((m) => m.topics);
  if (allTopicsList.length === 0) return 0;
  const mastered = allTopicsList.filter((t) => topicStatus[t.id] === 'mastered').length;
  return mastered / allTopicsList.length;
}

export function trackProgress(content: StudyContent, topicStatus: Record<string, ItemStatus>, track: 'A' | 'B') {
  const topics = content.modules.filter((m) => m.track === track).flatMap((m) => m.topics);
  if (topics.length === 0) return 0;
  const mastered = topics.filter((t) => topicStatus[t.id] === 'mastered').length;
  return mastered / topics.length;
}

export interface FlatTopic extends Topic {
  moduleId: string;
  moduleTitle: string;
  moduleEmoji: string;
}

export function allTopicsFlat(content: StudyContent): FlatTopic[] {
  return content.modules.flatMap((m) =>
    m.topics.map((t) => ({ ...t, moduleId: m.id, moduleTitle: m.title, moduleEmoji: m.emoji })),
  );
}

export interface FlatQuestion extends Question {
  moduleId: string;
  moduleTitle: string;
  moduleEmoji: string;
  track: 'A' | 'B';
}

export function allQuestionsFlat(content: StudyContent): FlatQuestion[] {
  return content.modules.flatMap((m) =>
    m.unlocks.map((q) => ({ ...q, moduleId: m.id, moduleTitle: m.title, moduleEmoji: m.emoji, track: m.track })),
  );
}
