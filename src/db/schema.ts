import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const clients = sqliteTable('clients', {
    id: text('id').primaryKey(),
    userId: text('user_id'), // Added for isolation
    status: text('status').$type<'incomplete' | 'pending' | 'approved' | 'rejected'>().default('incomplete'),
    riskLevel: text('risk_level').$type<'baixo' | 'medio' | 'alto' | 'nao_avaliado'>().default('nao_avaliado'),
    notes: text('notes'),

    // Personal Data
    cpf: text('cpf'),
    name: text('name').notNull(),
    socialName: text('social_name'),
    birthDate: text('birth_date'),
    gender: text('gender'),
    maritalStatus: text('marital_status'),
    rg: text('rg'),
    rgIssuer: text('rg_issuer'),
    rgIssueDate: text('rg_issue_date'),
    rne: text('rne'),

    // Nationality
    birthState: text('birth_state'),
    birthCity: text('birth_city'),
    originCountry: text('origin_country'),
    residenceCountry: text('residence_country'),

    // Address
    zipCode: text('zip_code'),
    streetType: text('street_type'),
    street: text('street'),
    number: text('number'),
    neighborhoodType: text('neighborhood_type'),
    neighborhood: text('neighborhood'),
    city: text('city'),
    state: text('state'),
    complement: text('complement'),
    country: text('country'),

    // Contact
    phone: text('phone'),
    mobile: text('mobile'),
    emailType: text('email_type'),
    email: text('email'),
    fatherName: text('father_name'),
    motherName: text('mother_name'),
    referral: text('referral'),

    // Professional
    occupationNature: text('occupation_nature'),
    mainOccupation: text('main_occupation'),
    activitySegment: text('activity_segment'),
    declaredIncome: text('declared_income'),

    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
});

export const documents = sqliteTable('documents', {
    id: text('id').primaryKey(),
    clientId: text('client_id').references(() => clients.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    fileName: text('file_name').notNull(),
    fileUrl: text('file_url').notNull(),
    uploadedAt: text('uploaded_at').notNull(),
});

// Relations
export const clientsRelations = relations(clients, ({ many }) => ({
    documents: many(documents),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
    client: one(clients, {
        fields: [documents.clientId],
        references: [clients.id],
    }),
}));
