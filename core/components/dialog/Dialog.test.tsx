import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Dialog } from './Dialog';

describe('Dialog', () => {
  it('renders dialog when open is true', () => {
    render(
      <Dialog open={true} onOpenChange={() => {}}>
        <p>Dialog content</p>
      </Dialog>,
    );
    expect(screen.getByText('Dialog content')).toBeInTheDocument();
  });

  it('does not render dialog when open is false', () => {
    render(
      <Dialog open={false} onOpenChange={() => {}}>
        <p>Dialog content</p>
      </Dialog>,
    );
    expect(screen.queryByText('Dialog content')).not.toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <Dialog open={true} onOpenChange={() => {}} title="Edit Quiz">
        <p>Content</p>
      </Dialog>,
    );
    expect(screen.getByText('Edit Quiz')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <Dialog
        open={true}
        onOpenChange={() => {}}
        title="Confirm"
        description="Are you sure?"
      >
        <p>Content</p>
      </Dialog>,
    );
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('calls onOpenChange with false when close button clicked', async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open={true} onOpenChange={onOpenChange} title="Test">
        <p>Content</p>
      </Dialog>,
    );
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('applies size className correctly', () => {
    const { rerender } = render(
      <Dialog open={true} onOpenChange={() => {}} size="sm">
        <p>Content</p>
      </Dialog>,
    );
    
    let content = screen.getByText('Content').closest('div[role="dialog"]');
    expect(content).toHaveClass('max-w-sm');

    rerender(
      <Dialog open={true} onOpenChange={() => {}} size="xl">
        <p>Content</p>
      </Dialog>,
    );
    content = screen.getByText('Content').closest('div[role="dialog"]');
    expect(content).toHaveClass('max-w-2xl');
  });

  it('applies custom className', () => {
    render(
      <Dialog open={true} onOpenChange={() => {}} className="custom-class">
        <p>Content</p>
      </Dialog>,
    );
    const content = screen.getByText('Content').closest('div[role="dialog"]');
    expect(content).toHaveClass('custom-class');
  });

  it('renders without title and description', () => {
    render(
      <Dialog open={true} onOpenChange={() => {}}>
        <p>Simple content</p>
      </Dialog>,
    );
    expect(screen.getByText('Simple content')).toBeInTheDocument();
  });

  it('applies default size when not specified', () => {
    render(
      <Dialog open={true} onOpenChange={() => {}}>
        <p>Content</p>
      </Dialog>,
    );
    const content = screen.getByText('Content').closest('div[role="dialog"]');
    expect(content).toHaveClass('max-w-lg');
  });
});
