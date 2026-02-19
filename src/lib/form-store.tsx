'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type {
    ClientPersonalData,
    ClientNationality,
    ClientAddress,
    ClientContact,
    ClientProfessional,
    ClientDocument,
} from '@/types/client';

interface FormState {
    currentStep: number;
    personalData: Partial<ClientPersonalData>;
    nationality: Partial<ClientNationality>;
    address: Partial<ClientAddress>;
    contact: Partial<ClientContact>;
    professional: Partial<ClientProfessional>;
    documents: ClientDocument[];
    notes: string;
}

interface FormContextType {
    state: FormState;
    setStep: (step: number) => void;
    updatePersonalData: (data: Partial<ClientPersonalData>) => void;
    updateNationality: (data: Partial<ClientNationality>) => void;
    updateAddress: (data: Partial<ClientAddress>) => void;
    updateContact: (data: Partial<ClientContact>) => void;
    updateProfessional: (data: Partial<ClientProfessional>) => void;
    addDocument: (doc: ClientDocument) => void;
    removeDocument: (id: string) => void;
    updateNotes: (notes: string) => void;
    resetForm: () => void;
    loadFormData: (data: Partial<FormState>) => void;
}

const initialState: FormState = {
    currentStep: 1,
    personalData: {},
    nationality: { originCountry: 'BR', residenceCountry: 'BR' },
    address: { country: 'BR' },
    contact: { emailType: 'pessoal' },
    professional: {},
    documents: [],
    notes: '',
};

const FormContext = createContext<FormContextType | null>(null);

export function FormProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<FormState>(initialState);

    const setStep = useCallback((step: number) => {
        setState((prev) => ({ ...prev, currentStep: step }));
    }, []);

    const updatePersonalData = useCallback((data: Partial<ClientPersonalData>) => {
        setState((prev) => ({ ...prev, personalData: { ...prev.personalData, ...data } }));
    }, []);

    const updateNationality = useCallback((data: Partial<ClientNationality>) => {
        setState((prev) => ({ ...prev, nationality: { ...prev.nationality, ...data } }));
    }, []);

    const updateAddress = useCallback((data: Partial<ClientAddress>) => {
        setState((prev) => ({ ...prev, address: { ...prev.address, ...data } }));
    }, []);

    const updateContact = useCallback((data: Partial<ClientContact>) => {
        setState((prev) => ({ ...prev, contact: { ...prev.contact, ...data } }));
    }, []);

    const updateProfessional = useCallback((data: Partial<ClientProfessional>) => {
        setState((prev) => ({ ...prev, professional: { ...prev.professional, ...data } }));
    }, []);

    const addDocument = useCallback((doc: ClientDocument) => {
        setState((prev) => ({ ...prev, documents: [...prev.documents, doc] }));
    }, []);

    const removeDocument = useCallback((id: string) => {
        setState((prev) => ({
            ...prev,
            documents: prev.documents.filter((d) => d.id !== id),
        }));
    }, []);

    const updateNotes = useCallback((notes: string) => {
        setState((prev) => ({ ...prev, notes }));
    }, []);

    const resetForm = useCallback(() => {
        setState(initialState);
    }, []);

    const loadFormData = useCallback((data: Partial<FormState>) => {
        setState((prev) => ({ ...prev, ...data }));
    }, []);

    return (
        <FormContext.Provider
            value={{
                state,
                setStep,
                updatePersonalData,
                updateNationality,
                updateAddress,
                updateContact,
                updateProfessional,
                addDocument,
                removeDocument,
                updateNotes,
                resetForm,
                loadFormData,
            }}
        >
            {children}
        </FormContext.Provider>
    );
}

export function useFormStore() {
    const ctx = useContext(FormContext);
    if (!ctx) throw new Error('useFormStore must be used within FormProvider');
    return ctx;
}
