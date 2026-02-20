'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema, type AddressInput } from '@/lib/validations/schemas';
import { useFormStore } from '@/lib/form-store';
import { COUNTRIES, STREET_TYPES, BRAZILIAN_STATES } from '@/lib/constants';
import { formatCEP } from '@/lib/validations/cpf';
import { lookupCEP } from '@/lib/cep-lookup';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
    onNext: () => void;
    onBack: () => void;
}

export function AddressStep({ onNext, onBack }: Props) {
    const { state, updateAddress } = useFormStore();
    const [cepLoading, setCepLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<AddressInput>({
        resolver: zodResolver(addressSchema),
        values: state.address as AddressInput,
    });

    const handleCepBlur = async () => {
        const cep = getValues('zipCode');
        if (!cep || cep.replace(/\D/g, '').length !== 8) return;

        setCepLoading(true);
        const result = await lookupCEP(cep);
        setCepLoading(false);

        if (result) {
            setValue('street', result.street, { shouldValidate: true });
            setValue('neighborhood', result.neighborhood, { shouldValidate: true });
            setValue('city', result.city, { shouldValidate: true });
            setValue('state', result.state, { shouldValidate: true });
        }
    };

    const onSubmit = (data: AddressInput) => {
        updateAddress(data);
        onNext();
    };

    const onError = (errors: any) => {
        const errorMessages = Object.values(errors).map((e: any) => e.message).join('\n');
        alert(`Erro de validação:\n${errorMessages}`);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* País */}
                <div>
                    <label className="form-label">País de Residência *</label>
                    <select {...register('country')} className="form-select">
                        {COUNTRIES.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>
                    {errors.country && <p className="form-error">{errors.country.message}</p>}
                </div>

                {/* CEP */}
                <div>
                    <label className="form-label">CEP *</label>
                    <div className="relative">
                        <input
                            {...register('zipCode')}
                            className="form-input pr-10"
                            placeholder="00000-000"
                            maxLength={9}
                            onChange={(e) => {
                                const formatted = formatCEP(e.target.value);
                                setValue('zipCode', formatted, { shouldValidate: true });
                            }}
                            onBlur={handleCepBlur}
                        />
                        {cepLoading && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-text-muted" />
                        )}
                    </div>
                    {errors.zipCode && <p className="form-error">{errors.zipCode.message}</p>}
                </div>

                {/* Tipo Logradouro */}
                <div>
                    <label className="form-label">Tipo de Logradouro *</label>
                    <select {...register('streetType')} className="form-select">
                        <option value="">Selecione uma opção</option>
                        {STREET_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                    {errors.streetType && <p className="form-error">{errors.streetType.message}</p>}
                </div>

                {/* Logradouro */}
                <div>
                    <label className="form-label">Logradouro *</label>
                    <input {...register('street')} className="form-input" placeholder="Rua, Avenida, etc." />
                    {errors.street && <p className="form-error">{errors.street.message}</p>}
                </div>

                {/* Número */}
                <div>
                    <label className="form-label">Número *</label>
                    <input {...register('number')} className="form-input" placeholder="Número" />
                    {errors.number && <p className="form-error">{errors.number.message}</p>}
                </div>

                {/* Bairro */}
                <div>
                    <label className="form-label">Bairro *</label>
                    <input {...register('neighborhood')} className="form-input" placeholder="Bairro" />
                    {errors.neighborhood && <p className="form-error">{errors.neighborhood.message}</p>}
                </div>

                {/* Cidade */}
                <div>
                    <label className="form-label">Cidade *</label>
                    <input {...register('city')} className="form-input" placeholder="Cidade" />
                    {errors.city && <p className="form-error">{errors.city.message}</p>}
                </div>

                {/* Estado */}
                <div>
                    <label className="form-label">Estado *</label>
                    <select {...register('state')} className="form-select">
                        <option value="">Selecione uma opção</option>
                        {BRAZILIAN_STATES.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                    {errors.state && <p className="form-error">{errors.state.message}</p>}
                </div>

                {/* Complemento */}
                <div>
                    <label className="form-label">Complemento</label>
                    <input {...register('complement')} className="form-input" placeholder="..." />
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <button type="button" onClick={onBack} className="btn-secondary">
                    <ArrowLeft size={16} />
                    Voltar
                </button>
                <button type="submit" className="btn-primary">
                    Próximo Passo
                    <ArrowRight size={16} />
                </button>
            </div>
        </form>
    );
}
