import type { Module } from '../../types';
import { useProgressStore } from '../../store/useProgressStore';
import { moduleProgress, moduleState } from '../../lib/stats';
import ModuleNode from './ModuleNode';

function TrackRow({ title, modules }: { title: string; modules: Module[] }) {
  const topicStatus = useProgressStore((s) => s.topicStatus);
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-slate-400">{title}</h3>
      <div className="relative">
        <div
          aria-hidden
          className="absolute left-10 right-10 top-8 hidden h-px bg-gradient-to-r from-cyan-400/30 via-purple-500/30 to-pink-400/30 sm:top-10 sm:block"
        />
        <div className="flex gap-3 overflow-x-auto pb-2 sm:gap-5">
          {modules.map((m) => (
            <ModuleNode key={m.id} module={m} state={moduleState(m, topicStatus)} pct={moduleProgress(m, topicStatus).pct} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ModuleMap() {
  const content = useProgressStore((s) => s.content);
  if (!content) return null;
  const trackA = content.modules.filter((m) => m.track === 'A').sort((a, b) => a.order - b.order);
  const trackB = content.modules.filter((m) => m.track === 'B').sort((a, b) => a.order - b.order);

  return (
    <div className="glass-card space-y-6 p-5">
      <TrackRow title="Track A — AI (build-driven)" modules={trackA} />
      <TrackRow title="Track B — Core engineering" modules={trackB} />
    </div>
  );
}
