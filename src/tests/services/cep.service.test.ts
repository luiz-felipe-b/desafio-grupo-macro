import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CepService } from '../../services/cep.service.js';
import { CepRepository } from '../../repositories/cep.repository.js';

// Mock do CepRepository
vi.mock('../../repositories/cep.repository.js', () => {
  return {
    CepRepository: vi.fn().mockImplementation(() => ({
      getCepByCep: vi.fn(),
      createCep: vi.fn(),
      setFavorite: vi.fn(),
      getAll: vi.fn(),
      patchCep: vi.fn()
    }))
  };
});

// Mock do fetch global
global.fetch = vi.fn();

// Mock the repository methods
vi.mock('../../repositories/cep.repository', () => ({
  CepRepository: vi.fn().mockImplementation(() => ({
    getCepByCep: vi.fn(),
    createCep: vi.fn(),
    setFavorite: vi.fn(),
    patchCep: vi.fn(),
    getAll: vi.fn()
  }))
}));

// Setup global fetch mock
vi.stubGlobal('fetch', vi.fn());

describe('CepService', () => {
  let cepService: CepService;
  let cepRepository: CepRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    cepRepository = new CepRepository();
    cepService = new CepService(cepRepository);
  });

  describe('getCepByCep', () => {
    it('should return an existing CEP from repository if it exists', async () => {
      const mockCep = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        favorito: false,
        cep: '12345-678',
        logradouro: 'Rua Teste',
        complemento: '',
        bairro: 'Bairro Teste',
        localidade: 'Cidade Teste',
        unidade: null,
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

      vi.mocked(cepRepository.getCepByCep).mockResolvedValueOnce(mockCep);

      const result = await cepService.getCepByCep('12345-678');
      
      expect(cepRepository.getCepByCep).toHaveBeenCalledWith('12345-678');
      expect(result).toEqual(mockCep);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should fetch CEP data from external API if not in repository', async () => {
      const mockApiResponse = {
        cep: '12345-678',
        logradouro: 'Rua API',
        complemento: '',
        bairro: 'Bairro API',
        localidade: 'Cidade API',
        uf: 'RJ',
        ibge: '123456',
        gia: '',
        ddd: '21',
        siafi: '7107'
      };

      const mockCreatedCep = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        favorito: false,
        ...mockApiResponse,
        unidade: null, // Add the missing property
        estado: 'Rio de Janeiro',
        regiao: 'RJ',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Mock repository para retornar que o CEP não existe
      vi.mocked(cepRepository.getCepByCep).mockResolvedValueOnce(null);

      // Mock da API externa
      global.fetch = vi.fn().mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce(mockApiResponse)
      } as unknown as Response);

      // Mock da criação do CEP
      vi.mocked(cepRepository.createCep).mockResolvedValueOnce(mockCreatedCep);

      const result = await cepService.getCepByCep('12345-678');

      expect(cepRepository.getCepByCep).toHaveBeenCalledWith('12345-678');
      expect(global.fetch).toHaveBeenCalledWith('https://viacep.com.br/ws/12345678/json/');
      expect(cepRepository.createCep).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedCep);
    });

    it('should throw error when CEP not found in API', async () => {
      // Mock repository para retornar que o CEP não existe
      vi.mocked(cepRepository.getCepByCep).mockResolvedValueOnce(null);

      // Mock da API externa retornando erro
      global.fetch = vi.fn().mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce({ erro: true })
      } as unknown as Response);

      await expect(cepService.getCepByCep('12345-678')).rejects.toThrow('cep-not-found');
    });
  });

  describe('setFavorite', () => {
    it('should set a CEP as favorite', async () => {
      const mockCep = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        favorito: false,
        cep: '12345-678',
        logradouro: 'Rua Teste',
        complemento: '',
        unidade: null,
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

      vi.mocked(cepRepository.getCepByCep).mockResolvedValueOnce(mockCep);
      vi.mocked(cepRepository.setFavorite).mockResolvedValueOnce({
        rowCount: 1,
        rows: [],
        command: 'UPDATE',
        oid: null,
        fields: []
      } as any);

      await cepService.setFavorite('12345-678', true);

      expect(cepRepository.getCepByCep).toHaveBeenCalledWith('12345-678');
      expect(cepRepository.setFavorite).toHaveBeenCalledWith('12345-678', true);
    });

    it('should throw error when CEP does not exist', async () => {
      vi.mocked(cepRepository.getCepByCep).mockResolvedValueOnce(null);

      await expect(cepService.setFavorite('12345-678', true)).rejects.toThrow('CEP não encontrado na base de dados');
      expect(cepRepository.setFavorite).not.toHaveBeenCalled();
    });
  });

  describe('patch', () => {
    it('should update bairro and logradouro of an existing CEP', async () => {
      const updateData = {
        bairro: 'Novo Bairro',
        logradouro: 'Nova Rua'
      };

      // Mock retorno bem sucedido para patchCep
      const mockPatchedCep = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        favorito: false,
        cep: '12345-678',
        logradouro: 'Nova Rua',
        complemento: '',
        unidade: null,
        bairro: 'Novo Bairro',
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
      
      vi.mocked(cepRepository.patchCep).mockResolvedValueOnce(mockPatchedCep);

      await cepService.patch('12345-678', updateData);

      // A implementação atual não verifica se o CEP existe antes de atualizar
      expect(cepRepository.patchCep).toHaveBeenCalledWith('12345-678', updateData);
    });
    
    it('should throw error when update fails', async () => {
      // Mock retorno falho para updateCep (valor falsy)
      vi.mocked(cepRepository.patchCep).mockResolvedValueOnce(null);

      await expect(cepService.patch('12345-678', { bairro: 'Novo Bairro' }))
        .rejects.toThrow('cep-not-found');
    });
  });

  describe('getAll', () => {
    it('should return all CEPs', async () => {
      const mockCeps = [
        { 
          id: '1', 
          favorito: false,
          cep: '12345-678',
          logradouro: 'Rua Teste 1',
          complemento: '',
          unidade: null,
          bairro: 'Bairro Teste 1',
          localidade: 'Cidade Teste 1',
          uf: 'SP',
          estado: 'São Paulo',
          regiao: 'Sudeste',
          ibge: '123456',
          gia: '',
          ddd: '11',
          siafi: '7107',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          id: '2', 
          favorito: true,
          cep: '98765-432',
          logradouro: 'Rua Teste 2',
          complemento: '',
          unidade: null,
          bairro: 'Bairro Teste 2',
          localidade: 'Cidade Teste 2',
          uf: 'RJ',
          estado: 'Rio de Janeiro',
          regiao: 'Sudeste',
          ibge: '654321',
          gia: '',
          ddd: '21',
          siafi: '7108',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      vi.mocked(cepRepository.getAll).mockResolvedValueOnce(mockCeps);

      const result = await cepService.getAll();

      expect(cepRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockCeps);
    });
  });
});