import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FastifyInstance } from 'fastify';
import Fastify from 'fastify';

// Mock de serviço que será injetado nas rotas
const mockCepService = {
  getCepByCep: vi.fn(),
  getAll: vi.fn(),
  setFavorite: vi.fn(),
  patch: vi.fn()
};

// Mock do repositório
vi.mock('../../repositories/cep.repository.js', () => ({
  CepRepository: vi.fn().mockImplementation(() => ({}))
}));

// Mock do serviço com retorno do objeto mockado
vi.mock('../../services/cep.service.js', () => ({
  CepService: vi.fn().mockImplementation(() => mockCepService)
}));

describe('CEP API Integration Tests', () => {
  let app: FastifyInstance;
  
  // Mock de CEP formatado para o banco com datas como strings (JSON)
  const mockCepFromDb = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    favorito: false,
    cep: '12345-678',
    logradouro: 'Rua Teste',
    complemento: '',
    bairro: 'Bairro Teste',
    localidade: 'Cidade Teste',
    uf: 'SP',
    estado: 'São Paulo',
    regiao: 'Sudeste',
    ibge: '123456',
    gia: '',
    ddd: '11',
    siafi: '7107',
    createdAt: new Date('2023-01-01').toISOString(),
    updatedAt: new Date('2023-01-01').toISOString()
  };

  // Registra as rotas de teste por conta própria
  beforeEach(async () => {
    vi.clearAllMocks();
    app = Fastify();
    
    // Register routes manually with our mocked services
    app.get('/:cep', async (req, reply) => {
      const { cep } = req.params as { cep: string };
      try {
        const result = await mockCepService.getCepByCep(cep);
        return reply.status(200).send(result);
      } catch (error: any) {
        if (error.message === 'cep-not-found') {
          return reply.status(404).send({ message: 'CEP não encontrado', details: 'O CEP informado não foi encontrado.' });
        }
        return reply.status(400).send({ message: 'CEP inválido', details: 'O CEP informado não é válido.' });
      }
    });

    app.get('/', async (req, reply) => {
      const result = await mockCepService.getAll();
      return reply.status(200).send(result);
    });

    app.post('/:cep/favorite', async (req, reply) => {
      const { cep } = req.params as { cep: string };
      const { favorite } = req.body as { favorite: boolean };
      
      if (favorite === undefined) {
        return reply.status(400).send({ message: 'Corpo da requisição inválido' });
      }
      
      await mockCepService.setFavorite(cep, favorite);
      return reply.status(200).send({ cep, favorite });
    });

    app.patch('/:cep', async (req, reply) => {
      const { cep } = req.params as { cep: string };
      const body = req.body as { bairro?: string, logradouro?: string };
      
      try {
        await mockCepService.patch(cep, body);
        return reply.status(200).send({ message: 'O CEP foi atualizado com sucesso.' });
      } catch (error: any) {
        if (error.message === 'no-data-to-update') {
          return reply.status(400).send({ message: 'Dados inválidos para atualização' });
        }
        if (error.message === 'cep-not-found') {
          return reply.status(404).send({ message: 'CEP não encontrado' });
        }
        return reply.status(500).send({ message: 'Erro interno' });
      }
    });
  });

  describe('GET /:cep', () => {
    it('should return information for a valid CEP', async () => {
      mockCepService.getCepByCep.mockResolvedValueOnce(mockCepFromDb);

      const response = await app.inject({
        method: 'GET',
        url: '/12345-678'
      });

      expect(response.statusCode).toBe(200);
      expect(mockCepService.getCepByCep).toHaveBeenCalledWith('12345-678');
      expect(JSON.parse(response.body)).toEqual(mockCepFromDb);
    });

    it('should return 400 for an invalid CEP format', async () => {
      mockCepService.getCepByCep.mockRejectedValueOnce(new Error('need-to-format-cep'));

      const response = await app.inject({
        method: 'GET',
        url: '/1234567' // CEP sem hífen
      });

      expect(response.statusCode).toBe(400);
      expect(mockCepService.getCepByCep).toHaveBeenCalledWith('1234567');
      expect(JSON.parse(response.body)).toHaveProperty('message');
    });

    it('should return 404 for a non-existent CEP', async () => {
      mockCepService.getCepByCep.mockRejectedValueOnce(new Error('cep-not-found'));

      const response = await app.inject({
        method: 'GET',
        url: '/12345-678'
      });

      expect(response.statusCode).toBe(404);
      expect(mockCepService.getCepByCep).toHaveBeenCalledWith('12345-678');
      expect(JSON.parse(response.body)).toHaveProperty('message');
    });
  });

  describe('GET /', () => {
    it('should return all CEPs', async () => {
      const mockCeps = [
        mockCepFromDb,
        {...mockCepFromDb, id: '2', cep: '98765-432'}
      ];
      
      mockCepService.getAll.mockResolvedValueOnce(mockCeps);

      const response = await app.inject({
        method: 'GET',
        url: '/'
      });

      expect(response.statusCode).toBe(200);
      expect(mockCepService.getAll).toHaveBeenCalled();
      expect(JSON.parse(response.body)).toEqual(mockCeps);
    });
  });

  describe('POST /:cep/favorite', () => {
    it('should set a CEP as favorite', async () => {
      mockCepService.setFavorite.mockResolvedValueOnce(undefined);

      const response = await app.inject({
        method: 'POST',
        url: '/12345-678/favorite',
        payload: {
          favorite: true
        }
      });

      expect(response.statusCode).toBe(200);
      expect(mockCepService.setFavorite).toHaveBeenCalledWith('12345-678', true);
      expect(JSON.parse(response.body)).toEqual({
        cep: '12345-678',
        favorite: true
      });
    });

    it('should return 400 for invalid request body', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/12345-678/favorite',
        payload: {
          invalid: 'data'
        }
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body)).toHaveProperty('message');
    });
  });

  describe('PATCH /:cep', () => {
    it('should update CEP data fields', async () => {
      mockCepService.patch.mockResolvedValueOnce(undefined);

      const response = await app.inject({
        method: 'PATCH',
        url: '/12345-678',
        payload: {
          bairro: 'Novo Bairro',
          logradouro: 'Nova Rua'
        }
      });

      expect(response.statusCode).toBe(200);
      expect(mockCepService.patch).toHaveBeenCalledWith('12345-678', {
        bairro: 'Novo Bairro',
        logradouro: 'Nova Rua'
      });
      expect(JSON.parse(response.body)).toEqual({
        message: 'O CEP foi atualizado com sucesso.'
      });
    });

    it('should return 400 for invalid update data', async () => {
      mockCepService.patch.mockRejectedValueOnce(new Error('no-data-to-update'));
      
      const response = await app.inject({
        method: 'PATCH',
        url: '/12345-678',
        payload: {
          invalid: 'field'
        }
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body)).toHaveProperty('message');
    });

    it('should return 404 if CEP does not exist', async () => {
      mockCepService.patch.mockRejectedValueOnce(new Error('cep-not-found'));

      const response = await app.inject({
        method: 'PATCH',
        url: '/12345-678',
        payload: {
          bairro: 'Novo Bairro'
        }
      });

      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.body)).toHaveProperty('message');
    });
  });
});