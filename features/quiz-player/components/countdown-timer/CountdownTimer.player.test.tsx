import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CountdownTimer } from './CountdownTimer.player';

describe('CountdownTimer', () => {
  it('renders time correctly in MM:SS format', () => {
    const mockOnTick = vi.fn();
    const mockOnTimeUp = vi.fn();

    render(
      <CountdownTimer
        remainingSeconds={125}
        onTick={mockOnTick}
        onTimeUp={mockOnTimeUp}
        timeRemainingLabel="Time remaining"
      />
    );

    expect(screen.getByText('Time remaining:')).toBeInTheDocument();
    expect(screen.getByText('02:05')).toBeInTheDocument();
  });

  it('renders null when remainingSeconds is null', () => {
    const mockOnTick = vi.fn();
    const mockOnTimeUp = vi.fn();

    const { container } = render(
      <CountdownTimer
        remainingSeconds={null}
        onTick={mockOnTick}
        onTimeUp={mockOnTimeUp}
        timeRemainingLabel="Time remaining"
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders null when remainingSeconds is negative', () => {
    const mockOnTick = vi.fn();
    const mockOnTimeUp = vi.fn();

    const { container } = render(
      <CountdownTimer
        remainingSeconds={-1}
        onTick={mockOnTick}
        onTimeUp={mockOnTimeUp}
        timeRemainingLabel="Time remaining"
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('formats single digit seconds with leading zero', () => {
    const mockOnTick = vi.fn();
    const mockOnTimeUp = vi.fn();

    render(
      <CountdownTimer
        remainingSeconds={9}
        onTick={mockOnTick}
        onTimeUp={mockOnTimeUp}
        timeRemainingLabel="Time remaining"
      />
    );

    expect(screen.getByText('00:09')).toBeInTheDocument();
  });

  it('formats minutes and seconds correctly', () => {
    const mockOnTick = vi.fn();
    const mockOnTimeUp = vi.fn();

    render(
      <CountdownTimer
        remainingSeconds={3665}
        onTick={mockOnTick}
        onTimeUp={mockOnTimeUp}
        timeRemainingLabel="Time remaining"
      />
    );

    expect(screen.getByText('61:05')).toBeInTheDocument();
  });

  it('displays custom time remaining label', () => {
    const mockOnTick = vi.fn();
    const mockOnTimeUp = vi.fn();

    render(
      <CountdownTimer
        remainingSeconds={60}
        onTick={mockOnTick}
        onTimeUp={mockOnTimeUp}
        timeRemainingLabel="Waktu tersisa"
      />
    );

    expect(screen.getByText('Waktu tersisa:')).toBeInTheDocument();
  });

  it('renders clock icon', () => {
    const mockOnTick = vi.fn();
    const mockOnTimeUp = vi.fn();

    const { container } = render(
      <CountdownTimer
        remainingSeconds={60}
        onTick={mockOnTick}
        onTimeUp={mockOnTimeUp}
        timeRemainingLabel="Time remaining"
      />
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
