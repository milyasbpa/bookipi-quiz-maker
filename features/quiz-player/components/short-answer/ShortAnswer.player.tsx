interface ShortAnswerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ShortAnswer({ value, onChange, placeholder, disabled }: ShortAnswerProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full rounded-xl border border-border bg-transparent p-4 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring disabled:opacity-50 min-h-30"
      rows={4}
    />
  );
}
