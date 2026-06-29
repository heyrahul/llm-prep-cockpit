interface Props {
  trackAPct: number;
  trackBPct: number;
}

export default function TrackProgressBars({ trackAPct, trackBPct }: Props) {
  const rows = [
    { label: 'Track A — AI', pct: trackAPct, from: 'from-cyan-400', to: 'to-purple-500' },
    { label: 'Track B — Core eng', pct: trackBPct, from: 'from-purple-500', to: 'to-pink-400' },
  ];
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
            <span>{row.label}</span>
            <span>{Math.round(row.pct * 100)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/5 light:bg-slate-200">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${row.from} ${row.to} transition-all duration-700`}
              style={{ width: `${Math.max(row.pct * 100, row.pct > 0 ? 4 : 0)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
