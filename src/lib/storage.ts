'use server';

import { db } from '@/db';
import { clients, documents } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import type { Client, ClientStatus, DocumentType, EmailType, Gender, MaritalStatus, RiskLevel } from '@/types/client';

export async function getClients(userId?: string): Promise<Client[]> {
    if (!userId) return [];

    const results = await db.query.clients.findMany({
        where: eq(clients.userId, userId),
        with: {
            documents: true,
        },
        orderBy: [desc(clients.createdAt)],
    });

    return results.map(row => mapDbToClient(row));
}

export async function getClientById(id: string, userId?: string): Promise<Client | undefined> {
    const result = await db.query.clients.findFirst({
        where: userId
            ? and(eq(clients.id, id), eq(clients.userId, userId))
            : eq(clients.id, id),
        with: {
            documents: true,
        },
    });

    return result ? mapDbToClient(result) : undefined;
}

export async function getLatestClient(userId?: string): Promise<Client | undefined> {
    if (!userId) return undefined;

    const result = await db.query.clients.findFirst({
        where: eq(clients.userId, userId),
        orderBy: [desc(clients.createdAt)],
        with: {
            documents: true,
        },
    });

    return result ? mapDbToClient(result) : undefined;
}

export async function getAllClients(): Promise<(Client & { userId?: string })[]> {
    const results = await db.query.clients.findMany({
        with: {
            documents: true,
        },
        orderBy: [desc(clients.createdAt)],
    });

    return results.map(row => ({
        ...mapDbToClient(row),
        userId: row.userId ?? undefined,
    }));
}

export async function saveClient(client: Client, userId?: string): Promise<void> {
    const { personalData, nationality, address, contact, professional, documents: clientDocs } = client;

    await db.transaction(async (tx) => {
        // Upsert Client
        await tx.insert(clients).values({
            id: client.id,
            userId: userId || null,
            name: personalData.name,
            cpf: personalData.cpf,
            socialName: personalData.socialName || null,
            birthDate: personalData.birthDate,
            gender: personalData.gender,
            maritalStatus: personalData.maritalStatus,
            rg: personalData.rg,
            rgIssuer: personalData.rgIssuer,
            rgIssueDate: personalData.rgIssueDate,
            rne: personalData.rne || null,

            birthState: nationality.birthState,
            birthCity: nationality.birthCity,
            originCountry: nationality.originCountry,
            residenceCountry: nationality.residenceCountry,

            zipCode: address.zipCode,
            streetType: address.streetType,
            street: address.street,
            number: address.number,
            neighborhoodType: address.neighborhoodType || null,
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
            complement: address.complement || null,
            country: address.country,

            phone: contact.phone || null,
            mobile: contact.mobile,
            emailType: contact.emailType,
            email: contact.email,
            fatherName: contact.fatherName || null,
            motherName: contact.motherName || null,
            referral: contact.referral || null,

            occupationNature: professional.occupationNature,
            mainOccupation: professional.mainOccupation,
            activitySegment: professional.activitySegment,
            declaredIncome: professional.declaredIncome,

            status: client.status,
            riskLevel: client.riskLevel,
            notes: client.notes || null,
            createdAt: client.createdAt,
            updatedAt: new Date().toISOString(),
        }).onConflictDoUpdate({
            target: clients.id,
            set: {
                userId: userId || null,
                name: personalData.name,
                cpf: personalData.cpf,
                socialName: personalData.socialName || null,
                birthDate: personalData.birthDate,
                gender: personalData.gender,
                maritalStatus: personalData.maritalStatus,
                rg: personalData.rg,
                rgIssuer: personalData.rgIssuer,
                rgIssueDate: personalData.rgIssueDate,
                rne: personalData.rne || null,
                birthState: nationality.birthState,
                birthCity: nationality.birthCity,
                originCountry: nationality.originCountry,
                residenceCountry: nationality.residenceCountry,
                zipCode: address.zipCode,
                streetType: address.streetType,
                street: address.street,
                number: address.number,
                neighborhoodType: address.neighborhoodType || null,
                neighborhood: address.neighborhood,
                city: address.city,
                state: address.state,
                complement: address.complement || null,
                country: address.country,
                phone: contact.phone || null,
                mobile: contact.mobile,
                emailType: contact.emailType,
                email: contact.email,
                fatherName: contact.fatherName || null,
                motherName: contact.motherName || null,
                referral: contact.referral || null,
                occupationNature: professional.occupationNature,
                mainOccupation: professional.mainOccupation,
                activitySegment: professional.activitySegment,
                declaredIncome: professional.declaredIncome,
                status: client.status,
                riskLevel: client.riskLevel,
                notes: client.notes || null,
                updatedAt: new Date().toISOString(),
            }
        });

        // Delete existing documents for this client and re-insert
        await tx.delete(documents).where(eq(documents.clientId, client.id));

        if (clientDocs.length > 0) {
            await tx.insert(documents).values(
                clientDocs.map(doc => ({
                    id: doc.id,
                    clientId: client.id,
                    type: doc.type,
                    fileName: doc.fileName,
                    fileUrl: doc.fileUrl,
                    uploadedAt: doc.uploadedAt,
                }))
            );
        }
    });
}

