import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Pause, Play, RotateCcw, Swords } from 'lucide-react';
import { playChime } from '../../lib/sound';
import { useProgressStore } from '../../store/useProgressStore';

const DRILL_SECONDS = 5 * 60;

export default function DrillCallout({ drill }: { drill: string }) {
  const [secondsLeft, setSecondsLeft] = useState(DRILL_SECONDS);
  const [running, setRunning] = useState(false);
  const soundEnabled = useProgressStore((s) => s.settings.soundEnabled);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          if (soundEnabled) playChime();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, soundEnabled]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const pct = 1 - secondsLeft / DRILL_SECONDS;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-transparent to-purple-500/10 p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-300 light:text-amber-700">
        <Swords className="h-4 w-4" />
        Boss challenge — whiteboard drill
      </div>
      <div className="markdown-body text-sm text-slate-200 light:text-slate-700 [&_strong]:text-amber-300 light:[&_strong]:text-amber-700">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {drill}
        </ReactMarkdown>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <span className="font-mono text-2xl tabular-nums text-slate-100 light:text-slate-900">
          {minutes}:{String(seconds).padStart(2, '0')}
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10 light:bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-400 transition-all duration-300"
            style={{ width: `${pct * 100}%` }}
          />
        </div>
        <button
          onClick={() => setRunning((r) => !r)}
          className="flex items-center gap-1.5 rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-500/30 light:bg-amber-100 light:text-amber-800 light:hover:bg-amber-200"
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {running ? 'Pause' : secondsLeft === DRILL_SECONDS ? 'Start 5 min' : 'Resume'}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setSecondsLeft(DRILL_SECONDS);
          }}
          title="Reset"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-slate-100 light:hover:bg-slate-100 light:hover:text-slate-900"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
