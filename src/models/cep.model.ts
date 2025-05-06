import { pgTable, text, varchar, uniqueIndex } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const cepTable = pgTable('ceps', {
    id: varchar('id', { length: 36 }).primaryKey().notNull(),
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
    createdAt: text('created_at').notNull().default(new Date().toISOString()),
    updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
});

export const CepSchema = z.object({
    id: z.string().uuid(),
    cep: z.string().length(9),
    logradouro: z.string().nonempty(),
    complemento: z.string().optional(),
    unidade: z.string().optional(),
    bairro: z.string().nonempty(),
    localidade: z.string().nonempty(),
    uf: z.string().length(2),
    estado: z.string().nonempty(),
    regiao: z.string().nonempty(),
    ibge: z.string().optional(),
    gia: z.string().optional(),
    ddd: z.string().optional(),
    siafi: z.string().optional(),
    updatedAt: z.string().datetime(),
});

export const insertCepSchema = createInsertSchema(cepTable);
export const selectCepSchema = createSelectSchema(cepTable);

export type Cep = z.infer<typeof CepSchema>;
export type InsertCep = z.infer<typeof insertCepSchema>;
export type SelectCep = z.infer<typeof selectCepSchema>;