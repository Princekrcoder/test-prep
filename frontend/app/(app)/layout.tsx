import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen w-full">
        <Topbar />
        <main className="pt-16 flex-1 px-gutter py-space-lg">
          {children}
        </main>
      </div>
    </div>
  );
}
