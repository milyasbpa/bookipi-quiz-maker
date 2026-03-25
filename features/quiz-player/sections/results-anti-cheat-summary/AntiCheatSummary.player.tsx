'use client';

import { AlertTriangle, ChevronDown, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface AntiCheatEvent {
  type: 'blur' | 'focus' | 'paste';
  timestamp: string;
}

interface AntiCheatSummaryPlayerProps {
  events?: AntiCheatEvent[];
}

export function AntiCheatSummaryPlayer({ events = [] }: AntiCheatSummaryPlayerProps) {
  const t = useTranslations('quiz-maker.results');
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const blurCount = events.filter((e) => e.type === 'blur').length;
  const pasteCount = events.filter((e) => e.type === 'paste').length;

  if (events.length === 0) {
    return (
      <div className="rounded-lg border-2 border-green-500 bg-green-50 p-8 dark:border-green-700 dark:bg-green-950">
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-6 text-green-600 dark:text-green-400" />
          <p className="font-medium text-green-600 dark:text-green-400">
            {t('no-suspicious-activity')}
          </p>
        </div>
        <p className="text-muted-foreground mt-2 text-sm">{t('activity-log-note')}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border-2 border-orange-500 bg-orange-50 p-8 dark:border-orange-700 dark:bg-orange-950">
      <div className="flex items-center gap-3">
        <AlertTriangle className="size-6 text-orange-600 dark:text-orange-400" />
        <p className="font-semibold text-orange-700 dark:text-orange-300">
          {t('activity-detected')}
        </p>
      </div>

      <div className="mt-4 space-y-2 text-sm text-orange-700 dark:text-orange-300">
        {blurCount > 0 && (
          <p>
            • Tab switches: <span className="font-semibold">{blurCount}</span>{' '}
            {blurCount === 1 ? 'time' : 'times'}
          </p>
        )}
        {pasteCount > 0 && (
          <p>
            • Paste events: <span className="font-semibold">{pasteCount}</span>{' '}
            {pasteCount === 1 ? 'time' : 'times'}
          </p>
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={() => setIsDetailOpen(!isDetailOpen)}
          className="flex items-center gap-2 text-sm font-medium text-orange-700 hover:text-orange-800 dark:text-orange-300 dark:hover:text-orange-200"
        >
          View detailed log
          <ChevronDown
            className={`size-4 transition-transform ${isDetailOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isDetailOpen && (
          <div className="mt-3 max-h-60 overflow-y-auto rounded-md border border-orange-300 bg-white p-3 dark:border-orange-800 dark:bg-orange-950/50">
            <ul className="space-y-2 text-xs">
              {events.map((event, index) => (
                <li key={index} className="font-mono text-orange-600 dark:text-orange-400">
                  <span className="opacity-60">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>{' '}
                  -{' '}
                  <span className="font-medium">
                    {event.type === 'blur'
                      ? 'Window blur (tab switch)'
                      : event.type === 'focus'
                        ? 'Window focus (returned)'
                        : 'Paste detected'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
