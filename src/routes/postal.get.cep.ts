import { FastifyInstance } from "fastify";
import { PostalController } from "../controllers/postal.controller.js";
import { PostalService } from "../services/postal.service.js";
import { PostalRepository } from "../repositories/postal.repository.js";
import { z } from "zod";

export const postalGet = async (app: FastifyInstance) => {
    const postalRepository = new PostalRepository();
    const postalService = new PostalService(postalRepository);
    const postalController = new PostalController(postalService);

    app.get('/:postalCode', {
      schema: {
        description: "Buscar informações a partir de um CEP.",
        tags: ['cep'],
        response: {
            200: z.object({
                code: z.string().describe('Código postal'),
                city: z.string().describe('Cidade'),
                state: z.string().describe('Estado'),
                neighborhood: z.string().describe('Bairro'),
                street: z.string().describe('Rua'),
            }).describe('Informações do CEP'),
            404: z.object({
                error: z.string().describe('Erro'),
                details: z.object({
                    message: z.string().describe('Mensagem de erro'),
                    code: z.string().describe('Código do erro'),
                }).describe('Detalhes do erro'),
            }).describe('Erro ao buscar informações do CEP'),
        }
      },  
    }, postalController.getPostalCode.bind(postalController));
}