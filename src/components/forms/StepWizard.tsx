'use client';

import { ArrowRight, CheckCircle2, Check, Shield, ShieldCheck } from 'lucide-react';
import { useFormStore } from '@/lib/form-store';
import { WIZARD_STEPS } from '@/types/client';
import { PersonalDataStep } from './PersonalDataStep';
import { AddressStep } from './AddressStep';
import { ContactStep } from './ContactStep';
import { DocumentsStep } from './DocumentsStep';
import { ReviewStep } from './ReviewStep';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getLatestClient } from '@/lib/storage';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export function StepWizard({ mode = 'create' }: { mode?: 'create' | 'edit' }) {
    const { state, setStep, loadFormData } = useFormStore();
    const { currentStep } = state;
    const [isInitialLoading, setIsInitialLoading] = useState(mode === 'edit');
    const searchParams = useSearchParams();
    const hasLoaded = useRef(false);

    const STEP_LABELS: Record<number, string> = {
        1: 'Dados Pessoais',
        2: 'Endereço',
        3: 'Contato',
        4: 'Documentos',
        5: 'Revisão',
    };

    const { isLoaded: authLoaded, user } = useUser();

    useEffect(() => {
        if (hasLoaded.current || !authLoaded) return;

        hasLoaded.current = true;
        const mode = searchParams.get('mode');
        const stepParam = searchParams.get('step');

        async function initWizard() {
            if (mode === 'edit') {
                try {
                    const stored = await getLatestClient(user?.id);
                    if (stored) {
                        loadFormData({
                            id: stored.id,
                            personalData: stored.personalData,
                            nationality: stored.nationality,
                            address: stored.address,
                            contact: stored.contact,
                            professional: stored.professional,
                            documents: stored.documents || [],
                            notes: stored.notes,
                        });
                    }
                } catch (e) {
                    console.error("Error loading client data", e);
                }
            }

            if (stepParam) {
                const step = parseInt(stepParam);
                if (!isNaN(step) && step >= 1 && step <= 5) {
                    setStep(step);
                }
            }
        }
        initWizard();
    }, [searchParams, loadFormData, setStep, authLoaded, user?.id]);

    // Scroll to top when step changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    const currentStepInfo = WIZARD_STEPS.find((s) => s.id === currentStep);
    const progress = Math.round((currentStep / WIZARD_STEPS.length) * 100);

    const goNext = () => setStep(currentStep + 1);
    const goBack = () => setStep(currentStep - 1);
    const goToStep = (step: number) => setStep(step);

    return (
        <div className="flex min-h-[calc(100vh-4rem)]">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 border-r border-border bg-card p-6">
                <Link href="/" className="flex items-center gap-2 mb-10 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                        <span className="text-text-inverse font-bold text-sm">O</span>
                    </div>
                    <span className="font-semibold text-text text-lg">Onboarding</span>
                </Link>

                <nav className="flex-1 space-y-1">
                    {WIZARD_STEPS.map((step) => {
                        const isCompleted = currentStep > step.id;
                        const isCurrent = currentStep === step.id;
                        const isClickable = isCompleted;

                        return (
                            <button
                                key={step.id}
                                type="button"
                                onClick={() => isClickable && goToStep(step.id)}
                                disabled={!isClickable}
                                className={`w-full flex items-start gap-3 px-3 py-3 rounded-xl text-sm transition-all
                                    ${isCurrent ? 'bg-accent/10 text-accent font-semibold' : ''}
                                    ${isCompleted ? 'text-success cursor-pointer hover:bg-success-bg' : ''}
                                    ${!isCurrent && !isCompleted ? 'text-text-light cursor-default' : ''}
                                `}
                            >
                                <span
                                    className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 transition-all mt-0.5
                                        ${isCurrent ? 'bg-accent text-text-inverse' : ''}
                                        ${isCompleted ? 'bg-success text-text-inverse' : ''}
                                        ${!isCurrent && !isCompleted ? 'bg-surface-alt text-text-light border border-border' : ''}
                                    `}
                                >
                                    {isCompleted ? <Check size={14} strokeWidth={3} /> : step.id}
                                </span>
                                <span className="text-left leading-tight py-1">{STEP_LABELS[step.id]}</span>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile progress summary */}
                <div className="lg:hidden border-b border-border bg-card px-4 sm:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-semibold text-text">Formulário de Onboarding</h1>
                            <p className="text-xs text-text-muted uppercase tracking-wider">
                                Passo {currentStep} de {WIZARD_STEPS.length} • {progress}% concluído
                            </p>
                        </div>
                        <Link href="/" className="shrink-0 p-2 rounded-lg bg-accent/5">
                            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                                <span className="text-text-inverse font-bold text-xs">O</span>
                            </div>
                        </Link>
                    </div>

                    {/* Mobile progress bar */}
                    <div className="lg:hidden mt-3">
                        <div className="w-full h-1.5 bg-surface-alt rounded-full overflow-hidden">
                            <div
                                className="h-full bg-accent rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Form content */}
                <div className="px-4 sm:px-8 py-8 max-w-3xl">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-text mb-1">
                            {STEP_LABELS[currentStep]}
                        </h2>
                        <p className="text-sm text-text-muted">
                            Preencha os campos abaixo com atenção para garantir a segurança da sua conta.
                        </p>
                    </div>

                    {currentStep === 1 && <PersonalDataStep onNext={goNext} />}
                    {currentStep === 2 && <AddressStep onNext={goNext} onBack={goBack} />}
                    {currentStep === 3 && <ContactStep onNext={goNext} onBack={goBack} />}
                    {currentStep === 4 && <DocumentsStep onNext={goNext} onBack={goBack} />}
                    {currentStep === 5 && <ReviewStep onBack={goBack} />}

                    {/* Security note */}
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-accent/5 border border-accent/10 mt-12">
                        <ShieldCheck className="text-accent shrink-0 mt-0.5" size={20} />
                        <div className="text-xs text-text-muted leading-relaxed">
                            <p className="font-semibold text-accent mb-1 uppercase tracking-wider">Seus dados estão seguros</p>
                            <p>Utilizamos criptografia de ponta a ponta para proteger suas informações pessoais e documentos durante todo o processo.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
