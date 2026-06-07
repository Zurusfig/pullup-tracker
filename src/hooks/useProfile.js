import { useEffect, useState } from 'react';
import { subscribeProfile, getProfile, DEFAULT_PROFILE } from '../lib/db';

export function useProfile(uid) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    let unsub;
    (async () => {
      await getProfile(uid);
      unsub = subscribeProfile(uid, (data) => {
        setProfile({ ...DEFAULT_PROFILE, ...data });
        setLoading(false);
      });
    })();
    return () => unsub?.();
  }, [uid]);

  return { profile, loading };
}
