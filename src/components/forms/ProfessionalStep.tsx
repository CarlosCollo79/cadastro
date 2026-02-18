'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { professionalSchema, type ProfessionalInput } from '@/lib/validations/schemas';
import { useFormStore } from '@/lib/form-store';
import { OCCUPATION_NATURES, ACTIVITY_SEGMENTS } from '@/lib/constants';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
    onNext: () => void;
    onBack: () => void;
}

export function ProfessionalStep({ onNext, onBack }: Props) {
    const { state, updateProfessional } = useFormStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfessionalInput>({
        resolver: zodResolver(professionalSchema),
        defaultValues: state.professional as ProfessionalInput,
    });

    const onSubmit = (data: ProfessionalInput) => {
        updateProfessional(data);
        onNext();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* Natureza de Ocupação */}
                <div>
                    <label className="form-label">Natureza de Ocupação *</label>
                    <select {...register('occupationNature')} className="form-select">
                        <option value="">Selecione</option>
                        {OCCUPATION_NATURES.map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                    {errors.occupationNature && <p className="form-error">{errors.occupationNature.message}</p>}
                </div>

                {/* Ocupação Principal */}
                <div>
                    <label className="form-label">Ocupação Principal *</label>
                    <input
                        {...register('mainOccupation')}
                        className="form-input"
                        placeholder="Ex: Engenheiro, Advogado..."
                    />
                    {errors.mainOccupation && <p className="form-error">{errors.mainOccupation.message}</p>}
                </div>

                {/* Segmento de Atividade */}
                <div>
                    <label className="form-label">Segmento de Atividade *</label>
                    <select {...register('activitySegment')} className="form-select">
                        <option value="">Selecione</option>
                        {ACTIVITY_SEGMENTS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    {errors.activitySegment && <p className="form-error">{errors.activitySegment.message}</p>}
                </div>

                {/* Renda Declarada */}
                <div>
                    <label className="form-label">Renda Declarada *</label>
                    <input
                        {...register('declaredIncome')}
                        className="form-input"
                        placeholder="R$ 0,00"
                    />
                    {errors.declaredIncome && <p className="form-error">{errors.declaredIncome.message}</p>}
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
