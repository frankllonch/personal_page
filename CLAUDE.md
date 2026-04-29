# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build with Turbopack
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

**Framework:** Next.js 15 App Router + React 19 + TypeScript
**Styling:** Tailwind CSS 4
**Animations:** Framer Motion (card entrances, 3D tilt, flip), GSAP (text scramble), WebGL via OGL (background effects)

### Content / Data Layer

All editable content lives in two files:

- `lib/data.ts` — bio text, work experience entries, education entries
- `lib/projects.ts` — project cards (title, description, tags, badges, image paths)

To add/edit portfolio content, only these files need to change.

### Component Overview

- `app/page.tsx` — root Client Component; composes everything, handles layout and fixed elements
- `components/bio_card.tsx` — flip card with portrait photo and scrambled text bio
- `components/project.tsx` — project card with `NEW`, `STARRED`, `UPCOMING` badge support and 3D mouse-tilt
- `components/timeline.tsx` — horizontal SVG timeline used for both Work and Education sections
- `components/experience-card.tsx` — card used within the timeline
- `components/wierdtext.tsx` — GSAP text scramble effect triggered by pointer proximity
- `components/FaultyBackground.tsx` — full-page WebGL glitch/scanline background
- `components/CurveGrid.tsx` — curved grid overlay; dynamically imported (no SSR)
- `components/Faultyterminal.tsx` — WebGL renderer used by FaultyBackground

### Styling Conventions

- Color scheme: `#000000` background, `#F4D35E` yellow accent
- Inter font loaded locally from `public/fonts/` (weights 300–800)
- Cards use backdrop blur + semi-transparent borders
- Path alias `@/` maps to the repo root
