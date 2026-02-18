'use client';

import { FormProvider } from '@/lib/form-store';
import { StepWizard } from '@/components/forms/StepWizard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CadastroPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
                    <Link href="/" className="text-text-muted hover:text-text transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
                            <span className="text-text-inverse font-bold text-xs">C</span>
                        </div>
                        <span className="font-semibold text-text text-sm">Pré-Cadastro</span>
                    </div>
                </div>
            </header>

            {/* Form */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                <FormProvider>
                    <StepWizard />
                </FormProvider>
            </main>
        </div>
    );
}
