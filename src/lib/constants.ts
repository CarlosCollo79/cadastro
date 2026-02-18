export const BRAZILIAN_STATES = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' },
] as const;

export const COUNTRIES = [
    { value: 'BR', label: 'Brasil' },
    { value: 'US', label: 'Estados Unidos' },
    { value: 'AR', label: 'Argentina' },
    { value: 'UY', label: 'Uruguai' },
    { value: 'PY', label: 'Paraguai' },
    { value: 'CL', label: 'Chile' },
    { value: 'CO', label: 'Colômbia' },
    { value: 'PE', label: 'Peru' },
    { value: 'MX', label: 'México' },
    { value: 'PT', label: 'Portugal' },
    { value: 'ES', label: 'Espanha' },
    { value: 'FR', label: 'França' },
    { value: 'DE', label: 'Alemanha' },
    { value: 'IT', label: 'Itália' },
    { value: 'GB', label: 'Reino Unido' },
    { value: 'JP', label: 'Japão' },
    { value: 'CN', label: 'China' },
    { value: 'OTHER', label: 'Outro' },
] as const;

export const STREET_TYPES = [
    'Rua', 'Avenida', 'Alameda', 'Travessa', 'Praça',
    'Rodovia', 'Estrada', 'Largo', 'Viela', 'Beco',
] as const;

export const OCCUPATION_NATURES = [
    'Empregado', 'Autônomo', 'Empresário', 'Profissional Liberal',
    'Funcionário Público', 'Aposentado', 'Estudante', 'Do Lar', 'Outro',
] as const;

export const ACTIVITY_SEGMENTS = [
    'Comércio', 'Indústria', 'Serviços', 'Agropecuária',
    'Tecnologia', 'Saúde', 'Educação', 'Financeiro',
    'Jurídico', 'Construção Civil', 'Transportes', 'Outro',
] as const;

export const GENDER_OPTIONS = [
    { value: 'masculino', label: 'Masculino' },
    { value: 'feminino', label: 'Feminino' },
    { value: 'outro', label: 'Outro' },
    { value: 'nao_informado', label: 'Não Informado' },
] as const;

export const MARITAL_STATUS_OPTIONS = [
    { value: 'solteiro', label: 'Solteiro(a)' },
    { value: 'casado', label: 'Casado(a)' },
    { value: 'divorciado', label: 'Divorciado(a)' },
    { value: 'viuvo', label: 'Viúvo(a)' },
    { value: 'separado', label: 'Separado(a)' },
    { value: 'uniao_estavel', label: 'União Estável' },
] as const;

export const EMAIL_TYPE_OPTIONS = [
    { value: 'pessoal', label: 'Pessoal' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'outro', label: 'Outro' },
] as const;
