'use client';

import { useFormStore } from '@/lib/form-store';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PersonalDataStep } from './PersonalDataStep';
import { AddressStep } from './AddressStep';
import { ContactStep } from './ContactStep';
import { DocumentsStep } from './DocumentsStep';
import { ReviewStep } from './ReviewStep';
import { WIZARD_STEPS } from '@/types/client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getLatestClient } from '@/lib/storage';

export function StepWizard() {
    const { state, setStep, loadFormData } = useFormStore();
    const { currentStep } = state;
    const searchParams = useSearchParams();
    const hasLoaded = useRef(false);

    useEffect(() => {
        if (hasLoaded.current) return;

        const mode = searchParams.get('mode');
        const stepParam = searchParams.get('step');

        if (mode === 'edit') {
            const stored = getLatestClient();
            if (stored) {
                loadFormData({
                    personalData: stored.personalData,
                    nationality: stored.nationality,
                    address: stored.address,
                    contact: stored.contact,
                    professional: stored.professional,
                    documents: stored.documents,
                    notes: stored.notes,
                });
            }
        }

        if (stepParam) {
            const step = parseInt(stepParam);
            if (!isNaN(step) && step >= 1 && step <= 5) {
                setStep(step);
            }
        }
        hasLoaded.current = true;
    }, [searchParams, loadFormData, setStep]);

    const currentStepInfo = WIZARD_STEPS.find((s) => s.id === currentStep);

    const goNext = () => setStep(currentStep + 1);
    const goBack = () => setStep(currentStep - 1);
    const goToStep = (step: number) => setStep(step);

    return (
        <div className="space-y-6">
            <ProgressBar currentStep={currentStep} onStepClick={goToStep} />

            <div className="card">
                <h2 className="text-lg font-semibold text-primary mb-1">
                    {currentStepInfo?.label}
                </h2>
                <p className="text-sm text-text-light mb-6">
                    Etapa {currentStep} de {WIZARD_STEPS.length}
                </p>

                {currentStep === 1 && <PersonalDataStep onNext={goNext} />}
                {currentStep === 2 && <AddressStep onNext={goNext} onBack={goBack} />}
                {currentStep === 3 && <ContactStep onNext={goNext} onBack={goBack} />}
                {currentStep === 4 && <DocumentsStep onNext={goNext} onBack={goBack} />}
                {currentStep === 5 && <ReviewStep onBack={goBack} />}
            </div>
        </div>
    );
}
