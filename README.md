# SpecSplit

> Paste a freelance/software requirement document, pick your AI provider, and get a week-by-week task plan with hours, risks, dependencies, ambiguities, and stack hints — analyzed by AI.

SpecSplit is a Next.js web app for **spec analysis and project estimation**. You paste a requirement document, choose an AI provider (OpenAI, Anthropic, Google Gemini, Groq, NVIDIA, and more), and the app asks the model to return a structured plan: tasks grouped by week, realistic hour estimates, dependency ordering, specific technical risks, vague points that need client clarification, and detected technology stack hints.

## Features

- **Spec analysis** — turns raw requirement docs into a week-by-week task breakdown (JSON, schema-prompted)
- **Multi-provider** — OpenAI, Anthropic, Google Gemini, Groq, NVIDIA, Ollama, and more (configurable in `lib/providers.ts`)
- **Dynamic model lists** — fetches each provider's available models live (OpenAI-compatible endpoints, Google endpoint), with hardcoded fallbacks where APIs don't expose models
- **BYO keys** — API keys are entered in the UI and stored only in the browser's local storage (`useApiKeys` hook); no server-side secrets
- **Server-side proxy** — API routes forward requests to providers so the browser never hardcodes provider wiring
- **Export** — copy/export the generated plan (see `lib/exportUtils.ts`)
- **Dark/light theme** — `next-themes` with shadcn/ui components
- **Toast feedback** — `sonner` notifications for analysis states

## Tech Stack

- **Framework:** Next.js 16 (App Router, Route Handlers)
- **UI:** React 19, Tailwind CSS v4, shadcn/ui, lucide-react, `tw-animate-css`
- **API:** Next.js Route Handlers (`app/api/analyze`, `app/api/models`)
- **State:** React hooks + local storage for API keys (`hooks/useApiKeys.ts`, `hooks/useModels.ts`)

## Getting Started

### Prerequisites

- Node.js 18+
- An API key for at least one supported provider (e.g. OpenAI, Gemini, Groq)

### Run locally

```bash
cd specsplit
npm install
npm run dev
```

Open http://localhost:3000.

### How to use

1. Paste (or type) your requirement document into the input area.
2. Open settings, pick a provider, and paste your API key (stays in your browser).
3. Click **Analyze** — the app returns:
   - `weeks`: tasks per week with titles, hours, `dependsOn`, `risk`, `category`
   - `ambiguities`: vague requirements needing client clarification
   - `totalHours`: summed estimate
   - `stackHints`: detected technologies

## Project Structure

```
SpecSplit/
├── specsplit/               # Next.js application
│   ├── app/
│   │   ├── page.tsx         # main UI
│   │   ├── layout.tsx       # root layout, theme provider
│   │   └── api/
│   │       ├── analyze/route.ts  # POST: sends spec + key to provider, returns JSON plan
│   │       └── models/route.ts   # GET: fetches provider model list (BYO key in header)
│   ├── components/
│   │   ├── analyzer/        # analysis UI
│   │   ├── settings/        # provider + API key settings
│   │   ├── layout/          # header, layout chrome
│   │   ├── ui/              # shadcn/ui primitives
│   │   └── providers.tsx    # theme provider wiring
│   ├── hooks/
│   │   ├── useApiKeys.ts    # local-storage API key management
│   │   └── useModels.ts     # provider model list fetching
│   ├── lib/
│   │   ├── providers.ts     # provider registry (endpoints, strategies, docs links)
│   │   ├── prompts.ts       # system prompt / JSON schema sent to models
│   │   ├── exportUtils.ts   # export helpers
│   │   └── fetchModels.ts   # model-list fetch logic
│   ├── types/index.ts       # Provider / ProviderModel types
│   └── public/              # static assets
└── README.md
```

## Environment Variables

None required — the app is fully bring-your-own-key. API keys are supplied at runtime via the UI (body field for analyze, `x-api-key` header for model fetch).

## Deployment Notes

This is a **dynamic** Next.js app (server-side Route Handlers proxy provider calls), so it deploys to Netlify with the Next.js runtime, not as a static export. Build with `npm run build` and deploy via the Netlify CLI / Netlify dashboard (no env vars needed).

## License

MIT.

---

Built by Girish Lade — https://ladestack.in
