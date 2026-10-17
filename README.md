# Kevin McCalley — Interactive Résumé

**Live:** https://react-resume-kdm2026.vercel.app

My résumé, built as a small React app instead of a static document.

## Features
- **Themes** with a theme selector (context-based theming)
- **PDF export** generated in the browser with `@react-pdf/renderer`
- **Variants** of the résumé for different roles, driven from structured JSON (`sections.json`)
- **Contact form**
- **Accessible by default:** skip link, semantic structure, keyboard support

## Stack
React · Vite · Material UI + Emotion · @react-pdf/renderer · TanStack Query · Vitest + Testing Library · Vercel

## Run locally
```bash
npm install
npm run dev        # dev server
npm run test       # unit tests
npm run test:coverage
```

## Built with AI-assisted workflows
Developed with Claude Code. [`CLAUDE.md`](CLAUDE.md) gives coding agents the project's structure,
commands and working rules, such as keeping content in JSON, keeping the web and PDF views in sync,
staying accessible by default and keeping tests green.
