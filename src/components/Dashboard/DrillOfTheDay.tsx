import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, Swords } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';
import { buildDrillPool, pickDeterministic } from '../../lib/dailyDrill';
import { todayKey } from '../../lib/date';

export default function DrillOfTheDay() {
  const content = useProgressStore((s) => s.content);
  const [reroll, setReroll] = useState(0);
  const pool = useMemo(() => (content ? buildDrillPool(content) : []), [content]);
  const item = useMemo(() => {
    if (pool.length === 0) return null;
    const seed = reroll === 0 ? todayKey() : `${todayKey()}-${reroll}`;
    return pickDeterministic(pool, seed);
  }, [pool, reroll]);

  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card relative overflow-hidden p-5"
    >
      <div
        aria-hidden
        className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20 blur-2xl"
      />
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
          <Swords className="h-4 w-4" />
          Drill of the day
        </div>
        <button
          onClick={() => setReroll((r) => r + 1)}
          title="Shuffle"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-slate-100"
        >
          <Shuffle className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="text-sm leading-relaxed text-slate-200 light:text-slate-700">{item.text}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>
          {item.moduleEmoji} {item.moduleTitle}
        </span>
        <Link to={`/module/${item.moduleId}`} className="font-medium text-cyan-400 hover:underline">
          Open module →
        </Link>
      </div>
    </motion.div>
  );
}
