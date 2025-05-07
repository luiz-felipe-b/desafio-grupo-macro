import { pgTable, text, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';

export const cepTable = pgTable('ceps', {
    id: varchar('id', { length: 36 }).primaryKey().notNull().$defaultFn(() => uuid()),
    favorito: boolean('favorito').default(false),
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

export const CepSchema = z.object({
    id: z.string().uuid(),
    favorito: z.boolean().default(false),
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