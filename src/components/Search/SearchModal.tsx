import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useUiStore } from '../../store/useUiStore';
import { useProgressStore } from '../../store/useProgressStore';
import { allQuestionsFlat, allTopicsFlat } from '../../lib/stats';

export default function SearchModal() {
  const open = useUiStore((s) => s.searchOpen);
  const setOpen = useUiStore((s) => s.setSearchOpen);
  const content = useProgressStore((s) => s.content);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const topics = useMemo(() => (content ? allTopicsFlat(content) : []), [content]);
  const questions = useMemo(() => (content ? allQuestionsFlat(content) : []), [content]);

  const q = query.trim().toLowerCase();
  const moduleResults = q
    ? (content?.modules ?? []).filter((m) => m.title.toLowerCase().includes(q)).slice(0, 6)
    : [];
  const topicResults = q ? topics.filter((t) => t.label.toLowerCase().includes(q)).slice(0, 8) : [];
  const questionResults = q ? questions.filter((qq) => qq.text.toLowerCase().includes(q)).slice(0, 8) : [];
  const hasResults = moduleResults.length + topicResults.length + questionResults.length > 0;

  function go(moduleId: string) {
    navigate(`/module/${moduleId}`);
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/70 px-4 pt-24"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card w-full max-w-lg overflow-hidden bg-slate-900/95 light:bg-white"
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 light:border-slate-200">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search modules, topics, questions…"
                className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none light:text-slate-900"
              />
              <button
                onClick={() => setOpen(false)}
                className="rounded p-1 text-slate-400 hover:text-slate-100 light:hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-2">
              {q && !hasResults && <p className="p-4 text-center text-sm text-slate-500">No matches.</p>}

              {moduleResults.length > 0 && (
                <div className="mb-2">
                  <p className="px-2 py-1 text-[11px] font-semibold uppercase text-slate-500">Modules</p>
                  {moduleResults.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => go(m.id)}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-slate-200 hover:bg-white/5 light:text-slate-700 light:hover:bg-slate-100"
                    >
                      <span>{m.emoji}</span> {m.title}
                    </button>
                  ))}
                </div>
              )}

              {topicResults.length > 0 && (
                <div className="mb-2">
                  <p className="px-2 py-1 text-[11px] font-semibold uppercase text-slate-500">Topics</p>
                  {topicResults.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => go(t.moduleId)}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-slate-300 hover:bg-white/5 light:text-slate-700 light:hover:bg-slate-100"
                    >
                      <span>{t.moduleEmoji}</span>
                      <span className="line-clamp-1">{t.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {questionResults.length > 0 && (
                <div>
                  <p className="px-2 py-1 text-[11px] font-semibold uppercase text-slate-500">Questions</p>
                  {questionResults.map((qq) => (
                    <button
                      key={qq.id}
                      onClick={() => go(qq.moduleId)}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-slate-300 hover:bg-white/5 light:text-slate-700 light:hover:bg-slate-100"
                    >
                      <span>{qq.moduleEmoji}</span>
                      <span className="line-clamp-1">{qq.text}</span>
                    </button>
                  ))}
                </div>
              )}

              {!q && <p className="p-4 text-center text-xs text-slate-500">Start typing to search everything.</p>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
