# Build Prompt: "LLM Engineer Prep" — a gamified study web app on GitHub Pages

Paste everything below into your coding agent (Claude Code, Cursor, v0, etc.). Provide your syllabus markdown (the LLM-engineer study plan) alongside it when asked, or drop it into `src/content/`.

---

## Goal

Build a **personal, gamified, single-page study web app** that turns my LLM-engineer interview syllabus into an engaging, trackable learning experience. It must deploy to **GitHub Pages** and be reachable from any device via its URL, behind a simple passphrase gate. It must **not feel like a boring document** — it should feel like a focused, game-like prep cockpit.

## Tech stack (use exactly this unless you have a strong reason)

- **Vite + React + TypeScript + Tailwind CSS**
- **Framer Motion** for animation, **lucide-react** for icons
- **react-markdown** + **rehype-highlight** (or Shiki) for rendering markdown content with code syntax highlighting
- All state in React + **localStorage** (no backend — this is a static site)
- A **GitHub Actions workflow** that builds and deploys to GitHub Pages on push to `main`
- Configure Vite `base` to `'/<REPO_NAME>/'` and add a `404.html` that redirects to `index.html` so client-side routing works on Pages

## Content model

Model the syllabus as typed data so it's easy to edit. Parse my provided markdown into this shape (or generate a `content.ts` I can edit):

```ts
type ItemStatus = 'not-started' | 'learning' | 'shaky' | 'mastered';

interface Drill { prompt: string; }
interface Question { id: string; text: string; }   // the UNLOCKS interview questions
interface Topic { id: string; label: string; }     // the TOPICS checklist items

interface Module {
  id: string;            // e.g. "m2-rag"
  track: 'A' | 'B';      // A = AI, B = core engineering
  order: number;
  title: string;         // "Production RAG service"
  weeks: string;         // "Week 7–10"
  emoji: string;         // a fun icon/emoji per module
  build: string;         // the BUILD paragraph
  topics: Topic[];       // exhaustive checklist
  unlocks: Question[];   // interview questions
  drill: string;         // the whiteboard DRILL
  isHero?: boolean;      // mark the RAG module
}
```

Seed it with all my modules: Python (0a/0b/0c), LLM foundations, RAG (hero), Agents+MCP, Evaluation+Observability, Fine-tuning, Serving/System-design, then Track B (Java, Databases, Kafka, System Design, DSA), plus Behavioral and the Capstone. Use the BUILD / TOPICS / UNLOCKS / DRILL content I provide verbatim.

## Core features

1. **Dashboard / "cockpit" home**
   - Overall progress ring (% of topics mastered) + per-track progress bars.
   - Current **level** and **XP**, a **daily streak** counter, and a **"Drill of the day"** (a random UNLOCKS question or DRILL).
   - A **module map** styled like a game skill-tree: each module is a node showing state (not-started / in-progress / mastered) with its emoji; the hero RAG node visually highlighted.

2. **Module view**
   - Renders BUILD, then the TOPICS as a **checklist** where each item cycles through statuses (not-started → learning → shaky → mastered) with distinct colors and a satisfying micro-animation on change.
   - UNLOCKS shown as **flip-cards** (question on front; clicking reveals a space to self-rate "got it / shaky"). No answers are required in the data — this is active recall.
   - DRILL shown as a highlighted "boss challenge" callout with a **start-timer** button (e.g. 5 min) for spoken practice.

3. **Gamification (the "not boring" engine)**
   - XP for each topic moved to mastered and each question self-rated "got it"; **levels with titles**: e.g. Prompt Apprentice → RAG Wrangler → Agent Architect → Eval Sentinel → LLM Engineer.
   - **Confetti** + a sound (toggleable) on completing a module or hitting a streak milestone.
   - Daily streak with a small calendar heatmap.
   - Subtle progress animations, hover states, and a clean level-up modal.

4. **Interview / flashcard mode**
   - A focused full-screen mode that pulls UNLOCKS questions (filterable by module/track), shuffles them, shows one at a time, lets me self-rate, and feeds a lightweight **spaced-repetition** queue (items rated "shaky" resurface sooner).
   - A **"mock round" timer** mode: pick a module, get N random questions back-to-back with a countdown.

5. **Search & filter** across all modules, topics, and questions.

6. **Persistence & portability**
   - Save all progress (statuses, XP, streak, SRS state) to localStorage.
   - **Export / Import progress as a JSON file** (so I can move progress between devices, since static sites can't sync automatically). Add a clear "Export progress" / "Import progress" button in settings.

## Static login (be honest about what this is)

- Gate the app behind a **passphrase** using **client-side AES-GCM encryption** of the content bundle (Staticrypt pattern): encrypt the content at build time with my passphrase; on load, prompt for the passphrase and **decrypt in-browser**. Store only a hash to validate quickly; persist an unlock flag in localStorage so I'm not re-prompted constantly (with a "lock" button).
- Add a short, clearly-worded note in the README and on the login screen that this is **obfuscation-grade privacy, not real authentication** — anyone with the passphrase can read it, and it's unsuitable for secrets. (This is fine: the content is just my public-knowledge study notes.)
- Make the passphrase configurable via an env var / build step, and document how to change it.

## Design direction (make it feel premium, not a worksheet)

- Modern, focused, **dark-mode-first** with a light toggle. Clean type, generous spacing, rounded cards, soft borders — no clutter.
- A confident accent color with a tasteful gradient or two, used sparingly. Distinct status colors for the checklist.
- Smooth Framer Motion transitions between views; tactile button presses; the level-up and confetti moments should feel rewarding.
- Fully **responsive** (must look great on phone — I'll use it on the go) and keyboard-friendly (shortcuts for next card, mark mastered, open search).
- Accessible: real contrast, focus states, semantic markup.

## Deliverables

- A complete, runnable repo: `src/`, `content.ts` (seeded with my syllabus), the encryption build step, `vite.config.ts` with correct `base`, `404.html` SPA fallback, and `.github/workflows/deploy.yml`.
- A **README** with: local dev (`npm i && npm run dev`), how to add/edit content, how to set the passphrase, the security caveat, and exact GitHub Pages setup steps (repo settings → Pages → source: GitHub Actions).
- Sensible component structure, typed throughout, no dead code.

## Acceptance criteria

- `npm run build` produces a static site that works when served from a `/<REPO_NAME>/` subpath.
- Deploys to GitHub Pages via the included Action and loads behind the passphrase from any device.
- I can: check off topics, earn XP/levels, keep a streak, run flashcard + mock-round modes, search, and export/import progress.
- It looks and feels engaging on both desktop and mobile.

When anything is ambiguous, make a tasteful choice and keep going; note assumptions in the README.
