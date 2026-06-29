import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';
import { burstConfetti } from '../../lib/confetti';
import { playChime } from '../../lib/sound';

export default function LevelUpModal() {
  const pendingLevelUp = useProgressStore((s) => s.pendingLevelUp);
  const clearLevelUp = useProgressStore((s) => s.clearLevelUp);
  const soundEnabled = useProgressStore((s) => s.settings.soundEnabled);

  useEffect(() => {
    if (pendingLevelUp) {
      burstConfetti();
      if (soundEnabled) playChime();
    }
  }, [pendingLevelUp, soundEnabled]);

  return (
    <AnimatePresence>
      {pendingLevelUp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 px-4"
          onClick={clearLevelUp}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -4 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card relative max-w-sm overflow-hidden p-8 text-center"
          >
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-purple-500/10 to-pink-400/10"
            />
            <Sparkles className="mx-auto mb-3 h-10 w-10 text-amber-300" />
            <p className="text-sm font-medium uppercase tracking-wide text-slate-400 light:text-slate-500">Level up</p>
            <p className="mt-1 text-2xl font-bold gradient-text">Level {pendingLevelUp.level}</p>
            <p className="mt-1 text-lg text-slate-200 light:text-slate-800">{pendingLevelUp.title}</p>
            <button
              onClick={clearLevelUp}
              className="mt-5 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 px-5 py-2 text-sm font-medium text-slate-950"
            >
              Keep going
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
