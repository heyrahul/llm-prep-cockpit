import { daysAgoKey } from '../../lib/date';

interface Props {
  history: string[];
}

const DAYS_TO_SHOW = 70;

export default function StreakHeatmap({ history }: Props) {
  const activeSet = new Set(history);
  const days = Array.from({ length: DAYS_TO_SHOW }, (_, i) => daysAgoKey(DAYS_TO_SHOW - 1 - i));

  return (
    <div
      className="grid gap-1"
      style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))', gridAutoFlow: 'column', gridAutoColumns: '10px' }}
    >
      {days.map((day) => (
        <div
          key={day}
          title={day}
          className={`aspect-square w-full rounded-[3px] ${
            activeSet.has(day)
              ? 'bg-gradient-to-br from-cyan-400 to-purple-500'
              : 'bg-white/5 light:bg-slate-200'
          }`}
        />
      ))}
    </div>
  );
}
