'use client';

import * as React from 'react';

import { cn } from '@/core/lib/utils';

export interface PaginationInfoProps {
  from: number;
  to: number;
  total: number;
  label?: string;
  className?: string;
}

export function PaginationInfo({ from, to, total, label, className }: PaginationInfoProps) {
  const text = label ?? `Showing ${from}–${to} of ${total}`;

  return (
    <span className={cn('text-muted-foreground text-sm tabular-nums', className)}>{text}</span>
  );
}
