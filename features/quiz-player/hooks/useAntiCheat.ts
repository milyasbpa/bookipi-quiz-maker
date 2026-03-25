'use client';

import { useCallback, useEffect, useRef } from 'react';

import { useRecordEvent } from '../react-query';
import { usePlayerStore } from '../store/player.store';

interface UseAntiCheatOptions {
  attemptId: number | null;
  enabled: boolean;
}

export function useAntiCheat({ attemptId, enabled }: UseAntiCheatOptions) {
  const recordEventMutation = useRecordEvent(attemptId || 0);
  const addAntiCheatEvent = usePlayerStore((s) => s.addAntiCheatEvent);
  const isRecordingRef = useRef(false);

  const recordEvent = useCallback(
    (eventType: 'blur' | 'focus' | 'paste') => {
      if (!enabled || !attemptId || isRecordingRef.current) return;

      const event = {
        type: eventType,
        timestamp: new Date().toISOString(),
      };

      addAntiCheatEvent(event);

      isRecordingRef.current = true;

      recordEventMutation.mutate(
        {
          id: attemptId,
          data: { event: JSON.stringify(event) },
        },
        {
          onSettled: () => {
            isRecordingRef.current = false;
          },
        },
      );
    },
    [enabled, attemptId, addAntiCheatEvent, recordEventMutation],
  );

  useEffect(() => {
    if (!enabled || !attemptId) return;

    const handleBlur = () => recordEvent('blur');
    const handleFocus = () => recordEvent('focus');
    const handlePaste = () => recordEvent('paste');

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('paste', handlePaste);
    };
  }, [attemptId, enabled, recordEvent]);

  return { recordEvent };
}
