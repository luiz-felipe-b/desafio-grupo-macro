import { defineConfig } from 'drizzle-kit';
import { env } from './src/config/env/env.js';

export default defineConfig({
  schema: './src/config/db/db.schemas.ts',
  out: './drizzle',
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});