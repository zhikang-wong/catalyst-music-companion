# LLM Council — Setup Runbook

This folder is a ready-to-run copy of [karpathy/llm-council](https://github.com/karpathy/llm-council),
vendored so you can drop it straight into your **second brain** folder and run it locally.

It's a local web app: you ask one question, it sends it to several LLMs, has them
anonymously rank each other's answers (LLM-as-judge), and a "chairman" model writes the
final synthesized answer. Conversations are saved as JSON in `data/conversations/`.

---

## 0. What you need first (one-time installs)

| Tool | Why | Install |
|------|-----|---------|
| **uv** | Python deps + runner | macOS/Linux: `curl -LsSf https://astral.sh/uv/install.sh \| sh` · Windows: see https://docs.astral.sh/uv/ |
| **Node.js 18+** (npm) | Frontend | https://nodejs.org/ (or `brew install node`) |
| **OpenRouter API key** | Talks to the models | https://openrouter.ai/ → add credits / auto top-up |

Verify they're installed:
```bash
uv --version
node --version && npm --version
```

---

## 1. Put this folder where you want it

Tonight, from wherever you cloned/downloaded this, move the whole `llm-council/`
folder into your second brain. For example:
```bash
mv llm-council ~/Desktop/"second brain"/llm-council
cd ~/Desktop/"second brain"/llm-council
```
Everything below is run from **inside this `llm-council/` folder**.

---

## 2. Add your API key

```bash
cp .env.example .env
```
Open `.env` and replace the placeholder with your real key:
```
OPENROUTER_API_KEY=sk-or-v1-...your-real-key...
```
`.env` is gitignored and will not be committed.

---

## 3. Install dependencies

```bash
# Python backend
uv sync

# Frontend
cd frontend
npm install
cd ..
```

---

## 4. Run it

Easiest — the start script launches both servers:
```bash
./start.sh
```
(If you get a permissions error: `chmod +x start.sh` first.)

Or run them in two terminals manually:
```bash
# Terminal 1 — backend (http://localhost:8001)
uv run python -m backend.main

# Terminal 2 — frontend (http://localhost:5173)
cd frontend && npm run dev
```

Then open **http://localhost:5173** in your browser. Stop with `Ctrl+C`.

---

## 5. Choose your council (optional)

Edit `backend/config.py`:
```python
COUNCIL_MODELS = [
    "openai/gpt-5.1",
    "google/gemini-3-pro-preview",
    "anthropic/claude-sonnet-4.5",
    "x-ai/grok-4",
]
CHAIRMAN_MODEL = "google/gemini-3-pro-preview"   # synthesizes the final answer
```
Use any OpenRouter model IDs from https://openrouter.ai/models. Fewer/cheaper
models = lower cost per query (every question hits each model two to three times).

---

## Troubleshooting

- **402 / "insufficient credits"** — add credits on OpenRouter.
- **A model errors out** — the app degrades gracefully and continues with the
  models that did respond; check the backend terminal for the specific error.
- **Port 8001 already in use** — change the port in `backend/main.py` (and the API
  base URL in `frontend/src/api.js` to match).
- **`./start.sh` not executable** — `chmod +x start.sh`.

---

## Notes

- This is upstream llm-council, unmodified except for this `SETUP.md` and `.env.example`.
  Original author's README is in `README.md`; deeper technical notes are in `CLAUDE.md`.
- It does **not** read your notes yet — it's the council tool installed in your second
  brain folder. Wiring it to actually reason over your notes (RAG) is a separate step
  if you want it later.
