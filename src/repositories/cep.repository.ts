import { eq } from "drizzle-orm";
import { db } from "../config/db/connection.js";
import { Cep, cepTable } from "../models/cep.model.js";

/**
 * Repositório de CEPs.
 * @class
 */
export class CepRepository {
    
    /**
     * Busca um CEP pelo CEP.
     * @param cep CEP a ser buscado
     * @returns result Retorna as informações do CEP
     */
    async getCepByCep(cep: string): Promise<Cep | null> {
        const [result] = await db.select().from(cepTable).where(eq(cepTable.cep, cep));
        return result;
    }

    /**
     * Busca todos os CEPs.
     * @returns result Retorna uma lista de todos os CEPs
     */
    async getAll(): Promise<Cep[]> {
        const result = await db.select().from(cepTable);
        return result;
    }

    /**
     * Cria um novo CEP.
     * @param cep CEP a ser criado
     * @param data Dados do CEP
     * @returns result Retorna as informações do CEP criado
     */
    async createCep(cep: string, data: any): Promise<Cep> {
        const [result] = await db.insert(cepTable).values({ cep, ...data }).returning();
        return result;
    }

    /**
     * Atualiza um CEP.
     * @param cep CEP a ser atualizado
     * @param data Dados do CEP
     * @returns result Retorna as informações do CEP atualizado
     */
    async patchCep(cep: string, data: { bairro?: string | undefined, logradouro?: string | undefined }): Promise<Cep | null> {
        const [result] = await db.update(cepTable).set(data).where(eq(cepTable.cep, cep)).returning();
        return result;
    }

    /**
     * Atualiza o valor de favorito de um CEP.
     * @param cep CEP a ser definido como favorito
     * @param favorite Valor booleano indicando se o CEP é favorito ou nâo
     * @returns 
     */
    async setFavorite(cep: string, favorite: boolean): Promise<Cep | null> {
        const [result] = await db.update(cepTable).set({ favorito: favorite }).where(eq(cepTable.cep, cep)).returning();
        return result;
    }
}