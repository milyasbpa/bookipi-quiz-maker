import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { QuizListContainer } from './QuizList.container';

vi.mock('../sections/list', () => ({
  List: () => <div data-testid="list-section">List Section</div>,
}));

vi.mock('../sections/edit-quiz', () => ({
  Edit: () => <div data-testid="edit-section">Edit Section</div>,
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('QuizListContainer', () => {
  it('renders the page header', () => {
    render(<QuizListContainer />);
    expect(screen.getByText('page-title')).toBeInTheDocument();
    expect(screen.getByText('page-subtitle')).toBeInTheDocument();
  });

  it('renders the List section', () => {
    render(<QuizListContainer />);
    expect(screen.getByTestId('list-section')).toBeInTheDocument();
  });

  it('renders the Edit section', () => {
    render(<QuizListContainer />);
    expect(screen.getByTestId('edit-section')).toBeInTheDocument();
  });

  it('applies correct container styles', () => {
    const { container } = render(<QuizListContainer />);
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('container', 'mx-auto', 'max-w-6xl');
  });
});
