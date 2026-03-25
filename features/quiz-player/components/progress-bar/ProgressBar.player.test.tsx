import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProgressBar } from './ProgressBar.player';

describe('ProgressBar', () => {
  it('renders progress information correctly', () => {
    render(<ProgressBar current={4} total={10} progressLabel="Question" ofLabel="of" />);

    expect(screen.getByText(/Question 5 of 10/i)).toBeInTheDocument();
  });

  it('calculates percentage correctly', () => {
    render(<ProgressBar current={4} total={10} progressLabel="Question" ofLabel="of" />);

    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('shows 100% on last question', () => {
    render(<ProgressBar current={9} total={10} progressLabel="Question" ofLabel="of" />);

    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('shows 10% on first question', () => {
    render(<ProgressBar current={0} total={10} progressLabel="Question" ofLabel="of" />);

    expect(screen.getByText('10%')).toBeInTheDocument();
  });

  it('uses custom labels', () => {
    render(<ProgressBar current={2} total={5} progressLabel="Pertanyaan" ofLabel="dari" />);

    expect(screen.getByText(/Pertanyaan 3 dari 5/i)).toBeInTheDocument();
  });

  it('handles single question correctly', () => {
    render(<ProgressBar current={0} total={1} progressLabel="Question" ofLabel="of" />);

    expect(screen.getByText(/Question 1 of 1/i)).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('renders progress bar element', () => {
    const { container } = render(
      <ProgressBar current={3} total={10} progressLabel="Question" ofLabel="of" />
    );

    const progressBars = container.querySelectorAll('.bg-brand');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it('rounds percentage to nearest integer', () => {
    render(<ProgressBar current={0} total={3} progressLabel="Question" ofLabel="of" />);

    expect(screen.getByText('33%')).toBeInTheDocument();
  });
});
