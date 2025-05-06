import { FastifyReply, FastifyRequest } from "fastify";
import { PostalService } from "../services/postal.service.js";
import { z } from "zod";

export class PostalController {
    private postalService: PostalService;

    constructor(postalService: PostalService) {
        this.postalService = postalService;
    }

    async getPostalCode(request: FastifyRequest, reply: FastifyReply) {
        // Validação de parâmetros do endpoint
        // Exemplo: /postal/12345-678
        const paramsSchema = z.object({
            postalCode: z.string().min(5).max(10).regex(/^\d{5}(-\d{3})?$/).describe('Código postal'),
        });
        const parsedParams = paramsSchema.safeParse(request.params);
        if (!parsedParams.success) {
            return reply.status(400).send({
                error: 'Invalid postal code',
                details: parsedParams.error.format(),
            });
        }
        // Extraindo o código postal dos parâmetros caso seja válido
        const { postalCode } = parsedParams.data;

        const result = await this.postalService.getPostalCode(postalCode);
    
        return reply.status(200).send(result);
    }
}