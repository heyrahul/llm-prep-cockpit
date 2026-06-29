import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Lock, Moon, ShieldAlert, Sun, Upload, Volume2, VolumeX, X } from 'lucide-react';
import { useUiStore } from '../../store/useUiStore';
import { useProgressStore } from '../../store/useProgressStore';

export default function SettingsPanel() {
  const open = useUiStore((s) => s.settingsOpen);
  const setOpen = useUiStore((s) => s.setSettingsOpen);
  const settings = useProgressStore((s) => s.settings);
  const toggleTheme = useProgressStore((s) => s.toggleTheme);
  const toggleSound = useProgressStore((s) => s.toggleSound);
  const exportProgress = useProgressStore((s) => s.exportProgress);
  const importProgress = useProgressStore((s) => s.importProgress);
  const lock = useProgressStore((s) => s.lock);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function handleExport() {
    const json = exportProgress();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `llm-prep-cockpit-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importProgress(String(reader.result));
      setMessage(result.ok ? { ok: true, text: 'Progress imported.' } : { ok: false, text: result.error! });
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/60"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-sm overflow-y-auto bg-slate-900 p-5 light:bg-white"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-100 light:text-slate-900">Settings</h2>
              <button onClick={() => setOpen(false)} className="rounded p-1 text-slate-400 hover:text-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={toggleTheme}
                className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                <span className="flex items-center gap-2">
                  {settings.theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} Theme
                </span>
                <span className="text-slate-400">{settings.theme === 'dark' ? 'Dark' : 'Light'}</span>
              </button>

              <button
                onClick={toggleSound}
                className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                <span className="flex items-center gap-2">
                  {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />} Sound
                  effects
                </span>
                <span className="text-slate-400">{settings.soundEnabled ? 'On' : 'Off'}</span>
              </button>
            </div>

            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase text-slate-500">Portability</p>
              <button
                onClick={handleExport}
                className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:bg-white/10"
              >
                <Download className="h-4 w-4" /> Export progress
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:bg-white/10"
              >
                <Upload className="h-4 w-4" /> Import progress
              </button>
              <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
              {message && (
                <p className={`text-xs ${message.ok ? 'text-emerald-400' : 'text-rose-400'}`}>{message.text}</p>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  lock();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-300 hover:bg-rose-500/20"
              >
                <Lock className="h-4 w-4" /> Lock app
              </button>
            </div>

            <div className="mt-6 flex items-start gap-2 rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 text-xs text-amber-200/80">
              <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <p>
                The passphrase gate is obfuscation-grade, not real authentication. Progress lives only in this
                browser's localStorage — export it before switching devices or clearing site data.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
