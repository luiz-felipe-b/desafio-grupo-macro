import { vi } from 'vitest';

// Mock das variáveis de ambiente para testes
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.PORT = '3000';
process.env.SWAGGER_ROUTE = '/docs';
process.env.NODE_ENV = 'test';

// Impedir que o process.exit seja chamado em testes
vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
  console.log(`Mocked process.exit called with code: ${code}`);
  return undefined as never;
}) as any);

// Mock global do fetch
global.fetch = vi.fn();

// Outras configurações globais para testes podem ser adicionadas aqui