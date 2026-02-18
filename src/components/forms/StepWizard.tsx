'use client';

import { useFormStore } from '@/lib/form-store';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PersonalDataStep } from './PersonalDataStep';
import { NationalityStep } from './NationalityStep';
import { AddressStep } from './AddressStep';
import { ContactStep } from './ContactStep';
import { ProfessionalStep } from './ProfessionalStep';
import { DocumentsStep } from './DocumentsStep';
import { ReviewStep } from './ReviewStep';
import { WIZARD_STEPS } from '@/types/client';

export function StepWizard() {
    const { state, setStep } = useFormStore();
    const { currentStep } = state;

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
                {currentStep === 2 && <NationalityStep onNext={goNext} onBack={goBack} />}
                {currentStep === 3 && <AddressStep onNext={goNext} onBack={goBack} />}
                {currentStep === 4 && <ContactStep onNext={goNext} onBack={goBack} />}
                {currentStep === 5 && <ProfessionalStep onNext={goNext} onBack={goBack} />}
                {currentStep === 6 && <DocumentsStep onNext={goNext} onBack={goBack} />}
                {currentStep === 7 && <ReviewStep onBack={goBack} />}
            </div>
        </div>
    );
}
