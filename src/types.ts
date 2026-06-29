export type ItemStatus = 'not-started' | 'learning' | 'shaky' | 'mastered';

export interface Topic {
  id: string;
  label: string;
  explanation: string;
}

export interface Question {
  id: string;
  text: string;
  answer: string;
}

export interface Module {
  id: string;
  track: 'A' | 'B';
  order: number;
  title: string;
  weeks: string;
  emoji: string;
  build: string;
  topics: Topic[];
  unlocks: Question[];
  drill: string;
  isHero?: boolean;
}

export interface Notes {
  capstone: string;
  finalWeeks: string;
}

export interface StudyContent {
  modules: Module[];
  notes: Notes;
}
