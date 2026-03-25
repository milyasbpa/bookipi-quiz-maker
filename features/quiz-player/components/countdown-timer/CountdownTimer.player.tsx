'use client';

import { Clock } from 'lucide-react';
import { useEffect } from 'react';

interface CountdownTimerProps {
  remainingSeconds: number | null;
  onTick: (newSeconds: number) => void;
  onTimeUp: () => void;
  timeRemainingLabel: string;
}

export function CountdownTimer({
  remainingSeconds,
  onTick,
  onTimeUp,
  timeRemainingLabel,
}: CountdownTimerProps) {
  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds < 0) {
      return;
    }

    if (remainingSeconds === 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      onTick(Math.max(0, remainingSeconds - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds, onTick, onTimeUp]);

  if (remainingSeconds === null || remainingSeconds < 0) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-4 flex items-center gap-2 text-sm">
      <Clock className="size-4" />
      <span>
        {timeRemainingLabel}: <strong>{formatTime(remainingSeconds)}</strong>
      </span>
    </div>
  );
}
