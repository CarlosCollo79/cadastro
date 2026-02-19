import type { Client, ClientStatus } from '@/types/client';

const STORAGE_KEY = 'cadastro_clients';

export function getClients(): Client[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

export function getClientById(id: string): Client | undefined {
    return getClients().find((c) => c.id === id);
}

export function getLatestClient(): Client | undefined {
    const clients = getClients();
    return clients.length > 0 ? clients[clients.length - 1] : undefined;
}

export function saveClient(client: Client): void {
    const clients = getClients();
    const index = clients.findIndex((c) => c.id === client.id);
    if (index >= 0) {
        clients[index] = { ...client, updatedAt: new Date().toISOString() };
    } else {
        clients.push(client);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export function updateClientStatus(id: string, status: ClientStatus): void {
    const clients = getClients();
    const index = clients.findIndex((c) => c.id === id);
    if (index >= 0) {
        clients[index].status = status;
        clients[index].updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    }
}

export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
