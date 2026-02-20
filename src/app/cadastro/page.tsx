'use client';

import { FormProvider } from '@/lib/form-store';
import { StepWizard } from '@/components/forms/StepWizard';
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
            <FormProvider>
                <StepWizard />
            </FormProvider>
        </div>
    );
}

