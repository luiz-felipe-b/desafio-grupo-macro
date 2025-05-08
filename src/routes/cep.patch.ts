import { FastifyInstance } from "fastify";
import { CepController } from "../controllers/cep.controller.js";
import { CepRepository } from "../repositories/cep.repository.js";
import { CepService } from "../services/cep.service.js";
import { z } from "zod";


export const cepPatch = async (app: FastifyInstance) => {
    const cepRepository = new CepRepository();
    const cepService = new CepService(cepRepository);
    const cepController = new CepController(cepService);

    app.patch('/:cep', {
        schema: {
            description: "Atualizar o bairro e/ou logradouro de um CEP.",
            tags: ['cep'],
            body: z.object({
                bairro: z.string().optional().describe('Bairro'),
                logradouro: z.string().optional().describe('Logradouro')
            }).describe('Dados para marcar o CEP como favorito'),
            response: {
                200: z.object({
                    message: z.string().describe('Mensagem')
                }).describe('Informações do CEP'),
                400: z.object({
                    message: z.string().describe('Mensagem'),
                    details: z.string().describe('Detalhes')
                }).describe('Erros na requisição'),
                404: z.object({
                    message: z.string().describe('Mensagem'),
                    details: z.string().describe('Detalhes')
                }).describe('CEP não foi encontrado')
            }
        }
    }, cepController.patch.bind(cepController)) 
}