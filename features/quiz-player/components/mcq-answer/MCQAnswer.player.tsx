interface MCQAnswerProps {
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function MCQAnswer({ options, selectedValue, onChange, disabled }: MCQAnswerProps) {
  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const optionValue = index.toString();
        const isSelected = selectedValue === optionValue;

        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(optionValue)}
            disabled={disabled}
            className={`w-full rounded-xl border p-4 text-left transition-all ${
              isSelected
                ? 'border-brand bg-brand/10 ring-brand/20 ring-2'
                : 'border-border hover:border-ring hover:bg-accent/50'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${isSelected ? 'border-brand' : 'border-border'} `}
              >
                {isSelected && <div className="bg-brand size-2.5 rounded-full" />}
              </div>
              <div className="flex-1">
                <span className="text-foreground">{option}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
