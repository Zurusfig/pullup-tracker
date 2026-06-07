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
   - Copy your web app config and paste it into `src/lib/firebase.js`, replacing the placeholder `firebaseConfig` object

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open the app on your phone (or a device with a camera) over HTTPS or `localhost` — camera access requires a secure context.

## How it works

- On first launch you'll be guided through a 3-step camera calibration wizard so the rep-counting algorithm can learn your hang and top positions.
- During a workout, MediaPipe Pose tracks your shoulder/elbow/wrist landmarks in real time and a state machine (`HANGING → ASCENDING → UP → DESCENDING → HANGING`) counts each completed rep.
- Sessions, profile (XP/level/league/streak/badges/PRs), and calibration are stored in Firestore under `users/{uid}/`, scoped to an anonymous Firebase Auth account, with offline persistence enabled.

## Build

```bash
npm run build
npm run preview
```
