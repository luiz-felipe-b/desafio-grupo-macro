import { FastifyInstance } from "fastify";
import { z } from "zod";
import { cepGetCep } from "../../routes/cep.get.cep.js";
import { cepGet } from "../../routes/cep.get.js";
import { cepPostFavorite } from "../../routes/cep.post.favorite.js";
import { cepPatch } from "../../routes/cep.patch.js";

/**
 * Registra as rotas da aplicação.
 * @param app - Instância da aplicação
 * @returns Instância da aplicação com as rotas registradas
 */
export const appRoutes = async (app: FastifyInstance): Promise<FastifyInstance> => {
    app.get('/health', {
        schema: {
            description: "Checar saúde da aplicação.",
            tags: ['app'],
            response: {
                200: z.object({
                    status: z.string().default('OK')
                }).describe('A aplicação está com a saúde estável.'),
            }
        }
    }, async () => {
        return { status: 'OK' };
    });

    app.register(cepGetCep);
    app.register(cepGet);
    app.register(cepPostFavorite);
    app.register(cepPatch);

    return app
}