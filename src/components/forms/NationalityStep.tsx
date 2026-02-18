'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nationalitySchema, type NationalityInput } from '@/lib/validations/schemas';
import { useFormStore } from '@/lib/form-store';
import { BRAZILIAN_STATES, COUNTRIES } from '@/lib/constants';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
    onNext: () => void;
    onBack: () => void;
}

export function NationalityStep({ onNext, onBack }: Props) {
    const { state, updateNationality } = useFormStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<NationalityInput>({
        resolver: zodResolver(nationalitySchema),
        defaultValues: state.nationality as NationalityInput,
    });

    const onSubmit = (data: NationalityInput) => {
        updateNationality(data);
        onNext();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    <input
                        {...register('birthCity')}
                        className="form-input"
                        placeholder="Informe a cidade"
                    />
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

            <div className="flex justify-between pt-4">
                <button type="button" onClick={onBack} className="btn-secondary">
                    <ArrowLeft size={16} />
                    Voltar
                </button>
                <button type="submit" className="btn-primary">
                    Próximo
                    <ArrowRight size={16} />
                </button>
            </div>
        </form>
    );
}
