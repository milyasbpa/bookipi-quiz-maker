import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { QuizCreateContainer } from './QuizCreate.container';

vi.mock('../sections/quiz-info', () => ({
  QuizInfo: () => <div data-testid="quiz-info-section">Quiz Info Section</div>,
}));

vi.mock('../sections/add-questions', () => ({
  AddQuestions: () => <div data-testid="add-questions-section">Add Questions Section</div>,
}));

vi.mock('@/core/components', () => ({
  StepIndicator: ({ currentStep, totalSteps }: any) => (
    <div data-testid="step-indicator">
      Step {currentStep} of {totalSteps}
    </div>
  ),
}));

let mockCurrentStep = 1;

vi.mock('../store/quiz-create.store', () => ({
  useQuizCreateStore: vi.fn((selector) =>
    selector ? selector({ currentStep: mockCurrentStep }) : { currentStep: mockCurrentStep },
  ),
}));

describe('QuizCreateContainer', () => {
  beforeEach(() => {
    mockCurrentStep = 1;
  });

  it('renders step indicator', () => {
    render(<QuizCreateContainer />);
    expect(screen.getByTestId('step-indicator')).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 2')).toBeInTheDocument();
  });

  it('renders QuizInfo section on step 1', () => {
    mockCurrentStep = 1;

    render(<QuizCreateContainer />);
    expect(screen.getByTestId('quiz-info-section')).toBeInTheDocument();
    expect(screen.queryByTestId('add-questions-section')).not.toBeInTheDocument();
  });

  it('renders AddQuestions section on step 2', () => {
    mockCurrentStep = 2;

    render(<QuizCreateContainer />);
    expect(screen.queryByTestId('quiz-info-section')).not.toBeInTheDocument();
    expect(screen.getByTestId('add-questions-section')).toBeInTheDocument();
  });

  it('applies correct container styles', () => {
    const { container } = render(<QuizCreateContainer />);
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('min-h-screen', 'bg-background', 'p-6');
  });

  it('has max-w-6xl inner container', () => {
    render(<QuizCreateContainer />);
    const innerDiv = screen.getByTestId('step-indicator').parentElement;
    expect(innerDiv).toHaveClass('mx-auto', 'max-w-6xl');
  });
});
