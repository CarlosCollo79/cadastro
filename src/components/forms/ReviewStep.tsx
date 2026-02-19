'use client';

import { useFormStore } from '@/lib/form-store';
import { saveClient, generateId } from '@/lib/storage';
import type { Client } from '@/types/client';
import {
    GENDER_OPTIONS,
    MARITAL_STATUS_OPTIONS,
    EMAIL_TYPE_OPTIONS,
    BRAZILIAN_STATES,
    COUNTRIES,
} from '@/lib/constants';
import { ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
    onBack: () => void;
}

function getLabel(value: string, options: ReadonlyArray<{ value: string; label: string }>) {
    return options.find((o) => o.value === value)?.label ?? value;
}

import { Section, Field } from '@/components/ui/DataDisplay';

export function ReviewStep({ onBack }: Props) {
    const { state, updateNotes, resetForm } = useFormStore();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        const client: Client = {
            id: generateId(),
            personalData: state.personalData as Client['personalData'],
            nationality: state.nationality as Client['nationality'],
            address: state.address as Client['address'],
            contact: state.contact as Client['contact'],
            professional: state.professional as Client['professional'],
            documents: state.documents,
            notes: state.notes,
            status: 'pending',
            riskLevel: 'nao_avaliado',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        saveClient(client);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="text-center py-16">
                <CheckCircle2 className="mx-auto text-success mb-4" size={64} strokeWidth={1.5} />
                <h2 className="text-2xl font-bold text-text mb-2">Cadastro Enviado!</h2>
                <p className="text-text-muted max-w-md mx-auto mb-6">
                    Seu pré-cadastro foi recebido com sucesso. A corretora irá analisar seus dados
                    e você será notificado sobre o resultado.
                </p>
                <button
                    type="button"
                    onClick={() => {
                        resetForm();
                        setSubmitted(false);
                    }}
                    className="btn-secondary"
                >
                    Fazer Novo Cadastro
                </button>
            </div>
        );
    }

    const { personalData: pd, nationality: nat, address: addr, contact: ct, professional: prof } = state;

    return (
        <div className="space-y-5">
            <div className="bg-info-bg border border-info/20 rounded-lg p-4">
                <p className="text-sm text-info">
                    Revise seus dados antes de enviar. Você pode voltar a qualquer etapa clicando
                    nos passos acima.
                </p>
            </div>

            <Section title="Dados Pessoais">
                <Field label="CPF" value={pd.cpf} />
                <Field label="Nome" value={pd.name} />
                <Field label="Nome Social" value={pd.socialName} />
                <Field label="Data de Nascimento" value={pd.birthDate} />
                <Field label="Gênero" value={pd.gender ? getLabel(pd.gender, GENDER_OPTIONS) : undefined} />
                <Field label="Estado Civil" value={pd.maritalStatus ? getLabel(pd.maritalStatus, MARITAL_STATUS_OPTIONS) : undefined} />
                <Field label="RG" value={pd.rg} />
                <Field label="Órgão Expedidor" value={pd.rgIssuer} />
                <Field label="Data Emissão RG" value={pd.rgIssueDate} />
                <Field label="RNE" value={pd.rne} />
            </Section>

            <Section title="Naturalidade">
                <Field label="UF" value={nat.birthState ? getLabel(nat.birthState, [...BRAZILIAN_STATES]) : undefined} />
                <Field label="Cidade" value={nat.birthCity} />
                <Field label="País de Origem" value={nat.originCountry ? getLabel(nat.originCountry, [...COUNTRIES]) : undefined} />
                <Field label="País de Residência" value={nat.residenceCountry ? getLabel(nat.residenceCountry, [...COUNTRIES]) : undefined} />
            </Section>

            <Section title="Endereço">
                <Field label="País" value={addr.country ? getLabel(addr.country, [...COUNTRIES]) : undefined} />
                <Field label="CEP" value={addr.zipCode} />
                <Field label="Logradouro" value={`${addr.streetType || ''} ${addr.street || ''}`.trim() || undefined} />
                <Field label="Número" value={addr.number} />
                <Field label="Bairro" value={addr.neighborhood} />
                <Field label="Cidade" value={addr.city} />
                <Field label="Estado" value={addr.state ? getLabel(addr.state, [...BRAZILIAN_STATES]) : undefined} />
                <Field label="Complemento" value={addr.complement} />
            </Section>

            <Section title="Contato & Filiação">
                <Field label="Telefone" value={ct.phone} />
                <Field label="Celular" value={ct.mobile} />
                <Field label="Tipo E-mail" value={ct.emailType ? getLabel(ct.emailType, [...EMAIL_TYPE_OPTIONS]) : undefined} />
                <Field label="E-mail" value={ct.email} />
                <Field label="Nome do Pai" value={ct.fatherName} />
                <Field label="Nome da Mãe" value={ct.motherName} />
                <Field label="Indicação" value={ct.referral} />
            </Section>

            <Section title="Dados Profissionais">
                <Field label="Natureza de Ocupação" value={prof.occupationNature} />
                <Field label="Ocupação Principal" value={prof.mainOccupation} />
                <Field label="Segmento de Atividade" value={prof.activitySegment} />
                <Field label="Renda Declarada" value={prof.declaredIncome} />
            </Section>

            {state.documents.length > 0 && (
                <Section title={`Documentos (${state.documents.length})`}>
                    {state.documents.map((doc) => (
                        <Field key={doc.id} label={doc.type} value={doc.fileName} />
                    ))}
                </Section>
            )}

            {/* Observações */}
            <div>
                <label className="form-label">Observações</label>
                <textarea
                    value={state.notes}
                    onChange={(e) => updateNotes(e.target.value)}
                    className="form-input min-h-[100px] resize-y"
                    placeholder="Informações adicionais..."
                />
            </div>

            <div className="flex justify-between pt-4">
                <button type="button" onClick={onBack} className="btn-secondary">
                    <ArrowLeft size={16} />
                    Voltar
                </button>
                <button type="button" onClick={handleSubmit} className="btn-primary">
                    <Send size={16} />
                    Enviar Cadastro
                </button>
            </div>
        </div>
    );
}
