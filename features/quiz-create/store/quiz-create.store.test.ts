import { describe, expect, it, beforeEach } from 'vitest';

import { useQuizCreateStore } from './quiz-create.store';

describe('useQuizCreateStore', () => {
  beforeEach(() => {
    const store = useQuizCreateStore.getState();
    store.reset();
  });

  it('initializes with correct default values', () => {
    const state = useQuizCreateStore.getState();

    expect(state.currentStep).toBe(1);
    expect(state.quizMetadata).toBeNull();
    expect(state.questions).toEqual([]);
  });

  it('moves to next step and stores quiz metadata', () => {
    const { nextStep } = useQuizCreateStore.getState();

    const metadata = {
      title: 'Test Quiz',
      description: 'Test Description',
      timeLimitSeconds: 300,
    };

    nextStep(metadata);

    const state = useQuizCreateStore.getState();
    expect(state.currentStep).toBe(2);
    expect(state.quizMetadata).toEqual(metadata);
  });

  it('moves to next step with null timeLimitSeconds', () => {
    const { nextStep } = useQuizCreateStore.getState();

    const metadata = {
      title: 'Test Quiz',
      description: 'Test Description',
      timeLimitSeconds: null,
    };

    nextStep(metadata);

    const state = useQuizCreateStore.getState();
    expect(state.currentStep).toBe(2);
    expect(state.quizMetadata?.timeLimitSeconds).toBeNull();
  });

  it('moves to next step without timeLimitSeconds', () => {
    const { nextStep } = useQuizCreateStore.getState();

    const metadata = {
      title: 'Test Quiz',
      description: 'Test Description',
    };

    nextStep(metadata);

    const state = useQuizCreateStore.getState();
    expect(state.currentStep).toBe(2);
    expect(state.quizMetadata?.timeLimitSeconds).toBeUndefined();
  });

  it('moves back to previous step', () => {
    const { nextStep, prevStep } = useQuizCreateStore.getState();

    nextStep({
      title: 'Test Quiz',
      description: 'Test Description',
    });

    expect(useQuizCreateStore.getState().currentStep).toBe(2);

    prevStep();

    expect(useQuizCreateStore.getState().currentStep).toBe(1);
  });

  it('adds question correctly', () => {
    const { addQuestion } = useQuizCreateStore.getState();

    const question = {
      type: 'mcq' as const,
      prompt: 'What is 2+2?',
      options: ['2', '3', '4', '5'],
      correctAnswer: 2,
    };

    addQuestion(question);

    const state = useQuizCreateStore.getState();
    expect(state.questions).toHaveLength(1);
    expect(state.questions[0]).toEqual(question);
  });

  it('adds multiple questions correctly', () => {
    const { addQuestion } = useQuizCreateStore.getState();

    const question1 = {
      type: 'mcq' as const,
      prompt: 'Question 1?',
      options: ['A', 'B'],
      correctAnswer: 0,
    };

    const question2 = {
      type: 'short' as const,
      prompt: 'Question 2?',
      correctAnswer: 'answer',
    };

    addQuestion(question1);
    addQuestion(question2);

    const state = useQuizCreateStore.getState();
    expect(state.questions).toHaveLength(2);
    expect(state.questions[0]).toEqual(question1);
    expect(state.questions[1]).toEqual(question2);
  });

  it('removes question by index correctly', () => {
    const { addQuestion, removeQuestion } = useQuizCreateStore.getState();

    addQuestion({
      type: 'mcq' as const,
      prompt: 'Q1?',
      options: ['A'],
      correctAnswer: 0,
    });

    addQuestion({
      type: 'short' as const,
      prompt: 'Q2?',
      correctAnswer: 'ans',
    });

    addQuestion({
      type: 'mcq' as const,
      prompt: 'Q3?',
      options: ['B'],
      correctAnswer: 0,
    });

    expect(useQuizCreateStore.getState().questions).toHaveLength(3);

    removeQuestion(1);

    const state = useQuizCreateStore.getState();
    expect(state.questions).toHaveLength(2);
    expect(state.questions[0].prompt).toBe('Q1?');
    expect(state.questions[1].prompt).toBe('Q3?');
  });

  it('removes first question correctly', () => {
    const { addQuestion, removeQuestion } = useQuizCreateStore.getState();

    addQuestion({
      type: 'mcq' as const,
      prompt: 'Q1?',
      options: ['A'],
      correctAnswer: 0,
    });

    addQuestion({
      type: 'short' as const,
      prompt: 'Q2?',
      correctAnswer: 'ans',
    });

    removeQuestion(0);

    const state = useQuizCreateStore.getState();
    expect(state.questions).toHaveLength(1);
    expect(state.questions[0].prompt).toBe('Q2?');
  });

  it('removes last question correctly', () => {
    const { addQuestion, removeQuestion } = useQuizCreateStore.getState();

    addQuestion({
      type: 'mcq' as const,
      prompt: 'Q1?',
      options: ['A'],
      correctAnswer: 0,
    });

    addQuestion({
      type: 'short' as const,
      prompt: 'Q2?',
      correctAnswer: 'ans',
    });

    removeQuestion(1);

    const state = useQuizCreateStore.getState();
    expect(state.questions).toHaveLength(1);
    expect(state.questions[0].prompt).toBe('Q1?');
  });

  it('resets all state to initial values', () => {
    const { nextStep, addQuestion, reset } = useQuizCreateStore.getState();

    nextStep({
      title: 'Test Quiz',
      description: 'Test',
      timeLimitSeconds: 300,
    });

    addQuestion({
      type: 'mcq' as const,
      prompt: 'Test?',
      options: ['A'],
      correctAnswer: 0,
    });

    expect(useQuizCreateStore.getState().currentStep).toBe(2);
    expect(useQuizCreateStore.getState().questions).toHaveLength(1);

    reset();

    const state = useQuizCreateStore.getState();
    expect(state.currentStep).toBe(1);
    expect(state.quizMetadata).toBeNull();
    expect(state.questions).toEqual([]);
  });

  it('handles workflow: step 1 → step 2 → add questions → reset', () => {
    const { nextStep, addQuestion, reset } = useQuizCreateStore.getState();

    nextStep({
      title: 'Full Workflow Quiz',
      description: 'Testing complete flow',
      timeLimitSeconds: 600,
    });

    expect(useQuizCreateStore.getState().currentStep).toBe(2);

    addQuestion({
      type: 'mcq' as const,
      prompt: 'MCQ Question?',
      options: ['A', 'B', 'C'],
      correctAnswer: 1,
    });

    addQuestion({
      type: 'short' as const,
      prompt: 'Short Question?',
      correctAnswer: 'answer',
    });

    expect(useQuizCreateStore.getState().questions).toHaveLength(2);

    reset();

    const state = useQuizCreateStore.getState();
    expect(state.currentStep).toBe(1);
    expect(state.quizMetadata).toBeNull();
    expect(state.questions).toEqual([]);
  });

  it('preserves quiz metadata when going back to step 1', () => {
    const { nextStep, prevStep } = useQuizCreateStore.getState();

    const metadata = {
      title: 'Test Quiz',
      description: 'Test Description',
      timeLimitSeconds: 300,
    };

    nextStep(metadata);
    prevStep();

    const state = useQuizCreateStore.getState();
    expect(state.currentStep).toBe(1);
    expect(state.quizMetadata).toEqual(metadata);
  });

  it('preserves questions when going back to step 1', () => {
    const { nextStep, addQuestion, prevStep } = useQuizCreateStore.getState();

    nextStep({
      title: 'Test Quiz',
      description: 'Test Description',
    });

    const question = {
      type: 'mcq' as const,
      prompt: 'Test?',
      options: ['A'],
      correctAnswer: 0,
    };

    addQuestion(question);
    prevStep();

    const state = useQuizCreateStore.getState();
    expect(state.currentStep).toBe(1);
    expect(state.questions).toHaveLength(1);
    expect(state.questions[0]).toEqual(question);
  });

  it('updates question by index correctly', () => {
    const { addQuestion, updateQuestion } = useQuizCreateStore.getState();

    const question1 = {
      type: 'mcq' as const,
      prompt: 'Original Question?',
      options: ['A', 'B'],
      correctAnswer: 0,
    };

    const question2 = {
      type: 'short' as const,
      prompt: 'Q2?',
      correctAnswer: 'answer',
    };

    addQuestion(question1);
    addQuestion(question2);

    const updatedQuestion = {
      type: 'mcq' as const,
      prompt: 'Updated Question?',
      options: ['X', 'Y', 'Z'],
      correctAnswer: 2,
    };

    updateQuestion(0, updatedQuestion);

    const state = useQuizCreateStore.getState();
    expect(state.questions).toHaveLength(2);
    expect(state.questions[0]).toEqual(updatedQuestion);
    expect(state.questions[1]).toEqual(question2);
  });

  it('updates last question correctly', () => {
    const { addQuestion, updateQuestion } = useQuizCreateStore.getState();

    addQuestion({
      type: 'mcq' as const,
      prompt: 'Q1?',
      options: ['A'],
      correctAnswer: 0,
    });

    addQuestion({
      type: 'short' as const,
      prompt: 'Q2?',
      correctAnswer: 'old',
    });

    const updated = {
      type: 'short' as const,
      prompt: 'Updated Q2?',
      correctAnswer: 'new',
    };

    updateQuestion(1, updated);

    const state = useQuizCreateStore.getState();
    expect(state.questions[1]).toEqual(updated);
  });

  it('reorders questions from start to end', () => {
    const { addQuestion, reorderQuestions } = useQuizCreateStore.getState();

    addQuestion({ type: 'mcq' as const, prompt: 'Q1', options: ['A'], correctAnswer: 0 });
    addQuestion({ type: 'mcq' as const, prompt: 'Q2', options: ['B'], correctAnswer: 0 });
    addQuestion({ type: 'mcq' as const, prompt: 'Q3', options: ['C'], correctAnswer: 0 });

    reorderQuestions(0, 2);

    const state = useQuizCreateStore.getState();
    expect(state.questions[0].prompt).toBe('Q2');
    expect(state.questions[1].prompt).toBe('Q3');
    expect(state.questions[2].prompt).toBe('Q1');
  });

  it('reorders questions from end to start', () => {
    const { addQuestion, reorderQuestions } = useQuizCreateStore.getState();

    addQuestion({ type: 'mcq' as const, prompt: 'Q1', options: ['A'], correctAnswer: 0 });
    addQuestion({ type: 'mcq' as const, prompt: 'Q2', options: ['B'], correctAnswer: 0 });
    addQuestion({ type: 'mcq' as const, prompt: 'Q3', options: ['C'], correctAnswer: 0 });

    reorderQuestions(2, 0);

    const state = useQuizCreateStore.getState();
    expect(state.questions[0].prompt).toBe('Q3');
    expect(state.questions[1].prompt).toBe('Q1');
    expect(state.questions[2].prompt).toBe('Q2');
  });

  it('reorders questions in middle', () => {
    const { addQuestion, reorderQuestions } = useQuizCreateStore.getState();

    addQuestion({ type: 'mcq' as const, prompt: 'Q1', options: ['A'], correctAnswer: 0 });
    addQuestion({ type: 'mcq' as const, prompt: 'Q2', options: ['B'], correctAnswer: 0 });
    addQuestion({ type: 'mcq' as const, prompt: 'Q3', options: ['C'], correctAnswer: 0 });
    addQuestion({ type: 'mcq' as const, prompt: 'Q4', options: ['D'], correctAnswer: 0 });

    reorderQuestions(1, 2);

    const state = useQuizCreateStore.getState();
    expect(state.questions[0].prompt).toBe('Q1');
    expect(state.questions[1].prompt).toBe('Q3');
    expect(state.questions[2].prompt).toBe('Q2');
    expect(state.questions[3].prompt).toBe('Q4');
  });
});
