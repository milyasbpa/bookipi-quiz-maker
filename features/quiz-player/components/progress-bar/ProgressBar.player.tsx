interface ProgressBarProps {
  current: number;
  total: number;
  progressLabel: string;
  ofLabel: string;
}

export function ProgressBar({ current, total, progressLabel, ofLabel }: ProgressBarProps) {
  const percentage = ((current + 1) / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          {progressLabel} {current + 1} {ofLabel} {total}
        </span>
        <span className="font-medium text-foreground">{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 rounded-full bg-accent overflow-hidden">
        <div
          className="h-full bg-brand transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
