/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';

import { Button, Dialog, Input, MCQOptions } from '@/core/components';

import type { Question } from '../../store/quiz-create.store';

interface QuestionEditModalProps {
  isOpen: boolean;
  question: Question | null;
  questionIndex: number;
  onClose: () => void;
  onSave: (index: number, question: Question) => void;
  translations: {
    title: string;
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
    cancelButton: string;
    saveButton: string;
  };
}

export function QuestionEditModal({
  isOpen,
  question,
  questionIndex,
  onClose,
  onSave,
  translations,
}: QuestionEditModalProps) {
  const [questionType, setQuestionType] = useState<'mcq' | 'short'>('mcq');
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [correctIndex, setCorrectIndex] = useState(-1);
  const [shortAnswer, setShortAnswer] = useState('');

  // Pre-fill form when question changes
  useEffect(() => {
    if (question) {
      setQuestionType(question.type);
      setPrompt(question.prompt);

      if (question.type === 'mcq' && question.options) {
        setOptions(question.options);
        setCorrectIndex(typeof question.correctAnswer === 'number' ? question.correctAnswer : -1);
        setShortAnswer('');
      } else if (question.type === 'short') {
        setShortAnswer(String(question.correctAnswer || ''));
        setOptions(['', '']);
        setCorrectIndex(-1);
      } else {
        setOptions(['', '']);
        setCorrectIndex(-1);
        setShortAnswer('');
      }
    }
  }, [question]);

  const handleSave = (e: React.FormEvent) => {
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

      const updatedQuestion: Question = {
        type: questionType,
        prompt: prompt.trim(),
        options: filteredOptions,
        correctAnswer: correctIndex,
      };

      onSave(questionIndex, updatedQuestion);
    } else if (questionType === 'short') {
      if (!shortAnswer.trim()) {
        return;
      }

      const updatedQuestion: Question = {
        type: questionType,
        prompt: prompt.trim(),
        correctAnswer: shortAnswer.trim(),
      };

      onSave(questionIndex, updatedQuestion);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} title={translations.title} size="xl">
      <form onSubmit={handleSave} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{translations.questionTypeLabel}</label>
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value as 'mcq' | 'short')}
            className="w-full rounded-xl border p-3"
          >
            <option value="mcq">{translations.multipleChoiceLabel}</option>
            <option value="short">{translations.shortAnswerLabel}</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{translations.questionPromptLabel}</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={translations.enterQuestionPlaceholder}
            className="w-full rounded-xl border p-3"
            rows={2}
            required
          />
        </div>

        {questionType === 'mcq' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">{translations.optionsLabel}</label>
            <MCQOptions
              options={options}
              onChange={setOptions}
              selectedCorrectIndex={correctIndex}
              onSelectCorrect={setCorrectIndex}
              addOptionButtonLabel={translations.addOptionButton}
              optionPlaceholder={translations.optionPlaceholder}
              selectCorrectHint={translations.selectCorrectHint}
            />
          </div>
        )}

        {questionType === 'short' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">{translations.correctAnswerLabel}</label>
            <Input
              value={shortAnswer}
              onChange={(e) => setShortAnswer(e.target.value)}
              placeholder={translations.correctAnswerPlaceholder}
              required
            />
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            {translations.cancelButton}
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            {translations.saveButton}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
