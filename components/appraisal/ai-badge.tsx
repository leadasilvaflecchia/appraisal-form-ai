'use client';

import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AIBadge({ className, size = 'sm' }: { className?: string; size?: 'sm' | 'xs' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-1.5 py-0.5 text-[9px]',
        className
      )}
    >
      <Sparkles className={size === 'sm' ? 'h-3 w-3' : 'h-2.5 w-2.5'} />
      AI Extracted
    </span>
  );
}
