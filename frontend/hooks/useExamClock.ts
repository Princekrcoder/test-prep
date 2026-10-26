import { useState, useEffect, useRef } from 'react';

let skewMs = 0;

export function syncClock(serverNow: string) {
  skewMs = new Date(serverNow).getTime() - Date.now();
}

export function remainingMs(expiresAt: string): number {
  const now = Date.now() + skewMs;
  return Math.max(0, new Date(expiresAt).getTime() - now);
}

export function useExamClock(expiresAt: string | null, onExpire?: () => void) {
  const [remaining, setRemaining] = useState(() =>
    expiresAt ? remainingMs(expiresAt) : 0
  );
  const expiredRef = useRef(false);

  useEffect(() => {
    if (!expiresAt) return;
    expiredRef.current = false;

    const tick = () => {
      const ms = remainingMs(expiresAt);
      setRemaining(ms);
      if (ms <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpire?.();
      }
    };

    tick();
    const interval = setInterval(tick, 250);

    const onVisible = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [expiresAt, onExpire]);

  return remaining;
}

export function formatTimeMs(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}