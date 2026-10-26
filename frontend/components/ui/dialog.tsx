'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DialogProps { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode; }

function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => onOpenChange(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md">{children}</div>
        </>
      )}
    </AnimatePresence>
  );
}

const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <motion.div ref={ref as any} className={cn('relative z-50 w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant p-space-xl', className)} initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ duration: 0.2 }} onClick={(e: React.MouseEvent) => e.stopPropagation()} {...(props as any)}>{children}</motion.div>
  )
);
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn('mb-space-lg', className)} {...props} />;
const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => <h2 ref={ref} className={cn('font-display text-headline-lg text-on-surface', className)} {...props} />);
DialogTitle.displayName = 'DialogTitle';
const DialogDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p className={cn('text-body-md text-on-surface-variant mt-space-xs', className)} {...props} />;
const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn('flex justify-end gap-space-sm mt-space-lg', className)} {...props} />;

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };

