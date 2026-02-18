import { z } from 'zod';
import { isValidCPF } from './cpf';

export const personalDataSchema = z.object({
    cpf: z.string()
        .min(1, 'CPF é obrigatório')
        .refine((val) => isValidCPF(val), { message: 'CPF inválido' }),
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    socialName: z.string().optional(),
    birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
    gender: z.enum(['masculino', 'feminino', 'outro', 'nao_informado'], {
        errorMap: () => ({ message: 'Selecione o gênero' }),
    }),
    maritalStatus: z.enum(['solteiro', 'casado', 'divorciado', 'viuvo', 'separado', 'uniao_estavel'], {
        errorMap: () => ({ message: 'Selecione o estado civil' }),
    }),
    rg: z.string().min(1, 'RG é obrigatório'),
    rgIssuer: z.string().min(1, 'Órgão expedidor é obrigatório'),
    rgIssueDate: z.string().min(1, 'Data de emissão é obrigatória'),
    rne: z.string().optional(),
});

export const nationalitySchema = z.object({
    birthState: z.string().min(1, 'UF é obrigatório'),
    birthCity: z.string().min(1, 'Cidade é obrigatória'),
    originCountry: z.string().min(1, 'País de origem é obrigatório'),
    residenceCountry: z.string().min(1, 'País de residência é obrigatório'),
});

export const addressSchema = z.object({
    country: z.string().min(1, 'País é obrigatório'),
    zipCode: z.string().min(1, 'CEP é obrigatório'),
    streetType: z.string().min(1, 'Tipo de logradouro é obrigatório'),
    street: z.string().min(1, 'Logradouro é obrigatório'),
    number: z.string().min(1, 'Número é obrigatório'),
    neighborhoodType: z.string().optional().default(''),
    neighborhood: z.string().min(1, 'Bairro é obrigatório'),
    city: z.string().min(1, 'Cidade é obrigatória'),
    state: z.string().min(1, 'Estado é obrigatório'),
    complement: z.string().optional(),
});

export const contactSchema = z.object({
    phone: z.string().optional(),
    mobile: z.string().min(1, 'Celular é obrigatório'),
    emailType: z.enum(['pessoal', 'comercial', 'outro'], {
        errorMap: () => ({ message: 'Selecione o tipo de e-mail' }),
    }),
    email: z.string().email('E-mail inválido'),
    fatherName: z.string().optional(),
    motherName: z.string().optional(),
    referral: z.string().optional(),
});

export const professionalSchema = z.object({
    occupationNature: z.string().min(1, 'Natureza de ocupação é obrigatória'),
    mainOccupation: z.string().min(1, 'Ocupação principal é obrigatória'),
    activitySegment: z.string().min(1, 'Segmento de atividade é obrigatório'),
    declaredIncome: z.string().min(1, 'Renda declarada é obrigatória'),
});

export type PersonalDataInput = z.infer<typeof personalDataSchema>;
export type NationalityInput = z.infer<typeof nationalitySchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ProfessionalInput = z.infer<typeof professionalSchema>;
