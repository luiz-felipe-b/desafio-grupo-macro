import { pgTable, text, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';

/**
 * Tabela de CEPs.
 */
export const cepTable = pgTable('ceps', {
    id: varchar('id', { length: 36 }).primaryKey().notNull().$defaultFn(() => uuid()),
    favorito: boolean('favorito').notNull().default(false),
    cep: varchar('cep', { length: 9 }).notNull().unique(),
    logradouro: text('logradouro').notNull(),
    complemento: text('complemento'),
    unidade: text('unidade'),
    bairro: text('bairro').notNull(),
    localidade: text('localidade').notNull(),
    uf: varchar('uf', { length: 2 }).notNull(),
    estado: text('estado').notNull(),
    regiao: text('regiao').notNull(),
    ibge: text('ibge'),
    gia: text('gia'),
    ddd: varchar('ddd', { length: 2 }),
    siafi: text('siafi'),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow()
});

/**
 * Schema Zod de validação para o modelo de CEP.
 */
export const CepSchema = z.object({
    id: z.string().uuid(),
    favorito: z.boolean().default(false),
    cep: z.string(),
    logradouro: z.string().nonempty(),
    complemento: z.string().nullable(),
    unidade: z.string().nullable(),
    bairro: z.string().nonempty(),
    localidade: z.string().nonempty(),
    uf: z.string(),
    estado: z.string().nonempty(),
    regiao: z.string().nonempty(),
    ibge: z.string().nullable(),
    gia: z.string().nullable(),
    ddd: z.string().nullable(),
    siafi: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const insertCepSchema = createInsertSchema(cepTable);
export const selectCepSchema = createSelectSchema(cepTable);

export type Cep = z.infer<typeof CepSchema>;
export type InsertCep = z.infer<typeof insertCepSchema>;
export type SelectCep = z.infer<typeof selectCepSchema>;