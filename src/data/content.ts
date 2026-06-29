import raw from './content.json';
import type { StudyContent } from '../types';

export const content = raw as StudyContent;
export const modules = content.modules.slice().sort((a, b) => a.order - b.order);
export const notes = content.notes;
