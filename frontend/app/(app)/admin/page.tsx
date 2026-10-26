'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/query/auth';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPage() {
  const { data: user } = useAuth();

  if (user && user.role !== 'ADMIN' && user.role !== 'EDITOR') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-5xl mb-space-md">🔒</div>
          <h1 className="font-display text-headline-xl text-on-surface">Access Denied</h1>
          <p className="text-body-lg text-on-surface-variant mt-space-xs">You need Admin or Editor role to access this page.</p>
        </div>
      </div>
    );
  }

  const { data: questions } = useQuery({
    queryKey: ['admin-questions'],
    queryFn: () => api.get<any>('/admin/questions?status=DRAFT&limit=5'),
    enabled: !!user,
  });

  const { data: papers } = useQuery({
    queryKey: ['admin-papers'],
    queryFn: () => api.get<any[]>('/admin/papers'),
    enabled: !!user,
  });

  return (
    <div className="flex flex-col gap-space-lg max-w-5xl">
      <div>
        <h1 className="font-display text-headline-xl text-on-surface">Admin Panel</h1>
        <p className="text-body-md text-on-surface-variant mt-space-xs">Manage questions, papers, and users</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
        {[
          { label: 'Draft Questions', value: questions?.meta?.total ?? '—', href: '/admin/questions', icon: '📝' },
          { label: 'Published Papers', value: papers?.filter((p: any) => p.publishedAt)?.length ?? '—', href: '/admin/papers', icon: '📄' },
          { label: 'Total Papers', value: papers?.length ?? '—', href: '/admin/papers', icon: '📚' },
        ].map(({ label, value, href, icon }) => (
          <Link key={label} href={href} className="bg-surface-container-lowest rounded-xl border border-outline-variant p-space-lg hover:border-primary hover:shadow-sm transition-all">
            <div className="text-3xl mb-space-sm">{icon}</div>
            <div className="font-display text-headline-xl text-on-surface">{value}</div>
            <div className="text-label-md text-on-surface-variant">{label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-space-lg">
        <h2 className="font-display text-headline-md text-on-surface mb-space-md">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md">
          {[
            { label: 'Add Question', href: '/admin/questions/new', icon: '➕' },
            { label: 'Import Questions', href: '/admin/questions/import', icon: '📥' },
            { label: 'View Papers', href: '/admin/papers', icon: '📄' },
            { label: 'View Users', href: '/admin/users', icon: '👥' },
          ].map(({ label, href, icon }) => (
            <Link key={label} href={href} className="flex flex-col items-center gap-space-xs p-space-md bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors text-center">
              <span className="text-2xl">{icon}</span>
              <span className="text-label-md text-on-surface">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent draft questions */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-space-lg">
        <div className="flex items-center justify-between mb-space-md">
          <h2 className="font-display text-headline-md text-on-surface">Draft Questions</h2>
          <Link href="/admin/questions" className="text-label-md text-primary hover:underline">View all →</Link>
        </div>
        {!questions ? (
          <div className="flex flex-col gap-space-sm">{[1,2,3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : (questions as any)?.data?.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">No draft questions. Import or create some!</p>
        ) : (
          <div className="flex flex-col gap-space-xs">
            {(questions as any)?.data?.map((q: any) => (
              <Link key={q.id} href={`/admin/questions/${q.id}`} className="flex items-center justify-between p-space-sm rounded-xl hover:bg-surface-container transition-colors">
                <span className="text-body-md text-on-surface truncate flex-1">{q.stemMd?.slice(0, 60)}...</span>
                <span className="text-label-sm text-on-surface-variant ml-space-md flex-shrink-0">{q.topic?.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}