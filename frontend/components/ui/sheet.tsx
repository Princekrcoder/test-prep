'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SheetProps { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode; side?: 'left' | 'right' | 'bottom'; }

function Sheet({ open, onOpenChange, children, side = 'right' }: SheetProps) {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onOpenChange(false); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onOpenChange]);

  const variants = { right: { hidden: { x: '100%' }, visible: { x: 0 } }, left: { hidden: { x: '-100%' }, visible: { x: 0 } }, bottom: { hidden: { y: '100%' }, visible: { y: 0 } } };
  const sideClass = { right: 'top-0 right-0 h-full w-80 max-w-full', left: 'top-0 left-0 h-full w-80 max-w-full', bottom: 'bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl' };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-black/40 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => onOpenChange(false)} />
          <motion.div className={cn('fixed z-50 bg-surface-container-lowest shadow-xl overflow-y-auto flex flex-col', sideClass[side])} initial={variants[side].hidden} animate={variants[side].visible} exit={variants[side].hidden} transition={{ type: 'spring', damping: 30, stiffness: 300 }}>{children}</motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn('flex items-center justify-between p-space-lg border-b border-outline-variant flex-shrink-0', className)} {...props} />;
const SheetTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className={cn('font-display text-headline-md text-on-surface', className)} {...props} />;
const SheetContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn('p-space-lg flex-1 overflow-y-auto', className)} {...props} />;

export { Sheet, SheetHeader, SheetTitle, SheetContent };

