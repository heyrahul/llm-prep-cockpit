import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Compass, Trophy } from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';

export default function Playbook() {
  const content = useProgressStore((s) => s.content);
  if (!content) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 light:text-slate-900">Playbook</h1>
        <p className="text-sm text-slate-400">The why behind the build order, and how to run the final stretch.</p>
      </div>

      <div className="glass-card p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-purple-300">
          <Trophy className="h-4 w-4" /> The capstone logic
        </div>
        <div className="markdown-body text-sm text-slate-300 light:text-slate-700 [&_strong]:text-purple-300">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.notes.capstone}</ReactMarkdown>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-cyan-300">
          <Compass className="h-4 w-4" /> Final 3 weeks — interview mode
        </div>
        <div className="markdown-body text-sm text-slate-300 light:text-slate-700 [&_strong]:text-cyan-300">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.notes.finalWeeks}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
