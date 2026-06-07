import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

const userPath = (uid) => `users/${uid}`;

export function calibrationRef(uid) {
  return doc(db, userPath(uid), 'calibration', 'default');
}

export function profileRef(uid) {
  return doc(db, userPath(uid), 'profile', 'default');
}

export function sessionsCol(uid) {
  return collection(db, userPath(uid), 'sessions');
}

export function sessionRef(uid, id) {
  return doc(db, userPath(uid), 'sessions', id);
}

export async function getCalibration(uid) {
  const snap = await getDoc(calibrationRef(uid));
  return snap.exists() ? snap.data() : null;
}

export async function saveCalibration(uid, data) {
  await setDoc(calibrationRef(uid), { ...data, createdAt: new Date().toISOString() });
}

export const DEFAULT_PROFILE = {
  totalXP: 0,
  level: 1,
  league: 'bronze',
  streak: 0,
  lastWorkout: null,
  prs: { bestSet: 0, bestDay: 0, bestSession: 0 },
  badges: [],
};

export async function getProfile(uid) {
  const snap = await getDoc(profileRef(uid));
  if (snap.exists()) return snap.data();
  await setDoc(profileRef(uid), DEFAULT_PROFILE);
  return DEFAULT_PROFILE;
}

export async function saveProfile(uid, profile) {
  await setDoc(profileRef(uid), profile);
}

export function subscribeProfile(uid, cb) {
  return onSnapshot(profileRef(uid), (snap) => {
    if (snap.exists()) cb(snap.data());
  });
}

export async function saveSession(uid, session) {
  await setDoc(sessionRef(uid, session.id), session);
}

export async function getAllSessions(uid) {
  const q = query(sessionsCol(uid), orderBy('startTime', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export function subscribeSessions(uid, cb) {
  const q = query(sessionsCol(uid), orderBy('startTime', 'desc'));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => d.data()));
  });
}

export async function deleteSession(uid, id) {
  await deleteDoc(sessionRef(uid, id));
}
