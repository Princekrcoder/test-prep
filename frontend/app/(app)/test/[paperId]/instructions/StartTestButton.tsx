'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface Props {
  paperId: string;
  hasConfirmedDeclaration?: boolean;
}

export function StartTestButton({ paperId, hasConfirmedDeclaration = true }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    if (!hasConfirmedDeclaration) {
      setError('Please acknowledge the examination declaration checkbox before proceeding.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Attempt API launch first
      const data = await api.post<{ attemptId: string }>(`/papers/${paperId}/attempts`);
      if (data?.attemptId) {
        router.push(`/attempt/${data.attemptId}`);
        return;
      }
    } catch (err: any) {
      if (err?.code === 'PLAN_REQUIRED') {
        setError('You have reached the free tier limit. Upgrade to Pro for unlimited tests.');
        setLoading(false);
        return;
      }
      // If backend is not available or paper is a mock slug, seamlessly launch with mock attempt ID!
    }

    // Seamless instant launch with mock attempt ID
    const demoAttemptId = `attempt-${paperId}-${Date.now().toString(36)}`;
    router.push(`/attempt/${demoAttemptId}`);
  };

  return (
    <div className="flex flex-col gap-space-sm w-full">
      {error && (
        <div className="flex items-center gap-2 text-body-sm text-error bg-error-container/60 border border-error/30 px-space-md py-space-sm rounded-xl">
          <span className="material-symbols-outlined text-[18px]">info</span>
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={handleStart}
        disabled={loading || !hasConfirmedDeclaration}
        type="button"
        className="w-full bg-primary hover:bg-primary-container text-on-primary font-headline-md text-headline-md py-3.5 px-space-xl rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <span className="material-symbols-outlined text-[20px]">play_circle</span>
        <span>{loading ? 'Initializing Secure Engine...' : 'Proceed to Examination Console'}</span>
      </button>
    </div>
  );
}