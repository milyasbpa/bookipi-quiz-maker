import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { AntiCheatSummaryPlayer } from './AntiCheatSummary.player';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('AntiCheatSummaryPlayer', () => {
  describe('with no events', () => {
    it('renders no suspicious activity message', () => {
      render(<AntiCheatSummaryPlayer />);
      expect(screen.getByText('no-suspicious-activity')).toBeInTheDocument();
    });

    it('renders activity log note', () => {
      render(<AntiCheatSummaryPlayer />);
      expect(screen.getByText('activity-log-note')).toBeInTheDocument();
    });

    it('displays ShieldCheck icon', () => {
      const { container } = render(<AntiCheatSummaryPlayer />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('uses green border styling for success', () => {
      const { container } = render(<AntiCheatSummaryPlayer />);
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv.className).toContain('border-green-500');
    });
  });

  describe('with events', () => {
    const mockEvents = [
      { type: 'blur' as const, timestamp: '2024-01-01T10:00:00Z' },
      { type: 'focus' as const, timestamp: '2024-01-01T10:00:30Z' },
      { type: 'blur' as const, timestamp: '2024-01-01T10:01:00Z' },
      { type: 'paste' as const, timestamp: '2024-01-01T10:02:00Z' },
    ];

    it('renders activity detected message', () => {
      render(<AntiCheatSummaryPlayer events={mockEvents} />);
      expect(screen.getByText('activity-detected')).toBeInTheDocument();
    });

    it('uses orange border styling for warning', () => {
      const { container } = render(<AntiCheatSummaryPlayer events={mockEvents} />);
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv.className).toContain('border-orange-500');
    });

    it('displays correct blur count', () => {
      render(<AntiCheatSummaryPlayer events={mockEvents} />);
      expect(screen.getByText(/Tab switches:/)).toBeInTheDocument();
      expect(screen.getByText(/2/)).toBeInTheDocument();
    });

    it('displays correct paste count', () => {
      render(<AntiCheatSummaryPlayer events={mockEvents} />);
      expect(screen.getByText(/Paste events:/)).toBeInTheDocument();
      expect(screen.getByText(/1/)).toBeInTheDocument();
    });

    it('toggles detailed log visibility', () => {
      render(<AntiCheatSummaryPlayer events={mockEvents} />);

      const toggleButton = screen.getByText('View detailed log');
      expect(screen.queryByText(/Window blur \(tab switch\)/)).not.toBeInTheDocument();

      fireEvent.click(toggleButton);
      expect(screen.getAllByText(/Window blur \(tab switch\)/).length).toBeGreaterThan(0);

      fireEvent.click(toggleButton);
      expect(screen.queryByText(/Window blur \(tab switch\)/)).not.toBeInTheDocument();
    });

    it('displays all events in detailed log', () => {
      render(<AntiCheatSummaryPlayer events={mockEvents} />);

      const toggleButton = screen.getByText('View detailed log');
      fireEvent.click(toggleButton);

      expect(screen.getAllByText(/Window blur \(tab switch\)/).length).toBe(2);
      expect(screen.getByText(/Window focus \(returned\)/)).toBeInTheDocument();
      expect(screen.getByText(/Paste detected/)).toBeInTheDocument();
    });
  });
});
