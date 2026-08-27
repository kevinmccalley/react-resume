# react-resume — Claude Code Guidelines

## Project Identity

**react-resume** — React-based resume/CV app with PDF export capability.

**Stack:** Vite + React + TypeScript. @react-pdf/renderer for PDF generation. TanStack Query + TanStack Query Devtools for data fetching. Emotion for styling. react-icons. react-markdown. react-router-dom. Vitest + @testing-library/react for tests.

**Dev server:** `npm run dev`

**Tests:** `npm run test` | `npm run test:coverage`

---

## Agentic OS — Memory System

Global context (`C:\Users\pc\.claude\CLAUDE.md`) auto-loads at every session.

**At session start:**
1. Read `C:\Users\pc\.claude\projects\E--projects-react-resume\memory\MEMORY.md` for project context
2. Search Qdrant: `qdrant_find_relevant("react-resume [topic]")` for cross-project patterns

**During session:** capture decisions with `qdrant_store_information(text, {project: "react-resume", type: "decision|pattern|bug-fix"})`

**Global memory** (shared across all projects): `C:\Users\pc\.claude\global-memory\`
