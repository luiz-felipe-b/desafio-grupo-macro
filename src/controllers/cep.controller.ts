import { FastifyReply, FastifyRequest } from "fastify";
import { CepService } from "../services/cep.service.js";
import { z } from "zod";

/**
 * Controller para gerenciar as requisições relacionadas a CEPs.
 * 
 * O Controller é responsável por receber as requisições, validar os dados e chamar o serviço apropriado.
 * @param postalService Instância do serviço de CEPs.
 */
export class CepController {
    /**
     * Instância do serviço de CEPs.
     * @type {CepService}
     */
    private cepService: CepService;

    constructor(cepService: CepService) {
        this.cepService = cepService;
    }

    async getAll(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const result = await this.cepService.getAll();
        return reply.status(200).send(result);
    }

    /**
     * Método para buscar informações de um CEP.
     * @param {FastifyRequest} request - Requisição do Fastify.
     * @param {FastifyReply} reply - Resposta do Fastify.
     * @returns {Promise<FastifyReply>} - Retorna a resposta com as informações do CEP.
     */
    async getByCep(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        // Validação de parâmetros da requisição
        const paramsSchema = z.object({
            cep: z.string().describe('CEP'),
        });
        const parsedParams = paramsSchema.safeParse(request.params);
        if (!parsedParams.success) {
            return reply.status(400).send({
                error: 'CEP Inválido',
                details: parsedParams.error.format(),
            });
        }

        const { cep } = parsedParams.data;

        const result = await this.cepService.getCepByCep(cep);
    
        return reply.status(200).send(result);
    }
}