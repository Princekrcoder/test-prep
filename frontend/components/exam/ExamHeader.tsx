'use client';

import { cn } from '@/lib/utils';
import { formatTimeMs } from '@/hooks/useExamClock';

interface Props {
  paperTitle: string;
  remaining: number;
  syncState: string;
  onTogglePalette?: () => void;
  onSubmit: () => void;
  answeredCount: number;
  totalCount: number;
  onToggleCalc?: () => void;
  onToggleGuide?: () => void;
  candidateName?: string;
  rollNumber?: string;
  stationInfo?: string;
}

const SYNC: Record<string, { text: string; color: string }> = {
  synced:  { text: 'Autosaved ✓', color: 'text-tertiary' },
  pending: { text: 'Saving...',   color: 'text-on-surface-variant' },
  offline: { text: 'Local IDB',   color: 'text-amber-600' },
  blocked: { text: 'Sync Delay',  color: 'text-error' },
};

export function ExamHeader({
  paperTitle,
  remaining,
  syncState,
  onTogglePalette,
  onSubmit,
  answeredCount,
  totalCount,
  onToggleCalc,
  onToggleGuide,
  candidateName = 'Prince Kumar',
  rollNumber = 'Roll #TP-982143',
  stationInfo = 'Station 14 • Hall B',
}: Props) {
  const sync = SYNC[syncState] ?? SYNC.synced;
  const isLow = remaining > 0 && remaining < 5 * 60 * 1000;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/40 z-40 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-full w-full px-space-md sm:px-gutter flex items-center justify-between gap-space-sm">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-space-sm sm:gap-space-md min-w-0 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">quiz</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-on-surface tracking-tight leading-none">
              TestPrep
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase mt-0.5 hidden xs:block">
              Assessment Portal
            </span>
          </div>
        </div>

        {/* Center: Active Session Banner (hidden on mobile, visible on desktop) */}
        <div className="hidden lg:flex items-center justify-center flex-1 max-w-xl px-space-md">
          <div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-1.5 rounded-full shadow-[0_1px_2px_rgba(15,23,42,0.03)] border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            <span className="font-label-md text-label-md text-on-surface font-semibold truncate max-w-[280px]">
              {paperTitle}
            </span>
            <span className="text-outline-variant font-label-sm">•</span>
            <span className="font-label-sm text-label-sm text-secondary-fixed-dim bg-secondary/10 px-2 py-0.5 rounded-full font-bold">
              Session Active
            </span>
          </div>
        </div>

        {/* Right: Aux Tools + Timer + Proctored badge + Candidate Profile */}
        <div className="flex items-center gap-space-xs sm:gap-space-sm flex-shrink-0">
          {/* Virtual Calculator Trigger */}
          {onToggleCalc && (
            <button
              onClick={onToggleCalc}
              className="flex items-center gap-1 bg-surface-container-low hover:bg-surface-container text-on-surface px-2.5 sm:px-space-sm py-1.5 sm:py-2 rounded-lg font-label-md text-label-md transition-all shadow-xs border border-outline-variant/30"
              type="button"
              title="Open Virtual Scientific Calculator"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">calculate</span>
              <span className="hidden md:inline font-semibold">Calculator</span>
            </button>
          )}

          {/* Paper Guide Trigger */}
          {onToggleGuide && (
            <button
              onClick={onToggleGuide}
              className="flex items-center gap-1 bg-surface-container-low hover:bg-surface-container text-on-surface px-2.5 sm:px-space-sm py-1.5 sm:py-2 rounded-lg font-label-md text-label-md transition-all shadow-xs border border-outline-variant/30"
              type="button"
              title="View Test Instructions & Rules"
            >
              <span className="material-symbols-outlined text-[18px]">info</span>
              <span className="hidden md:inline font-semibold">Paper Guide</span>
            </button>
          )}

          {/* Proctored status */}
          <div className="hidden sm:flex items-center gap-1 bg-surface-container-low px-space-sm py-1 rounded-full border border-outline-variant/30">
            <span className="material-symbols-outlined text-tertiary text-[16px]">videocam</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Proctored</span>
          </div>

          {/* Countdown Clock Badge */}
          <div
            className={cn(
              'flex items-center gap-space-xs px-2.5 sm:px-space-md py-1 rounded-xl shadow-inner border transition-all',
              isLow
                ? 'bg-error-container/50 border-error/40 text-error animate-pulse'
                : 'bg-surface-container-high border-outline-variant/40 text-on-surface'
            )}
          >
            <span className={cn('material-symbols-outlined text-[18px]', isLow ? 'text-error' : 'text-primary')}>
              timer
            </span>
            <div className="flex flex-col text-right">
              <span className="font-label-sm text-[10px] text-on-surface-variant leading-none uppercase tracking-wider hidden sm:block">
                Time Left
              </span>
              <span className="timer-digits font-exam-numeric text-exam-numeric font-bold tracking-wider">
                {formatTimeMs(remaining)}
              </span>
            </div>
          </div>

          {/* Mobile Palette Drawer Trigger */}
          {onTogglePalette && (
            <button
              onClick={onTogglePalette}
              className="lg:hidden px-2.5 py-1.5 bg-surface-container-low hover:bg-surface-container rounded-lg text-label-md text-on-surface font-semibold flex items-center gap-1 border border-outline-variant/30"
              aria-label="Open question palette"
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
              <span className="text-xs">{answeredCount}/{totalCount}</span>
            </button>
          )}

          {/* Candidate Roll / Station Pill */}
          <div className="hidden xl:flex flex-col text-right pl-space-xs">
            <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight truncate max-w-[120px]">
              {candidateName}
            </span>
            <span className="font-label-sm text-[10px] text-on-surface-variant leading-none mt-0.5">
              {stationInfo}
            </span>
          </div>

          {/* Candidate Avatar */}
          <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center flex-shrink-0 font-bold text-xs shadow-xs border border-primary/20">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>

          {/* Top Submit CTA */}
          <button
            onClick={onSubmit}
            className="bg-error hover:bg-error/90 text-on-error font-label-md text-label-md px-2.5 sm:px-space-md py-1.5 sm:py-2 rounded-lg font-bold transition-all shadow-sm flex items-center gap-1 hover:shadow-md"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span className="hidden sm:inline">Submit Test</span>
            <span className="sm:hidden text-xs">Submit</span>
          </button>
        </div>
      </div>
    </header>
  );
}
