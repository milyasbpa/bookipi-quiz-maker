import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LoadingState } from './LoadingState';

describe('LoadingState', () => {
  it('renders loading container', () => {
    const { container } = render(<LoadingState />);
    const wrapper = container.firstChild;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
  });

  it('renders message when provided', () => {
    render(<LoadingState message="Loading quizzes..." />);
    expect(screen.getByText('Loading quizzes...')).toBeInTheDocument();
  });

  it('does not render message when not provided', () => {
    const { container } = render(<LoadingState />);
    expect(container.querySelector('p')).not.toBeInTheDocument();
  });

  it('applies default minHeight class', () => {
    const { container } = render(<LoadingState />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('min-h-100');
  });

  it('applies custom minHeight class', () => {
    const { container } = render(<LoadingState minHeight="min-h-50" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('min-h-50');
  });

  it('applies custom className', () => {
    const { container } = render(<LoadingState className="custom-class" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('renders with complete set of props', () => {
    const { container } = render(
      <LoadingState
        message="Processing..."
        size={50}
        color="#00ff00"
        className="test-class"
        minHeight="min-h-80"
      />,
    );
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('test-class');
    expect(container.firstChild).toHaveClass('min-h-80');
  });

  it('renders with different messages', () => {
    const { rerender } = render(<LoadingState message="Loading..." />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    rerender(<LoadingState message="Processing data..." />);
    expect(screen.getByText('Processing data...')).toBeInTheDocument();
  });

  it('applies flex layout classes', () => {
    const { container } = render(<LoadingState />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('flex-col');
    expect(wrapper).toHaveClass('items-center');
    expect(wrapper).toHaveClass('justify-center');
  });
});
