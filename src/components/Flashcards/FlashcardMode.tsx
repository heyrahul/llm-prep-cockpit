import { useEffect, useMemo, useState } from 'react';
import { Shuffle, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';
import { allQuestionsFlat, type FlatQuestion } from '../../lib/stats';
import { isDue } from '../../lib/srs';
import { shuffle } from '../../lib/shuffle';
import FocusFlashcard from './FocusFlashcard';

export default function FlashcardMode() {
  const content = useProgressStore((s) => s.content);
  const questionSrs = useProgressStore((s) => s.questionSrs);
  const rateQuestion = useProgressStore((s) => s.rateQuestion);

  const [track, setTrack] = useState<'all' | 'A' | 'B'>('all');
  const [moduleId, setModuleId] = useState('all');
  const [dueOnly, setDueOnly] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const allQuestions = useMemo(() => (content ? allQuestionsFlat(content) : []), [content]);

  const queue = useMemo(() => {
    let filtered = allQuestions;
    if (track !== 'all') filtered = filtered.filter((q) => q.track === track);
    if (moduleId !== 'all') filtered = filtered.filter((q) => q.moduleId === moduleId);
    if (dueOnly) filtered = filtered.filter((q) => isDue(questionSrs[q.id]));
    return shuffle(filtered);
    // shuffleSeed deliberately re-triggers the shuffle without changing filters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allQuestions, track, moduleId, dueOnly, shuffleSeed]);

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [track, moduleId, dueOnly, shuffleSeed]);

  if (!content) return null;
  const current: FlatQuestion | undefined = queue[index];

  function rate(rating: 'got-it' | 'shaky') {
    if (!current) return;
    rateQuestion(current.id, rating);
    setFlipped(false);
    setIndex((i) => (i + 1 < queue.length ? i + 1 : 0));
  }

  function next() {
    setFlipped(false);
    setIndex((i) => (i + 1 < queue.length ? i + 1 : 0));
  }

  function prev() {
    setFlipped(false);
    setIndex((i) => (i - 1 >= 0 ? i - 1 : Math.max(queue.length - 1, 0)));
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.target as HTMLElement).tagName === 'SELECT') return;
      if (e.key === ' ') {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key.toLowerCase() === 'g') rate('got-it');
      else if (e.key.toLowerCase() === 's') rate('shaky');
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, index]);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-100 light:text-slate-900">Flashcard mode</h1>
        <p className="text-sm text-slate-400">Active recall over every UNLOCKS question. Self-rated, no answer key.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={track}
          onChange={(e) => setTrack(e.target.value as 'all' | 'A' | 'B')}
          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-200"
        >
          <option value="all">All tracks</option>
          <option value="A">Track A — AI</option>
          <option value="B">Track B — Core eng</option>
        </select>
        <select
          value={moduleId}
          onChange={(e) => setModuleId(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-200"
        >
          <option value="all">All modules</option>
          {content.modules.map((m) => (
            <option key={m.id} value={m.id}>
              {m.emoji} {m.title}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-200">
          <input type="checkbox" checked={dueOnly} onChange={(e) => setDueOnly(e.target.checked)} />
          Due for review only
        </label>
        <button
          onClick={() => setShuffleSeed((s) => s + 1)}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-white/10"
        >
          <Shuffle className="h-3.5 w-3.5" /> Reshuffle
        </button>
      </div>

      {!current ? (
        <div className="glass-card p-8 text-center text-sm text-slate-400">
          No cards match these filters {dueOnly && '— nothing due for review right now.'}
        </div>
      ) : (
        <>
          <p className="text-center text-xs text-slate-500">
            Card {index + 1} of {queue.length}
          </p>
          <FocusFlashcard question={current} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => rate('shaky')}
              className="flex items-center gap-2 rounded-xl bg-amber-500/15 px-5 py-2.5 text-sm font-medium text-amber-300 hover:bg-amber-500/25"
            >
              <ThumbsDown className="h-4 w-4" /> Shaky <kbd className="opacity-60">S</kbd>
            </button>
            <button
              onClick={() => rate('got-it')}
              className="flex items-center gap-2 rounded-xl bg-emerald-500/15 px-5 py-2.5 text-sm font-medium text-emerald-300 hover:bg-emerald-500/25"
            >
              <ThumbsUp className="h-4 w-4" /> Got it <kbd className="opacity-60">G</kbd>
            </button>
          </div>
          <p className="text-center text-[11px] text-slate-500">
            <kbd>←</kbd> / <kbd>→</kbd> to navigate · <kbd>space</kbd> to flip
          </p>
        </>
      )}
    </div>
  );
}
