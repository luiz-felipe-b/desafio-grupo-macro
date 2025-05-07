import { FastifyInstance } from "fastify";
import { CepController } from "../controllers/cep.controller.js";
import { CepService } from "../services/cep.service.js";
import { CepRepository } from "../repositories/cep.repository.js";
import { z } from "zod";

export const cepGet = async (app: FastifyInstance) => {
    const cepRepository = new CepRepository();
    const cepService = new CepService(cepRepository);
    const cepController = new CepController(cepService);

    app.get('/:cep', {
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
    }, cepController.getByCep.bind(cepController));
}