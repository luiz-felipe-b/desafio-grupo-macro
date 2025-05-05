import { FastifyInstance } from "fastify";
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { validatorCompiler, serializerCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import { env } from "../env/env.js";

/**
 * Faz o setup inicial da aplicacao com coisas como Swagger, Zod, entre outros.
 * @param app Instância da aplicação
 * @returns Instância da aplicação com as configurações
 */
export const appSetup = async (app: FastifyInstance): Promise<FastifyInstance> => {
    
    // Modifica os compiladores de validação e serialização para podermos utilizar com o Zod
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    // Registra o Swagger e o configura para utilizar o Zod
    app.register(swagger, {
        openapi: {
            info: {
            title: 'Desafio Técnico Grupo Macro',
            version: '1.0.0',
            },
            tags: [
              { name: 'app', description: 'Endpoints relacionados à aplicação em si.'}
            ]
        },
        transform: jsonSchemaTransform
    });

    // Configura o Swagger UI para aparecer na rota especificada na env
    app.register(swaggerUi, {
      routePrefix: env.SWAGGER_ROUTE,
      uiConfig: {
        docExpansion: 'full',
      },
    });

    return app
}