import { FastifyInstance } from "fastify";
import { CepController } from "../controllers/cep.controller.js";
import { CepRepository } from "../repositories/cep.repository.js";
import { CepService } from "../services/cep.service.js";
import { z } from "zod";

/**
 * Rota para marcar um CEP como favorito.
 * @param app - Instância do Fastify
 */
export const cepPostFavorite = async (app: FastifyInstance) => {
    const cepRepository = new CepRepository();
    const cepService = new CepService(cepRepository);
    const cepController = new CepController(cepService);

    app.post('/:cep/favorite', {
        schema: {
            description: "Marcar um CEP como favorito.",
            tags: ['cep'],
            body: z.object({
                favorite: z.boolean().describe('Favorito'),
            }).describe('Dados para marcar o CEP como favorito'),
            response: {
                200: z.object({
                    cep: z.string().describe('CEP'),
                    favorite: z.boolean().describe('Favorito'),
                }).describe('Informações do CEP'),
            }
        }
    }, cepController.setFavorite.bind(cepController));
}