export async function updateClientStatus(id: string, status: ClientStatus, userId?: string): Promise<void> {
    await db.update(clients)
        .set({ status, updatedAt: new Date().toISOString() })
        .where(userId
            ? and(eq(clients.id, id), eq(clients.userId, userId))
            : eq(clients.id, id)
        );
}

export async function generateId(): Promise<string> {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

type DbClient = typeof clients.$inferSelect & {
    documents?: (typeof documents.$inferSelect)[];
};

// Helper to map DB row back to Client type
function mapDbToClient(row: DbClient): Client {
    const n = <T>(val: T | null): T | undefined => val === null ? undefined : val;
    const s = (val: string | null): string => val === null ? '' : val;

    return {
        id: row.id,
        status: (row.status || 'incomplete') as ClientStatus,
        riskLevel: (row.riskLevel || 'nao_avaliado') as RiskLevel,
        notes: s(row.notes),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        personalData: {
            cpf: s(row.cpf),
            name: row.name,
            socialName: n(row.socialName),
            birthDate: s(row.birthDate),
            gender: (row.gender || 'nao_informado') as Gender,
            maritalStatus: (row.maritalStatus || 'solteiro') as MaritalStatus,
            rg: s(row.rg),
            rgIssuer: s(row.rgIssuer),
            rgIssueDate: s(row.rgIssueDate),
            rne: n(row.rne),
        },
        nationality: {
            birthState: s(row.birthState),
            birthCity: s(row.birthCity),
            originCountry: s(row.originCountry),
            residenceCountry: s(row.residenceCountry),
        },
        address: {
            zipCode: s(row.zipCode),
            streetType: s(row.streetType),
            street: s(row.street),
            number: s(row.number),
            neighborhoodType: n(row.neighborhoodType),
            neighborhood: s(row.neighborhood),
            city: s(row.city),
            state: s(row.state),
            complement: n(row.complement),
            country: s(row.country),
        },
        contact: {
            phone: n(row.phone),
            mobile: s(row.mobile),
            emailType: (row.emailType || 'pessoal') as EmailType,
            email: s(row.email),
            fatherName: n(row.fatherName),
            motherName: n(row.motherName),
            referral: n(row.referral),
        },
        professional: {
            occupationNature: s(row.occupationNature),
            mainOccupation: s(row.mainOccupation),
            activitySegment: s(row.activitySegment),
            declaredIncome: s(row.declaredIncome),
        },
        documents: (row.documents || []).map(doc => ({
            id: doc.id,
            type: doc.type as DocumentType,
            fileName: doc.fileName,
            fileUrl: doc.fileUrl,
            uploadedAt: doc.uploadedAt,
        })),
    };
}
