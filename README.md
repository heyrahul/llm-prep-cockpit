# LLM Engineer Prep

A personal, gamified study cockpit that turns [`llm-engineer-interview-study-plan.md`](llm-engineer-interview-study-plan.md)
into a trackable, game-like prep app. Static site, deploys to GitHub Pages, gated behind a passphrase.

- **Dashboard / cockpit** — overall progress ring, per-track progress bars, level + XP, daily streak with a
  heatmap, a "Drill of the day", and a skill-tree module map (RAG is the hero/boss node).
- **Module view** — the BUILD brief, a TOPICS checklist that cycles `not-started → learning → shaky →
  mastered`, UNLOCKS questions as flip-cards (self-rated, feeds a spaced-repetition queue), and a "boss
  challenge" DRILL with a 5-minute spoken-practice timer.
- **Flashcard mode** — shuffled, filterable (track/module), spaced-repetition-aware active recall.
- **Mock round** — N random questions back-to-back against a per-question countdown.
- **Search** (press `/` or `⌘K`) across modules, topics, and questions.
- **Export / import progress** as JSON (Settings panel) — the only way to move progress between devices,
  since this is a static site with no backend.

## Tech stack

Vite + React + TypeScript + Tailwind CSS v4, Framer Motion, lucide-react, react-markdown +
rehype-highlight, Zustand (+ `persist` → localStorage). No backend — everything lives in your browser.

## Local development

```bash
npm install
npm run dev
```

Open the URL Vite prints. `npm run dev` (and `npm run build`) first run `npm run encrypt`, which
AES-encrypts `src/data/content.json` into `src/generated/encrypted-content.json` — a generated,
gitignored file the app decrypts in-browser after you enter the passphrase.

## Editing your content

All syllabus data lives in [`src/data/content.json`](src/data/content.json), typed by
[`src/types.ts`](src/types.ts) (`Module`, `Topic`, `Question`). Add/edit modules there — no other code
changes needed. Every topic has an `explanation` (shown when you expand the row in the checklist) and
every question has an `answer` (shown on the back of its flashcard) — the app is meant to be fully
self-contained, so you shouldn't need to look anything up elsewhere while studying. The two narrative
blurbs on the **Playbook** page live under `notes.capstone` / `notes.finalWeeks` in the same file.

## Setting the passphrase

The app is gated by a passphrase that's checked **entirely in your browser** — see the security note below
before relying on it for anything sensitive.

1. Copy `.env.example` to `.env` (gitignored) and set `STUDY_PASSPHRASE`:
   ```
   STUDY_PASSPHRASE=your-own-passphrase
   ```
2. Run `npm run dev` or `npm run build` — the encrypt step picks it up automatically.
3. **For the GitHub Actions deploy**, add a repository secret named `STUDY_PASSPHRASE`
   (Settings → Secrets and variables → Actions → New repository secret). The workflow falls back to the
   placeholder `changeme123` if the secret isn't set — change it before you rely on this for real privacy.

Changing the passphrase re-encrypts the content; anyone using the old passphrase will be locked out (as
expected) and existing on-device progress is unaffected, since progress is stored separately from content.

## Security model — read this

This is **obfuscation-grade privacy, not real authentication.** The passphrase derives an AES-GCM key
client-side (a Staticrypt-style pattern: PBKDF2 → AES-256-GCM) to decrypt the bundled content in the
browser. Anyone who has — or guesses, or extracts from the compiled JS — the passphrase can read
everything. There is no server, no real access control, no audit trail. That's fine here because the
content is just public-knowledge study notes; **do not** use this pattern to gate real secrets.

## Deploying to GitHub Pages

1. Push this repo to GitHub (the workflow assumes the default branch is `main`).
2. Repo Settings → **Pages** → Source: **GitHub Actions**.
3. (Recommended) Add the `STUDY_PASSPHRASE` repository secret as described above.
4. Push to `main` — [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and deploys
   automatically. The site appears at `https://<your-username>.github.io/llm-prep-cockpit/`.

The Vite `base` in [`vite.config.ts`](vite.config.ts) and the `pathSegmentsToKeep` in
[`public/404.html`](public/404.html) are both hardcoded to the repo name `llm-prep-cockpit`. **If you
rename the repo, update both.** [`public/404.html`](public/404.html) plus the inline script in
[`index.html`](index.html) implement the standard `rafgraph/spa-github-pages` redirect trick so deep links
(e.g. a bookmarked module URL) work when GitHub Pages' static server can't find that path directly.

## Progress, devices, and resets

Progress (XP, streak, topic statuses, spaced-repetition state, theme/sound settings) lives in
**localStorage**, scoped to this device + browser. Use **Settings → Export progress** before switching
devices or clearing site data, and **Import progress** on the new one. Locking the app (the lock icon)
clears the decrypted content from memory/localStorage but keeps your progress and a passphrase hash for
fast re-validation; it does not touch your XP/streak/topic data.

## Assumptions made while building this

The source syllabus markdown didn't give every module a BUILD/UNLOCKS/DRILL field in identical shape
(some Track B modules have no UNLOCKS list; the System Design and DSA modules have no single BUILD
artifact; Behavioral has no BUILD/DRILL at all). Where a field was missing, content.json synthesizes a
reasonable one directly from the surrounding source text rather than fabricating new claims — e.g. System
Design's "BUILD" field explains there is none and points to the canon list instead, and its UNLOCKS are the
canonical system names ("Design a chat system", etc.) pulled from the "drill the canon" paragraph. Modules
without an UNLOCKS list show an empty-state message instead of flashcards in that section.

## Project structure

```
src/
  data/content.json     seed content (edit this to update the syllabus)
  types.ts               Module/Topic/Question/StudyContent types
  lib/                    crypto, srs (spaced repetition), xp/levels, stats, sound, confetti
  store/                  Zustand stores (progress — persisted; ui — ephemeral)
  components/
    PassphraseGate.tsx
    Layout/               top nav
    Dashboard/             progress ring, module map, streak heatmap, drill-of-the-day
    Module/                topic checklist, flip-cards, boss-drill timer
    Flashcards/            flashcard mode + mock-round mode
    Search/                ⌘K / "/" search modal
    Settings/               theme/sound, export/import, lock
    Gamification/           level-up modal
    Playbook/               capstone logic + final-3-weeks notes
scripts/encrypt-content.mjs  build-time AES-GCM encryption of content.json
```
