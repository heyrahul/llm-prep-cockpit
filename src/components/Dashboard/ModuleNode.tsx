import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import type { Module } from '../../types';
import type { ModuleState } from '../../lib/stats';

const STATE_RING: Record<ModuleState, string> = {
  'not-started': 'ring-white/10',
  'in-progress': 'ring-cyan-400/60',
  mastered: 'ring-emerald-400/70',
};

const STATE_BG: Record<ModuleState, string> = {
  'not-started': 'bg-white/5 text-slate-300',
  'in-progress': 'bg-cyan-500/10 text-cyan-200',
  mastered: 'bg-emerald-500/10 text-emerald-200',
};

interface Props {
  module: Module;
  state: ModuleState;
  pct: number;
}

export default function ModuleNode({ module, state, pct }: Props) {
  return (
    <Link to={`/module/${module.id}`} className="group flex w-24 flex-shrink-0 flex-col items-center gap-2 sm:w-28">
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className={`relative flex h-16 w-16 items-center justify-center rounded-2xl ring-2 sm:h-20 sm:w-20 ${STATE_RING[state]} ${STATE_BG[state]} ${
          module.isHero ? 'shadow-[0_0_24px_rgba(168,85,247,0.5)]' : ''
        }`}
      >
        <span className="text-2xl sm:text-3xl">{module.emoji}</span>
        {state === 'mastered' && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-slate-950">
            <Check className="h-3 w-3" />
          </span>
        )}
        {module.isHero && (
          <span className="absolute -bottom-1.5 rounded-full bg-purple-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
            BOSS
          </span>
        )}
      </motion.div>
      <div className="text-center">
        <p className="line-clamp-2 text-[11px] font-medium leading-tight text-slate-300 group-hover:text-slate-100 light:text-slate-600">
          {module.title}
        </p>
        <p className="text-[10px] text-slate-500">{Math.round(pct * 100)}%</p>
      </div>
    </Link>
  );
}
