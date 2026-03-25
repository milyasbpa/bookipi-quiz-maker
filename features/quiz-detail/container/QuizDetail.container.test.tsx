import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { QuizDetailContainer } from './QuizDetail.container';

vi.mock('../sections/quiz-header', () => ({
  QuizHeader: () => <div data-testid="quiz-header">Quiz Header</div>,
}));

vi.mock('../sections/question-list', () => ({
  QuestionList: () => <div data-testid="question-list">Question List</div>,
}));

vi.mock('../sections/add-question-modal', () => ({
  AddQuestionModal: () => <div data-testid="add-question-modal">Add Question Modal</div>,
}));

vi.mock('../sections/edit-question-modal', () => ({
  EditQuestionModal: () => <div data-testid="edit-question-modal">Edit Question Modal</div>,
}));

vi.mock('../sections/edit-quiz', () => ({
  Edit: () => <div data-testid="edit-quiz">Edit Quiz</div>,
}));

describe('QuizDetailContainer', () => {
  it('renders quiz header section', () => {
    render(<QuizDetailContainer />);
    expect(screen.getByTestId('quiz-header')).toBeInTheDocument();
  });

  it('renders question table section', () => {
    render(<QuizDetailContainer />);
    expect(screen.getByTestId('question-list')).toBeInTheDocument();
  });

  it('renders add question modal', () => {
    render(<QuizDetailContainer />);
    expect(screen.getByTestId('add-question-modal')).toBeInTheDocument();
  });

  it('renders edit question modal', () => {
    render(<QuizDetailContainer />);
    expect(screen.getByTestId('edit-question-modal')).toBeInTheDocument();
  });

  it('renders edit quiz modal', () => {
    render(<QuizDetailContainer />);
    expect(screen.getByTestId('edit-quiz')).toBeInTheDocument();
  });

  it('applies correct container styles', () => {
    const { container } = render(<QuizDetailContainer />);
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('container', 'mx-auto', 'max-w-6xl', 'space-y-6', 'p-6');
  });
});
