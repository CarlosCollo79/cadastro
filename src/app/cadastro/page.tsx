'use client';

import { FormProvider } from '@/lib/form-store';
import { StepWizard } from '@/components/forms/StepWizard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { getLatestClient } from '@/lib/storage';

export default function CadastroPage() {
    const { user, isSignedIn, isLoaded } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        async function checkExistingRegistration() {
            if (!isLoaded || !isSignedIn) return;

            const mode = searchParams.get('mode');
            const latestClient = await getLatestClient(user?.id);
            const hasRegistration = !!latestClient;

            if (hasRegistration && mode !== 'edit') {
                router.replace('/meus-dados');
            }
        }

        checkExistingRegistration();
    }, [isSignedIn, isLoaded, user?.id, router, searchParams]);

    // Avoid flash of content while checking
    if (!isLoaded) return null;


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
                        <span className="font-semibold text-text text-sm">Onboarding Digital</span>
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

