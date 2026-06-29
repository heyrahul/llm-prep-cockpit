import confetti from 'canvas-confetti';

export function burstConfetti() {
  const colors = ['#22d3ee', '#a855f7', '#f472b6', '#facc15'];
  confetti({ particleCount: 90, spread: 70, startVelocity: 45, origin: { y: 0.6 }, colors });
  setTimeout(
    () => confetti({ particleCount: 50, spread: 100, startVelocity: 30, origin: { y: 0.5 }, colors }),
    150,
  );
}
