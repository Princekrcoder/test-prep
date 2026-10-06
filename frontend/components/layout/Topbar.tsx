'use client';

export function Topbar() {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-outline-variant z-40 flex items-center justify-between px-gutter">
      <div className="flex items-center gap-space-md flex-1 max-w-xl">
        <div className="relative w-full max-w-sm">
          <span className="absolute left-space-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search mock tests, topics..."
            className="w-full h-10 pl-10 pr-space-md bg-surface-container-low rounded-xl text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-surface-container transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-space-md">
        <button className="relative w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
          🔔
        </button>
        <div className="flex items-center gap-space-sm pl-space-xs py-1 pr-space-sm rounded-full bg-surface-container-low">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-on-primary text-sm font-bold">U</span>
          </div>
          <span className="text-label-md text-on-surface hidden sm:block">User</span>
        </div>
      </div>
    </header>
  );
}
