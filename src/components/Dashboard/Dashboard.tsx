import { motion } from 'framer-motion';
import { useProgressStore } from '../../store/useProgressStore';
import { overallProgress, trackProgress } from '../../lib/stats';
import ProgressRing from './ProgressRing';
import TrackProgressBars from './TrackProgressBars';
import StreakHeatmap from './StreakHeatmap';
import DrillOfTheDay from './DrillOfTheDay';
import ModuleMap from './ModuleMap';
import { levelForXp, nextLevel, progressToNextLevel } from '../../lib/xp';

export default function Dashboard() {
  const content = useProgressStore((s) => s.content);
  const topicStatus = useProgressStore((s) => s.topicStatus);
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);

  if (!content) return null;

  const overall = overallProgress(content, topicStatus);
  const trackA = trackProgress(content, topicStatus, 'A');
  const trackB = trackProgress(content, topicStatus, 'B');
  const level = levelForXp(xp);
  const next = nextLevel(xp);
  const levelPct = progressToNextLevel(xp);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="glass-card flex items-center gap-4 p-5">
          <ProgressRing pct={overall} size={84} stroke={8} />
          <div>
            <p className="text-xs text-slate-400 light:text-slate-500">Overall mastery</p>
            <p className="text-sm font-medium text-slate-200 light:text-slate-700">{Math.round(overall * 100)}% of all topics</p>
          </div>
        </div>

        <div className="glass-card p-5">
          <p className="mb-2 text-xs text-slate-400 light:text-slate-500">Track progress</p>
          <TrackProgressBars trackAPct={trackA} trackBPct={trackB} />
        </div>

        <div className="glass-card p-5">
          <p className="text-xs text-slate-400 light:text-slate-500">
            Level {level.level} · <span className="text-purple-300 light:text-purple-600">{level.title}</span>
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-100 light:text-slate-900">{xp} XP</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5 light:bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-700"
              style={{ width: `${levelPct * 100}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-500 light:text-slate-500">{next ? `${next.minXp - xp} XP to ${next.title}` : 'Max level'}</p>
        </div>

        <div className="glass-card p-5">
          <p className="mb-2 text-xs text-slate-400 light:text-slate-500">{streak.count}-day streak</p>
          <StreakHeatmap history={streak.history} />
        </div>
      </motion.div>

      <DrillOfTheDay />
      <ModuleMap />
    </div>
  );
}
