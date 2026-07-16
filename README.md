# fitness-app (working codename — product name TBD)

Self-improvement mobile app: weight, workouts, nutrition, habits, accountability.
Expo (React Native, TypeScript strict) + Supabase. See CLAUDE.md for the full spec,
conventions, and V1 build order.

## Getting started

```bash
npm install
cp .env.example .env   # fill in Supabase project URL + anon key
npm start              # scan the QR code with Expo Go
```

## Quality gate

```bash
npm run typecheck && npm run lint && npm test
```
