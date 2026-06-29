import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import type { FlatQuestion } from '../../lib/stats';

interface Props {
  question: FlatQuestion;
  flipped: boolean;
  onFlip: () => void;
}

export default function FocusFlashcard({ question, flipped, onFlip }: Props) {
  return (
    <div className="h-64 w-full [perspective:1200px] sm:h-72">
      <motion.div
        className="relative h-full w-full cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        onClick={onFlip}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center [backface-visibility:hidden]">
          <HelpCircle className="h-6 w-6 text-cyan-400" />
          <p className="text-lg font-medium text-slate-100 light:text-slate-800">{question.text}</p>
          <span className="text-xs text-slate-500">
            {question.moduleEmoji} {question.moduleTitle} · click or press space to flip
          </span>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-3xl border border-white/10 bg-slate-900/90 p-8 text-center [backface-visibility:hidden] [transform:rotateY(180deg)] light:bg-white/95">
          <p className="text-sm text-slate-400">Self-rate out loud, then pick below</p>
          <p className="text-xs text-slate-500">(active recall — no answer key, that's the point)</p>
        </div>
      </motion.div>
    </div>
  );
}
