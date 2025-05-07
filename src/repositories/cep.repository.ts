import { eq } from "drizzle-orm";
import { db } from "../config/db/connection.js";
import { cepTable } from "../models/cep.model.js";

export class CepRepository {
    async getCepByCep(cep: string) {
        const [result] = await db.select().from(cepTable).where(eq(cepTable.cep, cep));
        return result;
    }

    async getAllCeps() {
        const result = await db.select().from(cepTable);
        return result;
    }

    async createCep(cep: string, data: any) {
        const result = await db.insert(cepTable).values({ cep, ...data });
        return result;
    }

    async patchCep(cep: string, data: any) {
        const result = await db.update(cepTable).set(data).where(eq(cepTable.cep, cep));
        return result;
    }

    async setFavorite(cep: string, favorite: boolean) {
        const result = await db.update(cepTable).set({ favorito: favorite }).where(eq(cepTable.cep, cep));
        return result;
    }
}