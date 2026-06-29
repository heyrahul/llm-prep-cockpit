import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useProgressStore } from '../store/useProgressStore';

export default function PassphraseGate() {
  const unlock = useProgressStore((s) => s.unlock);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = await unlock(value);
    setBusy(false);
    if (!result.ok) {
      setError(result.error ?? 'Wrong passphrase.');
      return;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 light:bg-slate-50">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, var(--color-accent-purple), transparent 40%), radial-gradient(circle at 80% 70%, var(--color-accent-cyan), transparent 40%)',
        }}
      />
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card relative z-10 w-full max-w-sm p-8"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500">
            <Lock className="h-5 w-5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-100 light:text-slate-900">Daily Drills</h1>
            <p className="text-xs text-slate-400 light:text-slate-500">Enter the passphrase to unlock your cockpit</p>
          </div>
        </div>

        <input
          autoFocus
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Passphrase"
          className="field focus:border-cyan-400/50"
        />

        {error && (
          <motion.p
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-2 text-sm text-rose-400 light:text-rose-600"
          >
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={busy || value.length === 0}
          className="mt-4 w-full rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 px-4 py-2.5 text-sm font-medium text-slate-950 transition active:scale-[0.98] disabled:opacity-50"
        >
          {busy ? 'Unlocking…' : 'Unlock'}
        </button>
      </motion.form>
    </div>
  );
}
