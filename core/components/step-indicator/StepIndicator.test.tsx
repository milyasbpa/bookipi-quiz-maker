import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StepIndicator } from './StepIndicator';

describe('StepIndicator', () => {
  it('renders default 2 steps', () => {
    render(<StepIndicator currentStep={1} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders custom number of steps', () => {
    render(<StepIndicator currentStep={1} totalSteps={4} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('highlights current step with primary colors', () => {
    render(<StepIndicator currentStep={2} totalSteps={3} />);
    const step2Element = screen.getByText('2');
    expect(step2Element).toHaveClass('bg-primary');
    expect(step2Element).toHaveClass('text-primary-foreground');
  });

  it('renders non-current steps with muted colors', () => {
    render(<StepIndicator currentStep={2} totalSteps={3} />);
    const step1Element = screen.getByText('1');
    const step3Element = screen.getByText('3');
    
    expect(step1Element).toHaveClass('bg-muted');
    expect(step1Element).toHaveClass('text-muted-foreground');
    expect(step3Element).toHaveClass('bg-muted');
    expect(step3Element).toHaveClass('text-muted-foreground');
  });

  it('renders separator lines between steps', () => {
    const { container } = render(<StepIndicator currentStep={1} totalSteps={3} />);
    const separators = container.querySelectorAll('.h-px');
    expect(separators).toHaveLength(2);
  });

  it('renders without separator after last step', () => {
    const { container } = render(<StepIndicator currentStep={1} totalSteps={2} />);
    const separators = container.querySelectorAll('.h-px');
    expect(separators).toHaveLength(1);
  });

  it('renders single step without separators', () => {
    const { container } = render(<StepIndicator currentStep={1} totalSteps={1} />);
    const separators = container.querySelectorAll('.h-px');
    expect(separators).toHaveLength(0);
  });

  it('handles first step as current', () => {
    render(<StepIndicator currentStep={1} totalSteps={3} />);
    const step1Element = screen.getByText('1');
    expect(step1Element).toHaveClass('bg-primary');
  });

  it('handles last step as current', () => {
    render(<StepIndicator currentStep={4} totalSteps={4} />);
    const step4Element = screen.getByText('4');
    expect(step4Element).toHaveClass('bg-primary');
  });

  it('renders with many steps', () => {
    render(<StepIndicator currentStep={3} totalSteps={6} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    
    const step3Element = screen.getByText('3');
    expect(step3Element).toHaveClass('bg-primary');
  });
});
