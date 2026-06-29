import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Check, BookOpen, ChevronDown, CircleDashed, Zap } from 'lucide-react';
import type { ItemStatus, Topic } from '../../types';
import { useProgressStore } from '../../store/useProgressStore';

const STATUS_META: Record<ItemStatus, { label: string; classes: string; Icon: typeof Check }> = {
  'not-started': {
    label: 'Not started',
    classes: 'border-white/10 bg-white/5 text-slate-400 light:border-slate-300 light:bg-slate-100 light:text-slate-500',
    Icon: CircleDashed,
  },
  learning: {
    label: 'Learning',
    classes: 'border-cyan-400/40 bg-cyan-500/10 text-cyan-300 light:border-cyan-400/60 light:bg-cyan-100 light:text-cyan-700',
    Icon: BookOpen,
  },
  shaky: {
    label: 'Shaky',
    classes: 'border-amber-400/40 bg-amber-500/10 text-amber-300 light:border-amber-400/60 light:bg-amber-100 light:text-amber-700',
    Icon: Zap,
  },
  mastered: {
    label: 'Mastered',
    classes:
      'border-emerald-400/40 bg-emerald-500/10 text-emerald-300 light:border-emerald-400/60 light:bg-emerald-100 light:text-emerald-700',
    Icon: Check,
  },
};

export default function TopicChecklist({ topics }: { topics: Topic[] }) {
  const topicStatus = useProgressStore((s) => s.topicStatus);
  const cycleTopicStatus = useProgressStore((s) => s.cycleTopicStatus);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <ul className="space-y-2">
      {topics.map((topic) => {
        const status = topicStatus[topic.id] ?? 'not-started';
        const meta = STATUS_META[status];
        const isOpen = expanded.has(topic.id);
        return (
          <li key={topic.id} className="row-item overflow-hidden">
            <div className="flex w-full items-center gap-3 px-3.5 py-2.5">
              <button
                onClick={() => toggleExpanded(topic.id)}
                className="flex flex-1 items-center gap-2 text-left"
                aria-expanded={isOpen}
              >
                <ChevronDown
                  className={`h-3.5 w-3.5 flex-shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
                <span className="text-sm text-slate-200 light:text-slate-700">{topic.label}</span>
              </button>
              <button
                onClick={() => cycleTopicStatus(topic.id)}
                className="flex-shrink-0"
                title="Click to change status"
              >
                <motion.span
                  key={status}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${meta.classes}`}
                >
                  <meta.Icon className="h-3 w-3" />
                  {meta.label}
                </motion.span>
              </button>
            </div>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="markdown-body border-t border-white/5 px-3.5 py-3 text-sm text-slate-300 light:border-slate-200 light:text-slate-700 [&_strong]:text-cyan-300 light:[&_strong]:text-cyan-700">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                      {topic.explanation}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
