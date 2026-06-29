import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useProgressStore } from './store/useProgressStore';
import { useUiStore } from './store/useUiStore';
import PassphraseGate from './components/PassphraseGate';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import LevelUpModal from './components/Gamification/LevelUpModal';
import SearchModal from './components/Search/SearchModal';
import SettingsPanel from './components/Settings/SettingsPanel';

const ModuleView = lazy(() => import('./components/Module/ModuleView'));
const FlashcardMode = lazy(() => import('./components/Flashcards/FlashcardMode'));
const MockRoundMode = lazy(() => import('./components/Flashcards/MockRoundMode'));
const Playbook = lazy(() => import('./components/Playbook/Playbook'));

export default function App() {
  const unlocked = useProgressStore((s) => s.unlocked);
  const theme = useProgressStore((s) => s.settings.theme);
  const setSearchOpen = useUiStore((s) => s.setSearchOpen);
  const setSettingsOpen = useUiStore((s) => s.setSettingsOpen);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === '/' && !typing) {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
        setSettingsOpen(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setSearchOpen, setSettingsOpen]);

  if (!unlocked) return <PassphraseGate />;

  return (
    <Layout>
      <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/module/:moduleId" element={<ModuleView />} />
          <Route path="/flashcards" element={<FlashcardMode />} />
          <Route path="/mock" element={<MockRoundMode />} />
          <Route path="/playbook" element={<Playbook />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Suspense>
      <LevelUpModal />
      <SearchModal />
      <SettingsPanel />
    </Layout>
  );
}
