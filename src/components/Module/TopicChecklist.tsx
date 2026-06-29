import { motion } from 'framer-motion';
import { Check, BookOpen, CircleDashed, Zap } from 'lucide-react';
import type { ItemStatus, Topic } from '../../types';
import { useProgressStore } from '../../store/useProgressStore';

const STATUS_META: Record<ItemStatus, { label: string; classes: string; Icon: typeof Check }> = {
  'not-started': { label: 'Not started', classes: 'border-white/10 bg-white/5 text-slate-400', Icon: CircleDashed },
  learning: { label: 'Learning', classes: 'border-cyan-400/40 bg-cyan-500/10 text-cyan-300', Icon: BookOpen },
  shaky: { label: 'Shaky', classes: 'border-amber-400/40 bg-amber-500/10 text-amber-300', Icon: Zap },
  mastered: { label: 'Mastered', classes: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300', Icon: Check },
};

export default function TopicChecklist({ topics }: { topics: Topic[] }) {
  const topicStatus = useProgressStore((s) => s.topicStatus);
  const cycleTopicStatus = useProgressStore((s) => s.cycleTopicStatus);

  return (
    <ul className="space-y-2">
      {topics.map((topic) => {
        const status = topicStatus[topic.id] ?? 'not-started';
        const meta = STATUS_META[status];
        return (
          <li key={topic.id}>
            <button
              onClick={() => cycleTopicStatus(topic.id)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5 text-left transition hover:border-white/10 hover:bg-white/[0.05]"
            >
              <span className="text-sm text-slate-200 light:text-slate-700">{topic.label}</span>
              <motion.span
                key={status}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`flex flex-shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${meta.classes}`}
              >
                <meta.Icon className="h-3 w-3" />
                {meta.label}
              </motion.span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
