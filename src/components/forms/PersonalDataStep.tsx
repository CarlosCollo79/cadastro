'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalDataSchema, type PersonalDataInput } from '@/lib/validations/schemas';
import { useFormStore } from '@/lib/form-store';
import { GENDER_OPTIONS, MARITAL_STATUS_OPTIONS, BRAZILIAN_STATES, COUNTRIES } from '@/lib/constants';
import { formatCPF, formatDate } from '@/lib/validations/cpf';
import { ArrowRight } from 'lucide-react';

interface Props {
    onNext: () => void;
}

export function PersonalDataStep({ onNext }: Props) {
    const { state, updatePersonalData, updateNationality } = useFormStore();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<PersonalDataInput>({
        resolver: zodResolver(personalDataSchema),
        defaultValues: {
            ...(state.personalData as PersonalDataInput),
            birthState: state.nationality.birthState || '',
            birthCity: state.nationality.birthCity || '',
            originCountry: state.nationality.originCountry || '',
            residenceCountry: state.nationality.residenceCountry || '',
        },
    });



    const onSubmit = (data: PersonalDataInput) => {
        const { birthState, birthCity, originCountry, residenceCountry, ...personalFields } = data;
        updatePersonalData(personalFields);
        updateNationality({ birthState, birthCity, originCountry, residenceCountry });
        onNext();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Dados Pessoais */}
            <div>
                <h3 className="text-sm font-semibold text-accent mb-4 uppercase tracking-wide">Identificação</h3>
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
                        <input
                            {...register('birthDate')}
                            className="form-input"
                            placeholder="dd/mm/aaaa"
                            maxLength={10}
                            onChange={(e) => {
                                const formatted = formatDate(e.target.value);
                                setValue('birthDate', formatted, { shouldValidate: true });
                            }}
                        />
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
                        <input
                            {...register('rgIssueDate')}
                            className="form-input"
                            placeholder="dd/mm/aaaa"
                            maxLength={10}
                            onChange={(e) => {
                                const formatted = formatDate(e.target.value);
                                setValue('rgIssueDate', formatted, { shouldValidate: true });
                            }}
                        />
                        {errors.rgIssueDate && <p className="form-error">{errors.rgIssueDate.message}</p>}
                    </div>

                    {/* RNE */}
                    <div>
                        <label className="form-label">RNE</label>
                        <input {...register('rne')} className="form-input" placeholder="Se estrangeiro" />
                    </div>
                </div>
            </div>

            {/* Naturalidade (merged) */}
            <div>
                <h3 className="text-sm font-semibold text-accent mb-4 uppercase tracking-wide">Naturalidade</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    {/* UF */}
                    <div>
                        <label className="form-label">Natural (UF) *</label>
                        <select {...register('birthState')} className="form-select">
                            <option value="">Selecione</option>
                            {BRAZILIAN_STATES.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                        {errors.birthState && <p className="form-error">{errors.birthState.message}</p>}
                    </div>

                    {/* Cidade */}
                    <div>
                        <label className="form-label">Natural (Cidade) *</label>
                        <input {...register('birthCity')} className="form-input" placeholder="Informe a cidade" />
                        {errors.birthCity && <p className="form-error">{errors.birthCity.message}</p>}
                    </div>

                    {/* País Origem */}
                    <div>
                        <label className="form-label">País de Origem *</label>
                        <select {...register('originCountry')} className="form-select">
                            <option value="">Selecione</option>
                            {COUNTRIES.map((c) => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                        {errors.originCountry && <p className="form-error">{errors.originCountry.message}</p>}
                    </div>

                    {/* País Residência */}
                    <div>
                        <label className="form-label">País de Residência *</label>
                        <select {...register('residenceCountry')} className="form-select">
                            <option value="">Selecione</option>
                            {COUNTRIES.map((c) => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                        {errors.residenceCountry && <p className="form-error">{errors.residenceCountry.message}</p>}
                    </div>
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
