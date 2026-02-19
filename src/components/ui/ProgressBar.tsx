'use client';

import { WIZARD_STEPS } from '@/types/client';
import { Check } from 'lucide-react';

interface ProgressBarProps {
    currentStep: number;
    onStepClick?: (step: number) => void;
}

export function ProgressBar({ currentStep, onStepClick }: ProgressBarProps) {
    return (
        <nav className="w-full overflow-x-auto pb-4 no-scrollbar">
            <ol className="flex items-center justify-center min-w-max sm:min-w-0 gap-0 px-2">
                {WIZARD_STEPS.map((step, index) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;
                    const isClickable = isCompleted && onStepClick;

                    return (
                        <li key={step.id} className="flex items-center">
                            <button
                                type="button"
                                onClick={() => isClickable && onStepClick(step.id)}
                                disabled={!isClickable}
                                className={`flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-3 py-2 rounded-md transition-all text-sm
                  ${isCurrent ? 'text-accent font-semibold' : ''}
                  ${isCompleted ? 'text-success cursor-pointer hover:bg-success-bg' : ''}
                  ${!isCurrent && !isCompleted ? 'text-text-light' : ''}
                  ${!isClickable ? 'cursor-default' : ''}
                `}
                            >
                                <span
                                    className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 transition-all
                    ${isCurrent ? 'bg-accent text-text-inverse' : ''}
                    ${isCompleted ? 'bg-success text-text-inverse' : ''}
                    ${!isCurrent && !isCompleted ? 'bg-surface-alt text-text-light border border-border' : ''}
                  `}
                                >
                                    {isCompleted ? <Check size={14} strokeWidth={3} /> : step.id}
                                </span>
                                <span className="hidden md:inline whitespace-nowrap">{step.label}</span>
                            </button>
                            {index < WIZARD_STEPS.length - 1 && (
                                <div
                                    className={`w-3 sm:w-6 lg:w-10 h-px transition-colors ${isCompleted ? 'bg-success' : 'bg-border'
                                        }`}
                                />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
