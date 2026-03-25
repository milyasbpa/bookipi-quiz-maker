import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ResultsFooter } from './ResultsFooter.player';

const mockPush = vi.fn();
const mockResetPlayer = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/core/components', () => ({
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}));

vi.mock('@/core/lib/routes', () => ({
  ROUTES: {
    QUIZ_LIST: '/',
  },
}));

vi.mock('../../store/player.store', () => ({
  usePlayerStore: (selector: any) => selector({ resetPlayer: mockResetPlayer }),
}));

describe('ResultsFooter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders back to quiz list button', () => {
    render(<ResultsFooter />);
    expect(screen.getByText('back-to-quiz-list')).toBeInTheDocument();
  });

  it('calls resetPlayer and navigates to quiz list on button click', async () => {
    render(<ResultsFooter />);
    const button = screen.getByText('back-to-quiz-list');
    await userEvent.click(button);

    expect(mockResetPlayer).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('calls resetPlayer before navigation', async () => {
    const callOrder: string[] = [];
    mockResetPlayer.mockImplementation(() => callOrder.push('reset'));
    mockPush.mockImplementation(() => callOrder.push('push'));

    render(<ResultsFooter />);
    const button = screen.getByText('back-to-quiz-list');
    await userEvent.click(button);

    expect(callOrder).toEqual(['reset', 'push']);
  });
});
