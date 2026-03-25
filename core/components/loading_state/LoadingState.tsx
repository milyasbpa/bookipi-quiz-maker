import * as React from 'react';
import { MoonLoader } from 'react-spinners';

import { cn } from '@/core/lib/utils';

export interface LoadingStateProps {
  message?: string;
  size?: number;
  color?: string;
  className?: string;
  minHeight?: string;
}

export function LoadingState({
  message,
  size = 60,
  color = 'hsl(var(--primary))',
  className,
  minHeight = 'min-h-100',
}: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', minHeight, className)}>
      <MoonLoader color={color} size={size} speedMultiplier={0.8} />
      {message && <p className="text-muted-foreground text-sm">{message}</p>}
    </div>
  );
}
