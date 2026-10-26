import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-space-xs py-0.5 text-label-sm font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-on-primary',
        secondary: 'bg-secondary-container text-on-secondary-container',
        success: 'bg-tertiary-container text-on-tertiary-container',
        warning: 'bg-yellow-100 text-yellow-800',
        destructive: 'bg-error-container text-on-error-container',
        outline: 'border border-outline-variant text-on-surface-variant',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
