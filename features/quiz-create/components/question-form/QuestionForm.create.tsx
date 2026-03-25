'use client';

import { useState } from 'react';

import { MCQOptions } from '@/core/components';
import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';

import type { Question } from '../../store/quiz-create.store';

interface QuestionFormProps {
  onAdd: (question: Question) => void;

  addQuestionTitle: string;
  questionTypeLabel: string;
  multipleChoiceLabel: string;
  shortAnswerLabel: string;
  questionPromptLabel: string;
  enterQuestionPlaceholder: string;
  optionsLabel: string;
  correctAnswerLabel: string;
  correctAnswerPlaceholder: string;
  addOptionButton: string;
  optionPlaceholder: string;
  selectCorrectHint: string;
  addQuestionButton: string;
}

export function QuestionForm({
  onAdd,
  addQuestionTitle,
  questionTypeLabel,
  multipleChoiceLabel,
  shortAnswerLabel,
  questionPromptLabel,
  enterQuestionPlaceholder,
  optionsLabel,
  correctAnswerLabel,
  correctAnswerPlaceholder,
  addOptionButton,
  optionPlaceholder,
  selectCorrectHint,
  addQuestionButton,
}: QuestionFormProps) {
  const [questionType, setQuestionType] = useState<'mcq' | 'short'>('mcq');
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [correctIndex, setCorrectIndex] = useState(-1);
  const [shortAnswer, setShortAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      return;
    }

    if (questionType === 'mcq') {
      const filteredOptions = options.filter((opt) => opt.trim());
      if (filteredOptions.length < 2) {
        return;
      }
      if (correctIndex === -1) {
        return;
      }

      const question: Question = {
        type: questionType,
        prompt: prompt.trim(),
        options: filteredOptions,
        correctAnswer: correctIndex,
      };

      onAdd(question);
    } else {
      if (!shortAnswer.trim()) {
        return;
      }

      const question: Question = {
        type: questionType,
        prompt: prompt.trim(),
        correctAnswer: shortAnswer.trim(),
      };

      onAdd(question);
    }

    setPrompt('');
    setOptions(['', '']);
    setCorrectIndex(-1);
    setShortAnswer('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
      <h3 className="font-semibold">{addQuestionTitle}</h3>

      <div className="space-y-2">
        <label className="text-sm font-medium">{questionTypeLabel}</label>
        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value as 'mcq' | 'short')}
          className="w-full rounded-xl border p-3"
        >
          <option value="mcq">{multipleChoiceLabel}</option>
          <option value="short">{shortAnswerLabel}</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{questionPromptLabel}</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={enterQuestionPlaceholder}
          className="w-full rounded-xl border p-3"
          rows={2}
          required
        />
      </div>

      {questionType === 'mcq' && (
        <div className="space-y-2">
          <label className="text-sm font-medium">{optionsLabel}</label>
          <MCQOptions
            options={options}
            onChange={setOptions}
            selectedCorrectIndex={correctIndex}
            onSelectCorrect={setCorrectIndex}
            addOptionButtonLabel={addOptionButton}
            optionPlaceholder={optionPlaceholder}
            selectCorrectHint={selectCorrectHint}
          />
        </div>
      )}

      {questionType === 'short' && (
        <div className="space-y-2">
          <label className="text-sm font-medium">{correctAnswerLabel}</label>
          <Input
            value={shortAnswer}
            onChange={(e) => setShortAnswer(e.target.value)}
            placeholder={correctAnswerPlaceholder}
            required
          />
        </div>
      )}

      <Button type="submit" variant="outline" className="w-full">
        + {addQuestionButton}
      </Button>
    </form>
  );
}
