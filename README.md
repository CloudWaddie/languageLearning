# lingua

lingua is a playful, no-login language learning app — a Duolingo-style experience that runs entirely in your browser. Pick a course, work through bite-size lessons on a guided path, and let hearts, XP, streaks and a word garden keep the habit alive. There is no account and no sign-in: all progress is saved in `localStorage` on the device.

## Included

- Three courses — Italian, Spanish and French — each with 3 units × 3 lessons (~7 exercises per lesson)
- A Duolingo-style learn path: lessons unlock in order and completed nodes turn gold
- Five exercise types: pick-the-translation, word-bank phrase building, type-it-out, match-the-pairs and listen-and-choose (browser text-to-speech)
- Lesson sessions with hearts, a progress bar, instant feedback, re-queued missed exercises and an XP results screen
- XP, a 40 XP daily goal, day streaks and first-try accuracy — all persisted locally
- A Word garden that collects every word from completed lessons, with starring, pronunciation and a quick recall quiz
- A Free talk view with Luna, an adaptive AI conversation coach per course
- A server-side `/api/chat` route compatible with OpenAI-style `/chat/completions` APIs (optional; Free talk falls back to demo replies offline)
- No login, ever — progress lives on this device only

## Local preview

```bash
bun install
bun run dev
```

The preview server binds to `0.0.0.0` and reads the managed `PORT` value when present.

## AI setup (optional)

Add these values through the workspace Keys/API keys UI (do not put secrets in client-side `VITE_*` variables):

- `OPENAI_API_KEY` — required for live AI coaching in Free talk
- `OPENAI_BASE_URL` — optional; defaults to `https://api.openai.com/v1`, and can point to another OpenAI-compatible provider
- `OPENAI_MODEL` — optional; defaults to `gpt-4o-mini`

The browser only calls `/api/chat`; the API key is read by `server/index.ts` and is never sent to the browser. Without `OPENAI_API_KEY`, chat falls back to a small local demo response so the UI can still be reviewed.

## Build

```bash
bun run build
```
