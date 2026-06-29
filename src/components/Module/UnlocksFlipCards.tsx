import { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ThumbsDown, ThumbsUp } from 'lucide-react';
import type { Question } from '../../types';
import { useProgressStore } from '../../store/useProgressStore';

function FlipCard({ question }: { question: Question }) {
  const [flipped, setFlipped] = useState(false);
  const srs = useProgressStore((s) => s.questionSrs[question.id]);
  const rateQuestion = useProgressStore((s) => s.rateQuestion);

  const ratingBadge =
    srs?.rating === 'got-it' ? 'ring-emerald-400/50' : srs?.rating === 'shaky' ? 'ring-amber-400/50' : 'ring-white/5';

  return (
    <div className="h-40 [perspective:1000px]">
      <motion.div
        className={`relative h-full w-full cursor-pointer rounded-2xl ring-1 ${ratingBadge}`}
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.45 }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 [backface-visibility:hidden]"
        >
          <HelpCircle className="h-4 w-4 text-cyan-400" />
          <p className="line-clamp-4 text-sm text-slate-200 light:text-slate-700">{question.text}</p>
          <span className="text-[11px] text-slate-500">Tap to self-rate</span>
        </div>

        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/90 p-4 [backface-visibility:hidden] [transform:rotateY(180deg)] light:bg-white/95"
        >
          <p className="mb-1 text-center text-xs text-slate-400">How did that feel?</p>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                rateQuestion(question.id, 'got-it');
                setFlipped(false);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/25"
            >
              <ThumbsUp className="h-3.5 w-3.5" /> Got it
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                rateQuestion(question.id, 'shaky');
                setFlipped(false);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500/15 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/25"
            >
              <ThumbsDown className="h-3.5 w-3.5" /> Shaky
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function UnlocksFlipCards({ questions }: { questions: Question[] }) {
  if (questions.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No curated flashcards for this module — it's drilled through direct practice instead.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {questions.map((q) => (
        <FlipCard key={q.id} question={q} />
      ))}
    </div>
  );
}
