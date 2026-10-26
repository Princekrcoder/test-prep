'use client';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  paperTitle: string;
}

export function PaperGuideModal({ isOpen, onClose, paperTitle }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-space-md animate-fade-in">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-outline-variant/40">
        {/* Header */}
        <div className="bg-surface-container px-space-lg py-space-md flex items-center justify-between border-b border-outline-variant/30">
          <div className="flex items-center gap-space-xs text-on-surface font-headline-md text-headline-md font-bold">
            <span className="material-symbols-outlined text-primary text-[22px]">menu_book</span>
            <span>Paper Guide & Examination Rules</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-variant text-on-surface flex items-center justify-center transition-colors"
            type="button"
            aria-label="Close Guide"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-space-lg overflow-y-auto space-y-space-lg">
          <div>
            <h4 className="font-bold text-on-surface text-base mb-1">{paperTitle}</h4>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              Official Computer Based Test (CBT) benchmark pattern. Read and review the marking scheme and palette rules carefully.
            </p>
          </div>

          {/* Marking scheme grid */}
          <div className="grid grid-cols-2 gap-space-md bg-surface-container-low p-space-md rounded-xl">
            <div className="flex items-center gap-space-sm">
              <span className="w-9 h-9 rounded-xl bg-tertiary/15 text-tertiary flex items-center justify-center font-bold">
                +1.0
              </span>
              <div>
                <span className="text-label-md font-bold text-on-surface block">Correct Response</span>
                <span className="text-body-sm text-on-surface-variant">Full marks awarded</span>
              </div>
            </div>
            <div className="flex items-center gap-space-sm">
              <span className="w-9 h-9 rounded-xl bg-error/15 text-error flex items-center justify-center font-bold">
                -0.25
              </span>
              <div>
                <span className="text-label-md font-bold text-on-surface block">Incorrect Response</span>
                <span className="text-body-sm text-on-surface-variant">Penalty deducted</span>
              </div>
            </div>
          </div>

          {/* Palette Colors Guide */}
          <div>
            <h5 className="font-bold text-on-surface text-sm mb-space-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">palette</span>
              Question Palette State Meanings
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40">
                <span className="w-6 h-6 rounded-md bg-tertiary text-on-tertiary flex items-center justify-center font-bold text-[11px]">01</span>
                <div>
                  <span className="font-bold text-on-surface">Answered:</span>
                  <span className="text-on-surface-variant ml-1">You have chosen an option.</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40">
                <span className="w-6 h-6 rounded-md bg-surface-container text-on-surface-variant flex items-center justify-center font-bold text-[11px]">02</span>
                <div>
                  <span className="font-bold text-on-surface">Not Answered:</span>
                  <span className="text-on-surface-variant ml-1">Visited but no choice selected.</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40">
                <span className="w-6 h-6 rounded-md bg-secondary-container text-on-secondary-fixed flex items-center justify-center font-bold text-[11px]">03</span>
                <div>
                  <span className="font-bold text-on-surface">Marked for Review:</span>
                  <span className="text-on-surface-variant ml-1">Flagged for later review.</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40">
                <span className="w-6 h-6 rounded-md bg-primary text-on-primary flex items-center justify-center font-bold text-[11px]">04</span>
                <div>
                  <span className="font-bold text-on-surface">Ans & Marked:</span>
                  <span className="text-on-surface-variant ml-1">Answered and flagged (evaluated).</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 col-span-1 sm:col-span-2">
                <span className="w-6 h-6 rounded-md bg-white border border-outline-variant text-outline flex items-center justify-center font-bold text-[11px]">05</span>
                <div>
                  <span className="font-bold text-on-surface">Not Visited:</span>
                  <span className="text-on-surface-variant ml-1">Questions not yet opened.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <h5 className="font-bold text-on-surface text-sm mb-space-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">keyboard</span>
              Keyboard Navigation Hotkeys
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-surface-container-low text-center">
                <kbd className="px-1.5 py-0.5 rounded bg-surface-container-lowest font-mono font-bold text-primary shadow-xs">1 - 4</kbd>
                <span className="block mt-1 text-on-surface-variant">Select Option</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container-low text-center">
                <kbd className="px-1.5 py-0.5 rounded bg-surface-container-lowest font-mono font-bold text-primary shadow-xs">Alt + N</kbd>
                <span className="block mt-1 text-on-surface-variant">Save & Next</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container-low text-center">
                <kbd className="px-1.5 py-0.5 rounded bg-surface-container-lowest font-mono font-bold text-primary shadow-xs">Alt + P</kbd>
                <span className="block mt-1 text-on-surface-variant">Previous</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container-low text-center">
                <kbd className="px-1.5 py-0.5 rounded bg-surface-container-lowest font-mono font-bold text-primary shadow-xs">Alt + M</kbd>
                <span className="block mt-1 text-on-surface-variant">Mark Review</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-surface-container px-space-lg py-space-sm flex justify-end border-t border-outline-variant/30">
          <button
            onClick={onClose}
            className="px-space-lg py-2 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-all"
            type="button"
          >
            Back to Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
