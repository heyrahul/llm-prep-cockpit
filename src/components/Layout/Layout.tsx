import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, LayoutDashboard, Layers, Lock, Search, Settings, Swords, BookOpen } from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';
import { useUiStore } from '../../store/useUiStore';
import { levelForXp } from '../../lib/xp';

const NAV_ITEMS = [
  { to: '/', label: 'Cockpit', icon: LayoutDashboard, end: true },
  { to: '/flashcards', label: 'Flashcards', icon: Layers },
  { to: '/mock', label: 'Mock round', icon: Swords },
  { to: '/playbook', label: 'Playbook', icon: BookOpen },
];

export default function Layout({ children }: { children: ReactNode }) {
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);
  const lock = useProgressStore((s) => s.lock);
  const setSearchOpen = useUiStore((s) => s.setSearchOpen);
  const setSettingsOpen = useUiStore((s) => s.setSettingsOpen);
  const level = levelForXp(xp);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 light:bg-slate-50 light:text-slate-900">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-md light:border-slate-200 light:bg-white/80">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2.5 sm:gap-4 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <span className="text-lg">🐉</span>
            <span className="hidden gradient-text sm:inline">Daily Drills</span>
          </NavLink>

          <nav className="flex flex-1 items-center gap-1 overflow-x-auto sm:gap-2">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-white/10 text-cyan-300 light:bg-slate-900/5 light:text-purple-600'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 light:text-slate-500 light:hover:text-slate-900'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              title={`${streak.count}-day streak`}
              className="flex items-center gap-1 rounded-lg bg-orange-500/10 px-2 py-1 text-xs font-medium text-orange-300 light:text-orange-700"
            >
              <Flame className="h-3.5 w-3.5" />
              {streak.count}
            </div>
            <div
              title={`Level ${level.level}: ${level.title}`}
              className="hidden items-center gap-1 rounded-lg bg-purple-500/10 px-2 py-1 text-xs font-medium text-purple-300 sm:flex light:text-purple-700"
            >
              Lv.{level.level} {level.title}
            </div>
            <button
              onClick={() => setSearchOpen(true)}
              title="Search (/)"
              className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-slate-100 light:hover:bg-slate-100 light:hover:text-slate-900"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              title="Settings"
              className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-slate-100 light:hover:bg-slate-100 light:hover:text-slate-900"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              onClick={lock}
              title="Lock"
              className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-rose-300 light:hover:bg-rose-50 light:hover:text-rose-600"
            >
              <Lock className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-3 py-6 sm:px-6">{children}</main>
    </div>
  );
}
