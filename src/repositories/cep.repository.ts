import { eq } from "drizzle-orm";
import { db } from "../config/db/connection.js";
import { cepTable } from "../models/cep.model.js";

export class CepRepository {
    async getByCep(cep: string) {
        const [result] = await db.select().from(cepTable).where(eq(cepTable.cep, cep));
        return result;
    }
}