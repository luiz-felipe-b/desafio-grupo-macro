import { FastifyInstance } from "fastify";
import { env } from "./config/env/env.js";
import { appSetup } from "./config/app/app.setup.js";
import { appRoutes } from "./config/app/app.routes.js";

/**
 * Inicia a aplicação e a coloca para rodar
 * @param app Instância da aplicação
 */
export const start = async (app: FastifyInstance) => {
    const setupApp = await appSetup(app)

    const routedApp = await appRoutes(setupApp);

    const finalApp = routedApp;

    finalApp.listen({
      port: env.PORT,
      host: '0.0.0.0'
    }).then(() => {
      console.log('🐕 Server is listening!');
    }).catch((err) => {
      finalApp.log.error(err);
      process.exit(1);
    });
  };
  