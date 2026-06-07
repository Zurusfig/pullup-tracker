import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

enableIndexedDbPersistence(db).catch(() => {
  // Persistence can fail in multi-tab scenarios or unsupported browsers — app still works online.
});

export async function ensureAuth() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        unsubscribe();
        resolve(user);
        return;
      }
      try {
        const cred = await signInAnonymously(auth);
        unsubscribe();
        resolve(cred.user);
      } catch (err) {
        try {
          const retryCred = await signInAnonymously(auth);
          unsubscribe();
          resolve(retryCred.user);
        } catch (retryErr) {
          unsubscribe();
          reject(retryErr);
        }
      }
    });
  });
}
