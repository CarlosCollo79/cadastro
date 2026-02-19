export type ClientStatus = 'incomplete' | 'pending' | 'approved' | 'rejected';
export type Gender = 'masculino' | 'feminino' | 'outro' | 'nao_informado';
export type MaritalStatus = 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'separado' | 'uniao_estavel';
export type EmailType = 'pessoal' | 'comercial' | 'outro';
export type DocumentType = 'rg_front' | 'rg_back' | 'proof_address' | 'selfie' | 'other';
export type RiskLevel = 'baixo' | 'medio' | 'alto' | 'nao_avaliado';

export interface ClientPersonalData {
    cpf: string;
    name: string;
    socialName?: string;
    birthDate: string;
    gender: Gender;
    maritalStatus: MaritalStatus;
    rg: string;
    rgIssuer: string;
    rgIssueDate: string;
    rne?: string;
}

export interface ClientNationality {
    birthState: string;
    birthCity: string;
    originCountry: string;
    residenceCountry: string;
}

export interface ClientAddress {
    country: string;
    zipCode: string;
    streetType: string;
    street: string;
    number: string;
    neighborhoodType?: string;
    neighborhood: string;
    city: string;
    state: string;
    complement?: string;
}

export interface ClientContact {
    phone?: string;
    mobile: string;
    emailType: EmailType;
    email: string;
    fatherName?: string;
    motherName?: string;
    referral?: string;
}

export interface ClientProfessional {
    occupationNature: string;
    mainOccupation: string;
    activitySegment: string;
    declaredIncome: string;
}

export interface ClientDocument {
    id: string;
    type: DocumentType;
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
}

export interface ClientFormData {
    personalData: ClientPersonalData;
    nationality: ClientNationality;
    address: ClientAddress;
    contact: ClientContact;
    professional: ClientProfessional;
    documents: ClientDocument[];
    notes?: string;
}

export interface Client extends ClientFormData {
    id: string;
    status: ClientStatus;
    riskLevel: RiskLevel;
    createdAt: string;
    updatedAt: string;
}

export const WIZARD_STEPS = [
    { id: 1, key: 'personalData', label: 'Dados Pessoais', labelEn: 'Personal Data' },
    { id: 2, key: 'address', label: 'Endereço', labelEn: 'Address' },
    { id: 3, key: 'contact', label: 'Contato & Profissional', labelEn: 'Contact & Professional' },
    { id: 4, key: 'documents', label: 'Documentos', labelEn: 'Documents' },
    { id: 5, key: 'review', label: 'Revisão', labelEn: 'Review' },
] as const;
