import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ensureAuth } from './lib/firebase';
import {
  getCalibration,
  saveCalibration,
  saveSession,
  subscribeSessions,
  deleteSession,
  saveProfile,
  DEFAULT_PROFILE,
} from './lib/db';
import { useProfile } from './hooks/useProfile';
import { useSession } from './hooks/useSession';
import {
  xpForSession,
  checkBadges,
  leagueForXP,
  levelForXP,
  nextStreak,
  streakOnOpen,
  streakMilestone,
} from './lib/gamification';

import BottomNav from './components/ui/BottomNav';
import CelebrationScreen from './components/gamification/CelebrationScreen';
import BadgeToast from './components/gamification/BadgeToast';

import HomeScreen from './screens/HomeScreen';
import CalibrationScreen from './screens/CalibrationScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import RestScreen from './screens/RestScreen';
import SummaryScreen from './screens/SummaryScreen';
import HistoryScreen from './screens/HistoryScreen';
import StatsScreen from './screens/StatsScreen';
import ProfileScreen from './screens/ProfileScreen';

const TAB_SCREENS = ['home', 'history', 'stats', 'profile'];

export default function App() {
  const [uid, setUid] = useState(null);
  const [authError, setAuthError] = useState(false);
  const [calibration, setCalibration] = useState(undefined); // undefined = loading, null = none
  const [sessions, setSessions] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const [tab, setTab] = useState('home');
  const [screen, setScreen] = useState('home');

  const { profile } = useProfile(uid);
  const session = useSession();

  const [setNumber, setSetNumber] = useState(1);
  const [lastSetResult, setLastSetResult] = useState(null);
  const [lastSetXP, setLastSetXP] = useState(0);
  const [lastSetPR, setLastSetPR] = useState(false);

  const [pendingResult, setPendingResult] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [badgeQueue, setBadgeQueue] = useState([]);
  const [prJustBroken, setPrJustBroken] = useState(false);

  // --- Auth + initial data ---
  useEffect(() => {
    let unsub;
    (async () => {
      try {
        const user = await ensureAuth();
        setUid(user.uid);
        const cal = await getCalibration(user.uid);
        setCalibration(cal);
        unsub = subscribeSessions(user.uid, setSessions);
      } catch {
        setAuthError(true);
      }
    })();
    return () => unsub?.();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // --- Navigation helpers ---
  const goTab = useCallback((id) => {
    setTab(id);
    if (id === 'workout') {
      startWorkoutFlow();
    } else {
      setScreen(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calibration]);

  function startWorkoutFlow() {
    if (!calibration) {
      setScreen('calibration');
      return;
    }
    session.startSession();
    setSetNumber(1);
    setScreen('workout');
  }

  async function handleCalibrationComplete(data) {
    await saveCalibration(uid, data);
    setCalibration(data);
    session.startSession();
    setSetNumber(1);
    setScreen('workout');
  }

  function handleSetComplete({ reps, repTimestamps, durationSec }) {
    const isPR = reps > (profile?.prs?.bestSet ?? 0);
    session.addSet(reps, repTimestamps, durationSec);
    const avgPaceSec =
      repTimestamps.length > 1
        ? (new Date(repTimestamps[repTimestamps.length - 1]) - new Date(repTimestamps[0])) /
          1000 /
          (repTimestamps.length - 1)
        : 0;
    setLastSetResult({ setNumber, reps, avgPaceSec });
    setLastSetXP(reps);
    setLastSetPR(isPR);
    setScreen('rest');
  }

  function handleNextSet() {
    setSetNumber((n) => n + 1);
    setScreen('workout');
  }

  async function handleEndSession() {
    const built = session.buildSession();
    if (built.totalReps === 0) {
      setTab('home');
      setScreen('home');
      return;
    }
    await finalizeSession(built);
  }

  async function finalizeSession(builtSession) {
    const today = builtSession.date;
    const todaySessions = [...sessions.filter((s) => s.date === today), builtSession];
    const todayTotal = todaySessions.reduce((sum, s) => sum + s.totalReps, 0);
    const allTimeReps = sessions.reduce((sum, s) => sum + s.totalReps, 0) + builtSession.totalReps;
    const totalSessions = sessions.length + 1;

    const currentProfile = profile || DEFAULT_PROFILE;
    const topSetReps = builtSession.topSets?.[0]?.reps ?? 0;

    const prsBroken = [];
    const newPrs = { ...currentProfile.prs };
    if (topSetReps > newPrs.bestSet) {
      newPrs.bestSet = topSetReps;
      prsBroken.push('best set');
    }
    if (todayTotal > newPrs.bestDay) {
      newPrs.bestDay = todayTotal;
      prsBroken.push('best day');
    }
    if (builtSession.totalReps > newPrs.bestSession) {
      newPrs.bestSession = builtSession.totalReps;
      prsBroken.push('best session');
    }

    const xpEarned = xpForSession(builtSession, prsBroken);
    const newTotalXP = currentProfile.totalXP + xpEarned;
    const oldLevel = levelForXP(currentProfile.totalXP);
    const newLevel = levelForXP(newTotalXP);
    const oldLeague = leagueForXP(currentProfile.totalXP);
    const newLeague = leagueForXP(newTotalXP);

    const streak = nextStreak(currentProfile.lastWorkout, currentProfile.streak || 0);

    const interimProfile = {
      ...currentProfile,
      totalXP: newTotalXP,
      level: newLevel,
      league: newLeague.id,
      streak,
      lastWorkout: today,
      prs: newPrs,
    };

    const earnedBadges = checkBadges(interimProfile, builtSession, todayTotal, totalSessions, allTimeReps);
    const milestone = streakMilestone(streak);

    const finalProfile = {
      ...interimProfile,
      badges: [...currentProfile.badges, ...earnedBadges],
    };

    await saveSession(uid, builtSession);
    await saveProfile(uid, finalProfile);

    setPendingResult({
      session: builtSession,
      xpEarned,
      prsBroken,
      badgesEarned: earnedBadges,
      levelUp: newLevel > oldLevel ? { from: oldLevel, to: newLevel } : null,
      leagueUp: newLeague.id !== oldLeague.id ? newLeague : null,
      streakMilestone: milestone,
    });
    setPrJustBroken(prsBroken.length > 0);
    setShowCelebration(true);
  }

  function handleDismissCelebration() {
    setShowCelebration(false);
    if (pendingResult?.badgesEarned?.length) {
      setBadgeQueue(pendingResult.badgesEarned);
    }
    setScreen('summary');
  }

  function handleSummaryDone() {
    setPendingResult(null);
    setTab('home');
    setScreen('home');
  }

  // --- Streak reset on app open ---
  useEffect(() => {
    if (!profile || !uid) return;
    const corrected = streakOnOpen(profile.lastWorkout, profile.streak || 0);
    if (corrected !== profile.streak) {
      saveProfile(uid, { ...profile, streak: corrected });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.lastWorkout]);

  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6 text-center">
        <h1 className="font-extrabold text-xl">Something went wrong</h1>
        <p className="text-gray-500">We couldn't sign you in.</p>
        <button
          className="bg-brand-green text-white font-extrabold px-6 py-3 rounded-2xl"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!uid || !profile || calibration === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="font-extrabold text-gray-400">Loading…</p>
      </div>
    );
  }

  const showBottomNav = !['rest', 'summary'].includes(screen) || screen === 'home';
  const navActive = screen === 'workout' || screen === 'calibration' || screen === 'rest' || screen === 'summary'
    ? 'workout'
    : TAB_SCREENS.includes(screen) ? screen : tab;

  return (
    <div className="min-h-screen bg-surface-muted dark:bg-surface-dark">
      {screen === 'home' && (
        <HomeScreen
          profile={profile}
          sessions={sessions}
          prJustBroken={prJustBroken}
          onStartWorkout={() => goTab('workout')}
          onOpenHistory={() => goTab('history')}
        />
      )}

      {screen === 'calibration' && <CalibrationScreen onComplete={handleCalibrationComplete} />}

      {screen === 'workout' && (
        <WorkoutScreen
          calibration={calibration}
          setNumber={setNumber}
          streak={profile.streak}
          onSetComplete={handleSetComplete}
        />
      )}

      {screen === 'rest' && lastSetResult && (
        <RestScreen
          lastSet={lastSetResult}
          prBroken={lastSetPR}
          xpEarned={lastSetXP}
          onNextSet={handleNextSet}
          onEndSession={handleEndSession}
        />
      )}

      {screen === 'summary' && pendingResult && (
        <SummaryScreen
          session={pendingResult.session}
          xpEarned={pendingResult.xpEarned}
          prsBroken={pendingResult.prsBroken}
          onDone={handleSummaryDone}
        />
      )}

      {screen === 'history' && (
        <HistoryScreen sessions={sessions} onDelete={(id) => deleteSession(uid, id)} />
      )}

      {screen === 'stats' && <StatsScreen profile={profile} sessions={sessions} />}

      {screen === 'profile' && (
        <ProfileScreen
          profile={profile}
          onRecalibrate={() => setScreen('calibration')}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((d) => !d)}
        />
      )}

      <AnimatePresence>
        {showCelebration && pendingResult && (
          <CelebrationScreen
            xpEarned={pendingResult.xpEarned}
            prsBroken={pendingResult.prsBroken}
            badgesEarned={pendingResult.badgesEarned}
            levelUp={pendingResult.levelUp}
            leagueUp={pendingResult.leagueUp}
            onDismiss={handleDismissCelebration}
          />
        )}
      </AnimatePresence>

      {badgeQueue.length > 0 && (
        <BadgeToast badgeIds={badgeQueue} onDone={() => setBadgeQueue([])} />
      )}

      {showBottomNav && <BottomNav active={navActive} onChange={goTab} />}
    </div>
  );
}
