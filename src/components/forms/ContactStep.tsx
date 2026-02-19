'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactInput } from '@/lib/validations/schemas';
import { useFormStore } from '@/lib/form-store';
import { EMAIL_TYPE_OPTIONS, OCCUPATION_NATURES, ACTIVITY_SEGMENTS } from '@/lib/constants';
import { formatPhone } from '@/lib/validations/cpf';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
    onNext: () => void;
    onBack: () => void;
}

export function ContactStep({ onNext, onBack }: Props) {
    const { state, updateContact, updateProfessional } = useFormStore();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ContactInput>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            ...(state.contact as ContactInput),
            occupationNature: state.professional.occupationNature || '',
            mainOccupation: state.professional.mainOccupation || '',
            activitySegment: state.professional.activitySegment || '',
            declaredIncome: state.professional.declaredIncome || '',
        },
    });

    const onSubmit = (data: ContactInput) => {
        const { occupationNature, mainOccupation, activitySegment, declaredIncome, ...contactFields } = data;
        updateContact(contactFields);
        updateProfessional({ occupationNature, mainOccupation, activitySegment, declaredIncome });
        onNext();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contato */}
            <div>
                <h3 className="text-sm font-semibold text-accent mb-4 uppercase tracking-wide">Contato & Filiação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    {/* Telefone */}
                    <div>
                        <label className="form-label">Telefone</label>
                        <input
                            {...register('phone')}
                            className="form-input"
                            placeholder="(00) 0000-0000"
                            maxLength={14}
                            onChange={(e) => {
                                const formatted = formatPhone(e.target.value);
                                setValue('phone', formatted);
                            }}
                        />
                    </div>

                    {/* Celular */}
                    <div>
                        <label className="form-label">Celular *</label>
                        <input
                            {...register('mobile')}
                            className="form-input"
                            placeholder="(00) 00000-0000"
                            maxLength={15}
                            onChange={(e) => {
                                const formatted = formatPhone(e.target.value);
                                setValue('mobile', formatted, { shouldValidate: true });
                            }}
                        />
                        {errors.mobile && <p className="form-error">{errors.mobile.message}</p>}
                    </div>

                    {/* Tipo E-mail */}
                    <div>
                        <label className="form-label">Tipo de E-mail *</label>
                        <select {...register('emailType')} className="form-select">
                            {EMAIL_TYPE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        {errors.emailType && <p className="form-error">{errors.emailType.message}</p>}
                    </div>

                    {/* E-mail */}
                    <div>
                        <label className="form-label">E-mail *</label>
                        <input {...register('email')} type="email" className="form-input" placeholder="email@exemplo.com" />
                        {errors.email && <p className="form-error">{errors.email.message}</p>}
                    </div>

                    {/* Nome do Pai */}
                    <div>
                        <label className="form-label">Nome do Pai</label>
                        <input {...register('fatherName')} className="form-input" placeholder="Nome completo" />
                    </div>

                    {/* Nome da Mãe */}
                    <div>
                        <label className="form-label">Nome da Mãe</label>
                        <input {...register('motherName')} className="form-input" placeholder="Nome completo" />
                    </div>

                    {/* Indicação */}
                    <div className="md:col-span-2">
                        <label className="form-label">Indicação</label>
                        <input {...register('referral')} className="form-input" placeholder="Quem indicou (se houver)" />
                    </div>
                </div>
            </div>

            {/* Profissional (merged) */}
            <div>
                <h3 className="text-sm font-semibold text-accent mb-4 uppercase tracking-wide">Dados Profissionais</h3>
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
                        <input {...register('mainOccupation')} className="form-input" placeholder="Ex: Engenheiro, Advogado..." />
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
                        <input {...register('declaredIncome')} className="form-input" placeholder="R$ 0,00" />
                        {errors.declaredIncome && <p className="form-error">{errors.declaredIncome.message}</p>}
                    </div>
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
