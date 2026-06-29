import { Link, Navigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { ArrowLeft } from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';
import { moduleProgress } from '../../lib/stats';
import TopicChecklist from './TopicChecklist';
import UnlocksFlipCards from './UnlocksFlipCards';
import DrillCallout from './DrillCallout';

export default function ModuleView() {
  const { moduleId } = useParams();
  const content = useProgressStore((s) => s.content);
  const topicStatus = useProgressStore((s) => s.topicStatus);

  if (!content) return null;
  const module = content.modules.find((m) => m.id === moduleId);
  if (!module) return <Navigate to="/" replace />;

  const { mastered, total, pct } = moduleProgress(module, topicStatus);

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 light:text-slate-500 light:hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to cockpit
      </Link>

      <div className="glass-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{module.emoji}</span>
            <div>
              <h1 className="text-xl font-bold text-slate-100 light:text-slate-900">{module.title}</h1>
              <p className="text-xs text-slate-400 light:text-slate-500">
                {module.weeks} · Track {module.track} {module.isHero && '· 🐉 Hero project'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-200 light:text-slate-700">
              {mastered}/{total} topics mastered
            </p>
            <div className="mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-white/10 light:bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all"
                style={{ width: `${pct * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="markdown-body mt-4 text-sm text-slate-300 light:text-slate-700 [&_strong]:text-cyan-300 light:[&_strong]:text-cyan-700">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {module.build}
          </ReactMarkdown>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400 light:text-slate-500">Topics</h2>
        <TopicChecklist topics={module.topics} />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400 light:text-slate-500">
          Unlocks — flashcards
        </h2>
        <UnlocksFlipCards questions={module.unlocks} />
      </section>

      <section>
        <DrillCallout drill={module.drill} />
      </section>
    </div>
  );
}
