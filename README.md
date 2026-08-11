# Lingua Studio

Lingua Studio is a playful, Italian-first, conversation-first language learning workspace. The current experience puts a learner into an Italian café scene with Luna, a warm AI coach that responds naturally, notices high-value patterns, explains concepts in context, and shapes the next prompt around what the learner just said.

## Included

- Freeform conversational practice with a live session feel
- Adaptive corrections and contextual grammar explanations
- Progress, daily goal, streak, and focus-word panels
- A full learning path with scene-based lessons and completion states
- A searchable Word Garden with saved words and quick recall practice
- Activity charts, milestones, confidence trends, and weekly stats
- A focused Italian track with Italian café scenes and useful everyday phrases
- Browser text-to-speech for coach messages
- Demo replies when the AI route is not configured, so the interface remains explorable
- A server-side `/api/chat` route compatible with OpenAI-style `/chat/completions` APIs

## Local preview

```bash
bun install
bun run dev
```

The preview server binds to `0.0.0.0` and reads the managed `PORT` value when present.

## AI setup

Add these values through the workspace Keys/API keys UI (do not put secrets in client-side `VITE_*` variables):

- `OPENAI_API_KEY` — required for live AI coaching
- `OPENAI_BASE_URL` — optional; defaults to `https://api.openai.com/v1`, and can point to another OpenAI-compatible provider
- `OPENAI_MODEL` — optional; defaults to `gpt-4o-mini`. The prompt is tuned for playful, adaptive Italian practice.

The browser only calls `/api/chat`; the API key is read by `server/index.ts` and is never sent to the browser. Without `OPENAI_API_KEY`, chat falls back to a small local demo response so the UI can still be reviewed.

## Build

```bash
bun run build
```
