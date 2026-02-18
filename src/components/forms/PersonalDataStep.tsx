'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalDataSchema, type PersonalDataInput } from '@/lib/validations/schemas';
import { useFormStore } from '@/lib/form-store';
import { GENDER_OPTIONS, MARITAL_STATUS_OPTIONS } from '@/lib/constants';
import { formatCPF } from '@/lib/validations/cpf';
import { ArrowRight } from 'lucide-react';

interface Props {
    onNext: () => void;
}

export function PersonalDataStep({ onNext }: Props) {
    const { state, updatePersonalData } = useFormStore();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<PersonalDataInput>({
        resolver: zodResolver(personalDataSchema),
        defaultValues: state.personalData as PersonalDataInput,
    });

    const cpfValue = watch('cpf');

    const onSubmit = (data: PersonalDataInput) => {
        updatePersonalData(data);
        onNext();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                {/* CPF */}
                <div>
                    <label className="form-label">CPF *</label>
                    <input
                        {...register('cpf')}
                        className="form-input"
                        placeholder="000.000.000-00"
                        maxLength={14}
                        onChange={(e) => {
                            const formatted = formatCPF(e.target.value);
                            setValue('cpf', formatted, { shouldValidate: true });
                        }}
                    />
                    {errors.cpf && <p className="form-error">{errors.cpf.message}</p>}
                </div>

                {/* Nome */}
                <div className="lg:col-span-2">
                    <label className="form-label">Nome Completo *</label>
                    <input {...register('name')} className="form-input" placeholder="Nome completo" />
                    {errors.name && <p className="form-error">{errors.name.message}</p>}
                </div>

                {/* Nome Social */}
                <div className="lg:col-span-2">
                    <label className="form-label">Nome Social</label>
                    <input {...register('socialName')} className="form-input" placeholder="Se aplicável" />
                </div>

                {/* Data Nascimento */}
                <div>
                    <label className="form-label">Data de Nascimento *</label>
                    <input {...register('birthDate')} type="date" className="form-input" />
                    {errors.birthDate && <p className="form-error">{errors.birthDate.message}</p>}
                </div>

                {/* Gênero */}
                <div>
                    <label className="form-label">Gênero *</label>
                    <select {...register('gender')} className="form-select">
                        <option value="">Selecione</option>
                        {GENDER_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    {errors.gender && <p className="form-error">{errors.gender.message}</p>}
                </div>

                {/* Estado Civil */}
                <div>
                    <label className="form-label">Estado Civil *</label>
                    <select {...register('maritalStatus')} className="form-select">
                        <option value="">Selecione</option>
                        {MARITAL_STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    {errors.maritalStatus && <p className="form-error">{errors.maritalStatus.message}</p>}
                </div>

                {/* RG */}
                <div>
                    <label className="form-label">RG *</label>
                    <input {...register('rg')} className="form-input" placeholder="Número do RG" />
                    {errors.rg && <p className="form-error">{errors.rg.message}</p>}
                </div>

                {/* Órgão Expedidor */}
                <div>
                    <label className="form-label">Órgão Expedidor *</label>
                    <input {...register('rgIssuer')} className="form-input" placeholder="Ex: SSP/SP" />
                    {errors.rgIssuer && <p className="form-error">{errors.rgIssuer.message}</p>}
                </div>

                {/* Data Emissão RG */}
                <div>
                    <label className="form-label">Data de Emissão do RG *</label>
                    <input {...register('rgIssueDate')} type="date" className="form-input" />
                    {errors.rgIssueDate && <p className="form-error">{errors.rgIssueDate.message}</p>}
                </div>

                {/* RNE */}
                <div>
                    <label className="form-label">RNE</label>
                    <input {...register('rne')} className="form-input" placeholder="Se estrangeiro" />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button type="submit" className="btn-primary">
                    Próximo
                    <ArrowRight size={16} />
                </button>
            </div>
        </form>
    );
}
