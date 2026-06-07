# Pull-up Tracker

A camera-based pull-up rep counter with Duolingo-style gamification — XP, levels, leagues, streaks, and badges. Built with React, Vite, Tailwind CSS, Framer Motion, MediaPipe Pose, and Firebase.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com), then:
   - Enable **Anonymous** sign-in under Authentication → Sign-in method
   - Create a **Firestore** database (start in production or test mode)
   - Copy your web app config values

3. Provide your Firebase config via environment variables — copy `.env.example` to `.env.local` and fill in the values (or paste them directly into `src/lib/firebase.js`):

   ```bash
   cp .env.example .env.local
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

5. Open the app on your phone (or a device with a camera) over HTTPS or `localhost` — camera access requires a secure context.

## How it works

- On first launch you'll be guided through a 3-step camera calibration wizard so the rep-counting algorithm can learn your hang and top positions.
- During a workout, MediaPipe Pose tracks your shoulder/elbow/wrist landmarks in real time and a state machine (`HANGING → ASCENDING → UP → DESCENDING → HANGING`) counts each completed rep.
- Sessions, profile (XP/level/league/streak/badges/PRs), and calibration are stored in Firestore under `users/{uid}/`, scoped to an anonymous Firebase Auth account, with offline persistence enabled.

## Build

```bash
npm run build
npm run preview
```

## Deploying to Vercel

This is a standard Vite + React SPA, so Vercel's zero-config detection works out of the box (build command `npm run build`, output directory `dist`).

1. Push this repo to GitHub (already done if you're reading this from the repo) and [import it into Vercel](https://vercel.com/new).
2. Vercel will auto-detect the **Vite** framework preset — no `vercel.json` needed.
3. Add your Firebase config as environment variables in the Vercel project (Settings → Environment Variables), using the same names as in `.env.example`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
4. Deploy. Vercel serves the app over HTTPS by default, which satisfies the secure-context requirement for camera access.
5. In the Firebase console, add your Vercel deployment domain (e.g. `your-app.vercel.app`) to **Authentication → Settings → Authorized domains** so anonymous sign-in works there.

Or deploy from the CLI:

```bash
npm install -g vercel
vercel
```
