import { FastifyInstance } from "fastify";
import { CepController } from "../controllers/cep.controller.js";
import { CepService } from "../services/cep.service.js";
import { CepRepository } from "../repositories/cep.repository.js";
import { z } from "zod";

/**
 * Rota para buscar informações de um CEP.
 * @param app - Instância do Fastify
 */
export const cepGetCep = async (app: FastifyInstance) => {
    const cepRepository = new CepRepository();
    const cepService = new CepService(cepRepository);
    const cepController = new CepController(cepService);

    app.get('/:cep', {
      schema: {
        description: "Buscar informações a partir de um CEP.",
        tags: ['cep'],
        response: {
            200: z.object({
                id: z.string().describe('ID do CEP'),
                favorito: z.boolean().describe('Favorito'),
                cep: z.string().describe('CEP'),
                logradouro: z.string().describe('Logradouro'),
                complemento: z.string().describe('Complemento'),
                bairro: z.string().describe('Bairro'),
                localidade: z.string().describe('Localidade'),
                uf: z.string().describe('Unidade Federativa'),
                estado: z.string().describe('Estado'),
                regiao: z.string().describe('Região'),
                ibge: z.string().describe('Código IBGE'),
                gia: z.string().describe('Código GIA'),
                ddd: z.string().describe('DDD'),
                siafi: z.string().describe('Código SIAFI'),
                createdAt: z.date().describe('Data de criação'),
                updatedAt: z.date().describe('Data de atualização'),
            }).describe('Informações do CEP'),
            400: z.object({
                message: z.string().describe('Mensagem de erro'),
                details: z.string().describe('Detalhes do erro'),
            }).describe('Erro de validação'),
            404: z.object({
                message: z.string().describe('Mensagem de erro'),
                details: z.string().describe('Detalhes do erro'),
            }).describe('CEP não encontrado'),
        }
      },
      attachValidation: true,
    }, cepController.getByCep.bind(cepController));
}