import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Swords, ThumbsDown, ThumbsUp, TimerReset } from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';
import { allQuestionsFlat, type FlatQuestion } from '../../lib/stats';
import { shuffle } from '../../lib/shuffle';

type Phase = 'setup' | 'running' | 'summary';
type Outcome = 'got-it' | 'shaky' | 'skipped';

export default function MockRoundMode() {
  const content = useProgressStore((s) => s.content);
  const rateQuestion = useProgressStore((s) => s.rateQuestion);
  const allQuestions = useMemo(() => (content ? allQuestionsFlat(content) : []), [content]);

  const [moduleId, setModuleId] = useState('all');
  const [count, setCount] = useState(8);
  const [perQuestionSeconds, setPerQuestionSeconds] = useState(60);

  const [phase, setPhase] = useState<Phase>('setup');
  const [round, setRound] = useState<FlatQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(perQuestionSeconds);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);

  const pool = moduleId === 'all' ? allQuestions : allQuestions.filter((q) => q.moduleId === moduleId);

  function start() {
    const picked = shuffle(pool).slice(0, Math.min(count, pool.length));
    setRound(picked);
    setOutcomes([]);
    setIndex(0);
    setSecondsLeft(perQuestionSeconds);
    setPhase('running');
  }

  function record(outcome: Outcome) {
    const current = round[index];
    if (current && outcome !== 'skipped') rateQuestion(current.id, outcome);
    const nextOutcomes = [...outcomes, outcome];
    setOutcomes(nextOutcomes);
    if (index + 1 < round.length) {
      setIndex(index + 1);
      setSecondsLeft(perQuestionSeconds);
    } else {
      setPhase('summary');
    }
  }

  useEffect(() => {
    if (phase !== 'running') return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          record('skipped');
          return perQuestionSeconds;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index]);

  if (!content) return null;

  if (phase === 'setup') {
    return (
      <div className="mx-auto max-w-md space-y-5">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-slate-100 light:text-slate-900">
            <Swords className="h-5 w-5 text-amber-400" /> Mock round
          </h1>
          <p className="text-sm text-slate-400">N random questions, back-to-back, against the clock.</p>
        </div>

        <div className="glass-card space-y-4 p-5">
          <label className="block">
            <span className="mb-1 block text-xs text-slate-400">Module</span>
            <select
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
            >
              <option value="all">All modules</option>
              {content.modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.emoji} {m.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs text-slate-400">Number of questions: {count}</span>
            <input
              type="range"
              min={3}
              max={20}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs text-slate-400">Seconds per question: {perQuestionSeconds}</span>
            <input
              type="range"
              min={20}
              max={120}
              step={10}
              value={perQuestionSeconds}
              onChange={(e) => setPerQuestionSeconds(Number(e.target.value))}
              className="w-full"
            />
          </label>

          <button
            onClick={start}
            disabled={pool.length === 0}
            className="w-full rounded-lg bg-gradient-to-r from-amber-400 to-rose-400 px-4 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            Start mock round
          </button>
          {pool.length === 0 && <p className="text-xs text-rose-400">No questions available for this module.</p>}
        </div>
      </div>
    );
  }

  if (phase === 'running') {
    const current = round[index];
    const pct = secondsLeft / perQuestionSeconds;
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>
            Question {index + 1} / {round.length}
          </span>
          <span className="font-mono text-lg tabular-nums text-amber-300">{secondsLeft}s</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-400 transition-all duration-300"
            style={{ width: `${pct * 100}%` }}
          />
        </div>

        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card flex min-h-56 flex-col items-center justify-center gap-3 p-8 text-center"
        >
          <p className="text-lg font-medium text-slate-100 light:text-slate-800">{current.text}</p>
          <span className="text-xs text-slate-500">
            {current.moduleEmoji} {current.moduleTitle}
          </span>
        </motion.div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => record('shaky')}
            className="flex items-center gap-2 rounded-xl bg-amber-500/15 px-5 py-2.5 text-sm font-medium text-amber-300 hover:bg-amber-500/25"
          >
            <ThumbsDown className="h-4 w-4" /> Shaky
          </button>
          <button
            onClick={() => record('got-it')}
            className="flex items-center gap-2 rounded-xl bg-emerald-500/15 px-5 py-2.5 text-sm font-medium text-emerald-300 hover:bg-emerald-500/25"
          >
            <ThumbsUp className="h-4 w-4" /> Got it
          </button>
        </div>
      </div>
    );
  }

  const gotIt = outcomes.filter((o) => o === 'got-it').length;
  const shaky = outcomes.filter((o) => o === 'shaky').length;
  const skipped = outcomes.filter((o) => o === 'skipped').length;

  return (
    <div className="mx-auto max-w-md space-y-5 text-center">
      <h1 className="text-xl font-bold text-slate-100 light:text-slate-900">Round complete</h1>
      <div className="glass-card grid grid-cols-3 gap-3 p-5">
        <div>
          <p className="text-2xl font-bold text-emerald-300">{gotIt}</p>
          <p className="text-xs text-slate-400">Got it</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-amber-300">{shaky}</p>
          <p className="text-xs text-slate-400">Shaky</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-400">{skipped}</p>
          <p className="text-xs text-slate-400">Skipped</p>
        </div>
      </div>
      <button
        onClick={() => setPhase('setup')}
        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 px-4 py-2.5 text-sm font-medium text-slate-950"
      >
        <TimerReset className="h-4 w-4" /> Run another round
      </button>
    </div>
  );
}
