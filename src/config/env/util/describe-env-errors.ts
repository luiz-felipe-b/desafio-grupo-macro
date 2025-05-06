import { z } from "zod";
import { Env } from "../env.schema.js";

/**
 * Recebe os erros de env da validação do Zod e printa uma resposta no terminal
 * @param fieldErrors 
 */
export const describeEnvErrors = (fieldErrors: z.ZodFormattedError<Env, string>) => {
    Object.entries(fieldErrors).forEach(([field, errors]) => {
        // Se o campo _erros estiver vazio, pula
        if (field === '_errors' && Array.isArray(errors) && errors.length === 0) {
          return;
        }
        
        // Aborda erros específicos das envs
        if (typeof errors === 'object' && '_errors' in errors) {
          const fieldSpecificErrors = errors._errors;
          if (fieldSpecificErrors.length > 0) {
            console.error(`\n  ${field}:`);
            fieldSpecificErrors.forEach(error => {
              console.error(`    - ${error}`);
            });
          }
        } else if (Array.isArray(errors) && errors.length > 0) {
          console.error(`\n  ${field}:`);
          errors.forEach(error => {
            console.error(`    - ${error}`);
          });
        }
      });
}