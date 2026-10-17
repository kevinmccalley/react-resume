# react-resume: guidance for AI coding agents

This file gives Claude Code (and other coding agents) the context they need to work in this repo.
It's kept in the repository on purpose, to show how the project is developed with AI agents.

## What this is
Kevin McCalley's interactive résumé: a React app with themes, role-specific variants and
in-browser PDF export. Live at https://react-resume-kdm2026.vercel.app

## Stack
- React + Vite (JavaScript/JSX)
- Material UI + Emotion for components and styling; Phosphor icons
- @react-pdf/renderer for the PDF version
- TanStack Query for data loading; react-router-dom for routes; react-markdown for content
- Vitest + Testing Library (jsdom) for tests
- Deployed on Vercel

## Commands
- `npm run dev`: start the dev server
- `npm run test`: run the tests once
- `npm run test:coverage`: run the tests with coverage

## Where things live
- `src/ReactResume.jsx`: main résumé view
- `src/ResumePDF.jsx`: PDF layout
- `src/sections.json` and `public/sections.json`: résumé content
- `src/variants/`: role-specific variants (for example `frontend.json`) selected via `src/variant.js`
- `src/ThemeContext.jsx` and `src/ThemeSelector.jsx`: theming
- `src/SkipLink.jsx`, `src/ContactForm.jsx`: accessibility helper and contact form
- Every component has a matching `*.test.jsx`

## Working rules
1. **Content lives in JSON, not in components.** Change the résumé text in the sections or variant
   files, not in JSX.
2. **The web view and the PDF must agree.** If you change a section, check both
   `ReactResume.jsx` and `ResumePDF.jsx`.
3. **Accessible by default.** Keep the semantic structure, the skip link, visible focus states,
   labelled form fields and WCAG 2.2 AA contrast in every theme.
4. **Tests stay green.** Add or update a test with every component change; run `npm run test`
   before finishing.
5. **No secrets in the repo.** Configuration goes in environment variables.

## Memory
Personal agent memory (decisions, patterns, past fixes) is kept outside this repository in
the developer's own Claude Code setup, so it isn't part of the codebase.
