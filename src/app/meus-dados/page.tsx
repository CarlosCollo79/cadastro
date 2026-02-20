'use client';

import { getLatestClient } from '@/lib/storage';
import { Section, Field } from '@/components/ui/DataDisplay';
import {
    GENDER_OPTIONS,
    MARITAL_STATUS_OPTIONS,
    EMAIL_TYPE_OPTIONS,
    BRAZILIAN_STATES,
    COUNTRIES,
} from '@/lib/constants';
import { Edit2, ArrowLeft, FileText, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import type { Client } from '@/types/client';
import { saveClient, getClientDocuments } from '@/lib/storage';

function getLabel(value: string, options: ReadonlyArray<{ value: string; label: string }>) {
    return options.find((o) => o.value === value)?.label ?? value;
}

export default function MyDataPage() {
    const [client, setClient] = useState<Client | null>(null);
    const [isLoadingClient, setIsLoadingClient] = useState(true);
    const router = useRouter();
    const { user, isLoaded } = useUser();

    const DOC_TYPE_LABELS: Record<string, string> = {
        id_front: 'Identidade (Frente)',
        id_back: 'Identidade (Verso)',
        selfie: 'Selfie com Documento',
        proof_address: 'Comprovante de Residência',
    };

    useEffect(() => {
        if (!isLoaded) return;

        async function fetchClient() {
            setIsLoadingClient(true);
            try {
                const stored = await getLatestClient(user?.id, false);
                if (stored) {
                    setClient({ ...stored, documents: [] });

                    // Fetch documents asynchronously to avoid Vercel 413 limit
                    getClientDocuments(stored.id).then(docs => {
                        setClient(prev => prev ? { ...prev, documents: docs } : prev);
                    }).catch(err => console.error("Error loading documents:", err));
                } else {
                    setClient(null);
                }
            } finally {
                setIsLoadingClient(false);
            }
        }

        fetchClient();
    }, [user?.id, isLoaded]);

    const handleDeleteDocument = async (docId: string) => {
        if (!client || !user?.id) return;

        const updatedDocuments = client.documents.filter(d => d.id !== docId);
        const updatedClient = {
            ...client,
            documents: updatedDocuments,
            updatedAt: new Date().toISOString()
        };

        await saveClient(updatedClient, user.id);
        setClient(updatedClient);
    };

    if (!isLoaded || isLoadingClient) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-text-muted mb-4">Nenhum dado encontrado para sua conta.</p>
                    <Link href="/cadastro" className="btn-primary">
                        Iniciar Cadastro
                    </Link>
                </div>
            </div>
        );
    }

    const { personalData: pd, nationality: nat, address: addr, contact: ct, professional: prof } = client;

    const handleEdit = (step: number) => {
        // We pass mode=edit to tell the wizard to load existing data
        // And we pass the step to go directly to that step
        router.push(`/cadastro?mode=edit&step=${step}`);
    };



    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-text-muted hover:text-text transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
                                <span className="text-text-inverse font-bold text-xs">O</span>
                            </div>
                            <span className="font-semibold text-text">Onboarding</span>
                        </Link>
                    </div>
                    <nav className="flex items-center gap-4">
                        <Link href="/meus-dados" className="text-sm text-accent font-medium">
                            Meus Dados
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-text mb-1">Meus Dados de Cadastro</h1>
                    <p className="text-sm text-text-muted">
                        Confira as informações fornecidas durante o seu processo de onboarding.
                    </p>
                </div>

                <div className="space-y-6">
                    <Section title="Dados Pessoais" action={
                        <button
                            onClick={() => handleEdit(1)}
                            className="text-xs flex items-center gap-1 text-accent hover:text-primary transition-colors"
                        >
                            <Edit2 size={12} />
                            Editar
                        </button>
                    }>
                        <Field label="CPF" value={pd.cpf} />
                        <Field label="Nome Completo" value={pd.name} />
                        <Field label="Nome Social" value={pd.socialName} />
                        <Field label="Data de Nascimento" value={pd.birthDate} />
                        <Field label="Gênero" value={pd.gender ? getLabel(pd.gender, GENDER_OPTIONS) : undefined} />
                        <Field label="Estado Civil" value={pd.maritalStatus ? getLabel(pd.maritalStatus, MARITAL_STATUS_OPTIONS) : undefined} />
                        <Field label="RG / CNH / CIN" value={pd.rg} />
                        <Field label="Órgão Emissor" value={pd.rgIssuer} />
                        <Field label="Data de Emissão" value={pd.rgIssueDate} />
                        <Field label="RNE" value={pd.rne} />
                    </Section>

                    <Section title="Naturalidade" action={
                        <button
                            onClick={() => handleEdit(1)}
                            className="text-xs flex items-center gap-1 text-accent hover:text-primary transition-colors"
                        >
                            <Edit2 size={12} />
                            Editar
                        </button>
                    }>
                        <Field label="UF" value={nat.birthState ? getLabel(nat.birthState, [...BRAZILIAN_STATES]) : undefined} />
                        <Field label="Cidade" value={nat.birthCity} />
                        <Field label="País de Origem" value={nat.originCountry ? getLabel(nat.originCountry, [...COUNTRIES]) : undefined} />
                        <Field label="País de Residência" value={nat.residenceCountry ? getLabel(nat.residenceCountry, [...COUNTRIES]) : undefined} />
                    </Section>

                    <Section title="Endereço de Residência" action={
                        <button
                            onClick={() => handleEdit(2)}
                            className="text-xs flex items-center gap-1 text-accent hover:text-primary transition-colors"
                        >
                            <Edit2 size={12} />
                            Editar
                        </button>
                    }>
                        <Field label="País de Residência" value={addr.country ? getLabel(addr.country, [...COUNTRIES]) : undefined} />
                        <Field label="CEP" value={addr.zipCode} />
                        <Field label="Logradouro" value={`${addr.streetType || ''} ${addr.street || ''}`.trim() || undefined} />
                        <Field label="Número" value={addr.number} />
                        <Field label="Bairro" value={addr.neighborhood} />
                        <Field label="Cidade" value={addr.city} />
                        <Field label="Estado" value={addr.state ? getLabel(addr.state, [...BRAZILIAN_STATES]) : undefined} />
                        <Field label="Complemento" value={addr.complement} />
                    </Section>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Section title="Informações de Contato" action={
                            <button
                                onClick={() => handleEdit(3)}
                                className="text-xs flex items-center gap-1 text-accent hover:text-primary transition-colors"
                            >
                                <Edit2 size={12} />
                                Editar
                            </button>
                        }>
                            <Field label="Celular (WhatsApp)" value={ct.mobile} />
                            <Field label="E-mail Principal" value={ct.email} />
                            <Field label="Nome da Mãe" value={ct.motherName} />
                        </Section>

                        <Section title="Dados Profissionais" action={
                            <button
                                onClick={() => handleEdit(3)}
                                className="text-xs flex items-center gap-1 text-accent hover:text-primary transition-colors"
                            >
                                <Edit2 size={12} />
                                Editar
                            </button>
                        }>
                            <Field label="Natureza da Ocupação" value={prof.occupationNature} />
                            <Field label="Renda Mensal Declarada" value={prof.declaredIncome} />
                            <Field label="Segmento de Atividade" value={prof.activitySegment} />
                        </Section>
                    </div>

                    <Section title="Documentos Enviados" action={
                        <button
                            onClick={() => handleEdit(4)}
                            className="text-xs flex items-center gap-1 text-accent hover:text-primary transition-colors"
                        >
                            <Plus size={12} />
                            Adicionar
                        </button>
                    }>
                        {client.documents && client.documents.length > 0 ? (
                            client.documents.map((doc) => (
                                <div key={doc.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-card/50 transition-colors hover:bg-surface group">
                                    {doc.fileUrl && doc.fileUrl.startsWith('data:image') ? (
                                        <div className="relative w-10 h-10 shrink-0">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={doc.fileUrl}
                                                alt={doc.fileName}
                                                className="w-full h-full rounded object-cover border border-border"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded bg-surface flex items-center justify-center border border-border shrink-0">
                                            <FileText size={18} className="text-danger" />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate leading-tight mb-1">{doc.fileName}</p>
                                        <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                                            {DOC_TYPE_LABELS[doc.type] || doc.type}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a
                                            href={doc.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-md hover:bg-info-bg text-text-light hover:text-info transition-colors"
                                            title="Editar"
                                        >
                                            <Edit2 size={14} />
                                        </a>
                                        <button
                                            onClick={() => {
                                                if (confirm('Tem certeza que deseja excluir este documento?')) {
                                                    handleDeleteDocument(doc.id);
                                                }
                                            }}
                                            className="p-1.5 rounded-md hover:bg-danger-bg text-text-light hover:text-danger transition-colors"
                                            title="Excluir"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-full text-sm text-text-muted py-2">
                                Documentos Enviados...
                            </p>
                        )}
                    </Section>
                </div>
            </main>

            <footer className="border-t border-border py-6 mt-auto">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-sm text-text-light">
                    © {new Date().getFullYear()} Onboarding — Sistema de Onboarding Digital
                </div>
            </footer>
        </div>
    );
}

