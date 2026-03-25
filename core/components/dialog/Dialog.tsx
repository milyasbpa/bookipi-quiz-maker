'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/core/lib/utils';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  size = 'lg',
}: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />

        {/* Content */}
        <DialogPrimitive.Content
          className={cn(
            'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2',
            'flex flex-col gap-4 rounded-2xl border p-6 shadow-lg duration-200 outline-none',
            'max-h-[90vh] overflow-y-auto',
            sizeClasses[size],
            className,
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {title && (
                <DialogPrimitive.Title className="text-lg font-semibold">
                  {title}
                </DialogPrimitive.Title>
              )}
              {description && (
                <DialogPrimitive.Description className="text-muted-foreground mt-1 text-sm">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close className="text-muted-foreground hover:text-foreground rounded-sm opacity-70 transition-opacity hover:opacity-100">
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>

          <div className="flex-1">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
