import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProgressBar } from './ProgressBar';

// Mock the WIZARD_STEPS constant
vi.mock('@/types/client', () => ({
    WIZARD_STEPS: [
        { id: 1, label: 'Step 1' },
        { id: 2, label: 'Step 2' },
        { id: 3, label: 'Step 3' },
    ],
}));

describe('ProgressBar', () => {
    it('renders all steps', () => {
        render(<ProgressBar currentStep={1} />);

        expect(screen.getByText('Step 1')).toBeInTheDocument();
        expect(screen.getByText('Step 2')).toBeInTheDocument();
        expect(screen.getByText('Step 3')).toBeInTheDocument();
    });

    it('highlights the current step', () => {
        render(<ProgressBar currentStep={2} />);

        const currentStepButton = screen.getByRole('button', { name: /2 Step 2/i });
        expect(currentStepButton).toHaveClass('text-accent');
    });

    it('marks completed steps', () => {
        render(<ProgressBar currentStep={2} />);

        // Step 1 should have success colors/icons
        const step1Button = screen.getByRole('button', { name: /Step 1/i });
        expect(step1Button).toHaveClass('text-success');
    });
});
