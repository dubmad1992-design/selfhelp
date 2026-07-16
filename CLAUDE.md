# CLAUDE.md

> **Naming note:** the product name is TBD — the working codename is `fitness-app`. The spec below refers to the product as "Appathy", but do not use that name in code identifiers, bundle ids, or marketing surfaces until the final name is chosen.

This file gives Claude Code the context it needs to work on this app. Read it before making changes.

## What This App Is

A self-improvement platform. Version 1 focuses on weight loss, body transformation, fitness tracking, accountability, and habit building.

The product filter for every feature and every line of UI code:

> **"Does this help the user make better decisions today?"** If no, it shouldn't exist.

This is the anti-MyFitnessPal: simple, fast, motivating, never overwhelming. When in doubt, cut scope, reduce taps, and show less on screen.

## Tech Stack

- **Framework:** React Native via **Expo** (managed workflow), TypeScript in strict mode
- **Navigation:** Expo Router (file-based routing in `app/`)
- **Backend:** **Supabase** — Postgres, Auth, Row Level Security, Storage (private bucket for progress photos), Edge Functions for server logic
- **Server state:** TanStack Query (all Supabase reads/writes go through query/mutation hooks)
- **Client state:** Zustand (small, focused stores; no Redux)
- **Styling:** NativeWind (Tailwind for RN) + a central design-token file
- **Charts:** Victory Native (Skia-based)
- **Animations:** Reanimated 4 (SDK-pinned; spec originally said 3) + Moti for micro-interactions; Lottie for milestone celebrations
- **Forms/validation:** React Hook Form + Zod (Zod schemas are the single source of truth for data shapes)
- **Dates:** date-fns
- **Testing:** Jest + React Native Testing Library; Maestro for E2E flows later

Do not add dependencies without a strong reason. Prefer building small utilities over importing packages.

## Commands

```bash
npm start              # Expo dev server
npm run ios            # iOS simulator
npm run android        # Android emulator
npm run lint           # ESLint + Prettier check
npm run typecheck      # tsc --noEmit
npm test               # Jest
```

Always run `npm run typecheck` and `npm run lint` after making changes. Fix errors before finishing a task.

## Project Structure

```
app/                    # Expo Router routes (screens only, thin)
  (tabs)/               # Main tab navigation: dashboard, log, workouts, progress, profile
  (auth)/               # Sign in / sign up / onboarding
src/
  features/             # Feature modules — the heart of the codebase
    weight/             # Logging, trends, goal prediction, plateau detection
    photos/             # Progress photos, comparisons, timeline
    workouts/           # Exercises, sets, PRs, volume
    cardio/
    nutrition/          # Calories, protein, carbs, fat, water
    habits/
    challenges/
    milestones/
    accountability/     # Check-ins, reflections, weekly reviews
    analytics/
  components/           # Shared UI primitives (Card, Button, StatTile, Ring, Chart wrappers)
  lib/                  # Supabase client, query client, utilities
  stores/               # Zustand stores
  theme/                # Design tokens: colors, spacing, typography, radii
  types/                # Shared types and Zod schemas
supabase/
  migrations/           # SQL migrations (never edit applied migrations; add new ones)
  functions/            # Edge functions
```

Each feature folder owns its components, hooks, schemas, and API calls. Screens in `app/` should be thin — they compose feature components and contain no business logic.

## Code Conventions

- TypeScript **strict**. No `any`. No `@ts-ignore` without a comment explaining why.
- Functional components only. Named exports (default exports only where Expo Router requires them).
- All Supabase access goes through typed hooks in `features/*/api/` — never call `supabase.from()` directly inside a component.
- Derive types from Zod schemas (`z.infer`) rather than duplicating interfaces.
- Units are metric internally (kg, cm, ml); convert at the display layer based on user preference.
- Dates stored as ISO 8601 UTC; displayed in the user's local timezone. A "day" for streaks/habits is the user's local day.
- Handle loading, error, and empty states in every screen. Empty states should be encouraging, not blank.
- Optimistic updates for logging actions (weight, sets, water, habits) — logging must feel instant.
- Accessibility: every touchable has an `accessibilityLabel`; respect reduced-motion settings for animations.
- Keep components small. If a file exceeds ~200 lines, look for a split.

## Design Language

Modern, premium, minimal. Inspiration: Apple Health, WHOOP, Hevy, Strong, Duolingo (motivation), Notion (layout).

- Rounded corners (large radii, ~16–24), generous white space, large typography
- Cards instead of long forms; multi-step flows instead of dense screens
- Smooth, subtle animations (150–300ms); tasteful celebrations for milestones only
- Beautiful charts are a first-class feature, not an afterthought
- Dashboard: everything important visible **without scrolling**
- Every screen has one clear primary action
- All colors, spacing, and type sizes come from `src/theme/` tokens — never hardcode hex values or magic numbers in components
- Light and dark mode from day one

## Product Rules (non-negotiable)

1. **As few taps as possible.** Logging weight should take two taps from app open. Question every added step.
2. **Never shame the user.** Missed goals trigger encouragement, never punishment. Copy is warm, brief, and positive. No red "FAILED" states — use neutral colors and supportive language.
3. **Simplicity beats completeness.** Nutrition tracking is calories, protein, carbs, fat, water — resist adding micronutrients, meal timing, etc.
4. **Progress over perfection.** Trends (7-day average, 30/90-day) matter more than single data points; charts should emphasize trend lines over daily noise.
5. **Privacy first.** Progress photos and body data are sensitive. Photos live in a private Supabase bucket with RLS; nothing is shared without explicit action.

## Build Order (V1 priorities)

1. Auth + onboarding (goal weight, starting stats, units)
2. Weight tracking + trend charts + goal prediction
3. Dashboard
4. Nutrition (simple logging + daily targets)
5. Workout tracking (exercises, sets, reps, weight, PRs)
6. Habits + streaks
7. Progress photos + comparisons
8. Accountability (check-ins, weekly review)
9. Milestones + celebrations
10. Analytics (weekly/monthly reports)

Later: challenges, gamification (XP, levels, badges), AI coach, barcode scanner, HealthKit/Google Fit, social features. Don't build ahead of this list without being asked.

## How Claude Should Work Here

- Before implementing, check whether a reusable component or hook already exists in `src/components/` or the relevant feature folder.
- New tables need a migration in `supabase/migrations/` plus RLS policies — every table is scoped to `user_id` with RLS enabled, no exceptions.
- When adding a feature, include its Zod schema, API hooks, and at least basic tests for non-trivial logic (trend calculations, streak logic, plateau detection).
- Ask before adding a dependency, restructuring folders, or deviating from the build order.
- When making UI, match the design language above rather than generic RN defaults.
