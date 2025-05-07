import { FastifyReply, FastifyRequest } from "fastify";
import { CepService } from "../services/cep.service.js";
import { z } from "zod";
import { httpErrors } from "../util/http-errors.js";

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

    async handleRequest(request: FastifyRequest, reply: FastifyReply, callback: (request: FastifyRequest, reply: FastifyReply) => Promise<void>): Promise<FastifyReply> { 
        try {
            await callback(request, reply);
            return reply;
        } catch (error) {
            if (typeof error === 'string') {
                return reply.status(400).send({
                    message: 'Erro de validação',
                    details: error,
                });
            }
            if (!(error instanceof Error)) {
                return reply.status(400).send({
                    message: 'Erro de validação',
                    details: error,
                });
            }
            const errorKey = error.message as keyof typeof httpErrors;
            if (errorKey in httpErrors) {
                const httpError = httpErrors[errorKey];
                return reply.status(httpError.statusCode).send({
                    message: httpError.message,
                    details: httpError.description,
                });
            }

            return reply.status(500).send({
                error: 'Erro interno do servidor',
                details: error,
            });
        }
    }
    /**
     * Método para buscar todos os CEPs.
     * @param {FastifyRequest} request - Requisição do Fastify.
     * @param {FastifyReply} reply - Resposta do Fastify.
     * @returns {Promise<FastifyReply>} - Retorna a resposta com todos os CEPs.
     */
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
        return this.handleRequest(request, reply, async (request, reply) => {
            // Validação de parâmetros da requisição
            const paramsSchema = z.object({
                cep: z.string().describe('CEP'),
            });
            const parsedParams = paramsSchema.safeParse(request.params);
            if (!parsedParams.success) {
                throw new Error('invalid-cep');
            }

            const { cep } = parsedParams.data;

            const result = await this.cepService.getCepByCep(cep);

            return reply.status(200).send(result);
        });
        
    }

    /**
     * Método para definir um CEP como favorito.
     * @param {FastifyRequest} request - Requisição do Fastify.
     * @param {FastifyReply} reply - Resposta do Fastify.
     * @returns {Promise<FastifyReply>} - Retorna a resposta com o status da operação.
     */
    async setFavorite(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
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

        // Validação de corpo da requisição
        const bodySchema = z.object({
            favorite: z.boolean().describe('Favorito'),
        });                                                                                                         
        const parsedBody = bodySchema.safeParse(request.body);
        if (!parsedBody.success) {
            return reply.status(400).send({
                error: 'Corpo da requisição inválido',
                details: parsedBody.error.format(),
            });
        }

        const { cep } = parsedParams.data;
        const { favorite } = parsedBody.data;

        await this.cepService.setFavorite(cep, favorite);
    
        return reply.status(200).send({cep, favorite});
    }
}