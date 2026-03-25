import { Plus, Trash2 } from 'lucide-react';

import { Button } from '../button';
import { Input } from '../input';

interface MCQOptionsProps {
  options: string[];
  onChange: (options: string[] | ((prev: string[]) => string[])) => void;
  selectedCorrectIndex?: number;
  onSelectCorrect: (index: number) => void;
  disabled?: boolean;
  addOptionButtonLabel: string;
  optionPlaceholder: string;
  selectCorrectHint: string;
}

export function MCQOptions({
  options,
  onChange,
  selectedCorrectIndex,
  onSelectCorrect,
  disabled,
  addOptionButtonLabel,
  optionPlaceholder,
  selectCorrectHint,
}: MCQOptionsProps) {
  const handleOptionChange = (index: number, value: string) => {
    onChange((prev) => {
      const newOptions = [...prev];
      newOptions[index] = value;
      return newOptions;
    });
  };

  const addOption = () => {
    onChange((prev) => {
      if (prev.length < 6) {
        return [...prev, ''];
      }
      return prev;
    });
  };

  const removeOption = (index: number) => {
    onChange((prev) => {
      if (prev.length > 1) {
        // Adjust correct answer if we deleted the selected one
        if (selectedCorrectIndex === index) {
          onSelectCorrect(0);
        } else if (selectedCorrectIndex !== undefined && selectedCorrectIndex > index) {
          // Adjust index if we deleted an option before the selected one
          onSelectCorrect(selectedCorrectIndex - 1);
        }
        return prev.filter((_, i) => i !== index);
      }
      return prev;
    });
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="radio"
            checked={selectedCorrectIndex === index}
            onChange={() => onSelectCorrect(index)}
            disabled={disabled}
            className="shrink-0 size-4 cursor-pointer disabled:cursor-not-allowed"
          />
          <Input
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={optionPlaceholder}
            disabled={disabled}
            className="flex-1"
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => removeOption(index)}
            disabled={disabled || options.length <= 1}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        onClick={addOption}
        disabled={disabled || options.length >= 6}
        className="w-full"
      >
        <Plus className="size-4" />
        {addOptionButtonLabel}
      </Button>

      <p className="text-sm text-muted-foreground">
        {selectCorrectHint}
      </p>
    </div>
  );
}
