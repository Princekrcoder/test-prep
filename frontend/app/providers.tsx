'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,        // 60s — don't refetch if data is fresh
            gcTime: 5 * 60 * 1000,       // 5min cache
            retry: 1,
            refetchOnWindowFocus: false, // don't spam requests on tab switch
          },
        },
      })
  );

  // Warm up Render backend on app load — prevents cold-start on first API call
  useEffect(() => {
    fetch('/api/health/warmup', { cache: 'no-store' }).catch(() => {
      // Silent — a failed warmup must never block or degrade the UI
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
