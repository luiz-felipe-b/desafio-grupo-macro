import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CepController } from '../../controllers/cep.controller.js';
import { CepService } from '../../services/cep.service.js';
import { FastifyReply, FastifyRequest } from 'fastify';

// Mock do CepService
vi.mock('../../services/cep.service.js', () => {
  return {
    CepService: vi.fn().mockImplementation(() => ({
      getCepByCep: vi.fn(),
      getAll: vi.fn(),
      setFavorite: vi.fn(),
      patch: vi.fn(),
    }))
  };
});

describe('CepController', () => {
  let cepController: CepController;
  let cepService: CepService;
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;

  beforeEach(() => {
    vi.clearAllMocks();
    cepService = new CepService({} as any);
    cepController = new CepController(cepService);

    // Mock de request e reply do Fastify
    mockRequest = {
      params: {},
      body: {}
    };

    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
  });

  describe('getByCep', () => {
    it('should return CEP data when valid CEP is provided', async () => {
      const mockCep = {
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
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRequest.params = { cep: '12345-678' };
      vi.mocked(cepService.getCepByCep).mockResolvedValueOnce(mockCep);

      await cepController.getByCep(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(cepService.getCepByCep).toHaveBeenCalledWith('12345-678');
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(mockCep);
    });

    it('should handle error when invalid CEP is provided', async () => {
      mockRequest.params = { invalid: '12345-678' }; // Parâmetro incorreto

      await cepController.getByCep(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(cepService.getCepByCep).not.toHaveBeenCalled();
      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'CEP inválido',
        details: 'O CEP informado não é válido.'
      });
    });

    it('should handle service errors appropriately', async () => {
      mockRequest.params = { cep: '12345-678' };
      vi.mocked(cepService.getCepByCep).mockRejectedValueOnce(new Error('cep-not-found'));

      await cepController.getByCep(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(cepService.getCepByCep).toHaveBeenCalledWith('12345-678');
      expect(mockReply.status).toHaveBeenCalled();
      expect(mockReply.send).toHaveBeenCalled();
    });
  });

  describe('setFavorite', () => {
    it('should mark CEP as favorite when valid data is provided', async () => {
      mockRequest.params = { cep: '12345-678' };
      mockRequest.body = { favorite: true };

      await cepController.setFavorite(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(cepService.setFavorite).toHaveBeenCalledWith('12345-678', true);
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({ cep: '12345-678', favorite: true });
    });

    it('should handle invalid body', async () => {
      mockRequest.params = { cep: '12345-678' };
      mockRequest.body = { invalid: true }; // Propriedade incorreta

      await cepController.setFavorite(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(cepService.setFavorite).not.toHaveBeenCalled();
      expect(mockReply.status).toHaveBeenCalled();
      expect(mockReply.send).toHaveBeenCalled();
    });
  });

  describe('patch', () => {
    it('should update CEP data when valid params and body are provided', async () => {
      mockRequest.params = { cep: '12345-678' };
      mockRequest.body = { 
        bairro: 'Novo Bairro',
        logradouro: 'Nova Rua' 
      };

      await cepController.patch(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(cepService.patch).toHaveBeenCalledWith('12345-678', {
        bairro: 'Novo Bairro',
        logradouro: 'Nova Rua'
      });
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "O CEP foi atualizado com sucesso."
      });
    });

    it('should handle invalid body', async () => {
      mockRequest.params = { cep: '12345-678' };
      // Deixar o corpo vazio para que falhe na validação
      mockRequest.body = {};

      // O serviço vai rejeitar com erro específico
      vi.mocked(cepService.patch).mockRejectedValueOnce(new Error('no-data-to-update'));

      await cepController.patch(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(cepService.patch).toHaveBeenCalled();
      expect(mockReply.status).toHaveBeenCalled();
      expect(mockReply.send).toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('should return all CEPs', async () => {
      const mockCeps = [
        { id: '1', cep: '12345-678' },
        { id: '2', cep: '98765-432' }
      ];

      vi.mocked(cepService.getAll).mockResolvedValueOnce(mockCeps);

      await cepController.getAll(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(cepService.getAll).toHaveBeenCalled();
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(mockCeps);
    });
  });
});