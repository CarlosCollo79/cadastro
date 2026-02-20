'use server';

interface CepResponse {
    cep: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    service: string;
}

export async function lookupCEP(cep: string): Promise<CepResponse | null> {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length !== 8) return null;

    try {
        const res = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleaned}`);
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}
