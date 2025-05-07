import { z } from 'zod';
import { printErrors } from '../../util/print-errors.js';
import { envSchema } from './env.schema.js';

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('\n❌ Variáveis de ambiente inválidas:');
  
  const fieldErrors = parsedEnv.error.format();

  printErrors(fieldErrors);

  console.error('\nChecar as variáveis do .env e depois, reiniciar a aplicação.\n');
  process.exit(1);
}

export const env = parsedEnv.data;