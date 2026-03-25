'use client';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export function StepIndicator({ currentStep, totalSteps = 2 }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              currentStep === step
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {step}
          </div>
          {index < totalSteps - 1 && <div className="bg-muted h-px w-48" />}
        </div>
      ))}
    </div>
  );
}
