import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CepRepository } from '../../repositories/cep.repository.js';
import { eq } from 'drizzle-orm';
import * as uuid from 'uuid';

// Mock do módulo uuid
vi.mock('uuid', () => ({
    v4: vi.fn().mockReturnValue('mocked-uuid')
}));

// Mock do módulo db atualizado para corresponder à implementação do repositório
vi.mock('../../config/db/connection.js', () => {
    return {
        db: {
            select: vi.fn(() => ({
                from: vi.fn(() => ({
                    where: vi.fn(() => {
                        const result: any[] = [];
                        return result;
                    })
                }))
            })),
            insert: vi.fn(() => ({
                values: vi.fn(() => ({
                    returning: vi.fn(() => [])
                }))
            })),
            update: vi.fn(() => ({
                set: vi.fn(() => ({
                    where: vi.fn(() => ({
                        returning: vi.fn(() => [])
                    }))
                }))
            }))
        }
    };
});

// Mock do eq do drizzle-orm
vi.mock('drizzle-orm', async (importOriginal) => {
    const actual = await importOriginal() || {};
    return {
        ...actual,
        eq: vi.fn().mockImplementation((field, value) => ({ field, value, operator: 'eq' }))
    };
});

describe('CepRepository', () => {
    let cepRepository: CepRepository;
    let mockDb: any;

    beforeEach(async () => {
        vi.clearAllMocks();
        cepRepository = new CepRepository();
        const connection = await import('../../config/db/db.connection.js');
        mockDb = connection.db;
    });

    describe('getCepByCep', () => {
        it('should return a CEP when it exists', async () => {
            const mockCep = {
                id: '123e4567-e89b-12d3-a456-426614174000',
                favorito: false,
                cep: '12345-678',
            };

            // Configure mock to return an array with the CEP
            const whereMock = vi.fn().mockReturnValue([mockCep]);
            const fromMock = vi.fn().mockReturnValue({ where: whereMock });
            mockDb.select = vi.fn().mockReturnValue({ from: fromMock });

            const result = await cepRepository.getCepByCep('12345-678');

            expect(mockDb.select).toHaveBeenCalled();
            expect(fromMock).toHaveBeenCalled();
            expect(whereMock).toHaveBeenCalled();
            expect(eq).toHaveBeenCalled();
            expect(result).toEqual(mockCep);
        });

        it('should return undefined when CEP does not exist', async () => {
            // Configure mock to return an empty array
            const whereMock = vi.fn().mockReturnValue([]);
            const fromMock = vi.fn().mockReturnValue({ where: whereMock });
            mockDb.select = vi.fn().mockReturnValue({ from: fromMock });

            const result = await cepRepository.getCepByCep('12345-678');

            expect(result).toBeUndefined();
        });
    });

    describe('createCep', () => {
        it('should create a new CEP entry', async () => {
            const mockCep = {
                id: 'mocked-uuid',
                favorito: false,
                cep: '12345-678',
                // ... outros campos
            };

            // Configure mock to return an array with the created CEP
            const returningMock = vi.fn().mockReturnValue([mockCep]);
            const valuesMock = vi.fn().mockReturnValue({ returning: returningMock });
            mockDb.insert = vi.fn().mockReturnValue({ values: valuesMock });

            const formattedCep = '12345678';
            const cepData = {
                cep: '12345-678',
                logradouro: 'Rua Teste',
                bairro: 'Bairro Teste',
                localidade: 'Cidade Teste',
                uf: 'SP',
                estado: 'São Paulo',
                regiao: 'Sudeste',
                complemento: '',
                ibge: '123456',
                gia: '',
                ddd: '11',
                siafi: '7107'
            };

            const result = await cepRepository.createCep(formattedCep, cepData);

            expect(mockDb.insert).toHaveBeenCalled();
            expect(valuesMock).toHaveBeenCalled();
            expect(returningMock).toHaveBeenCalled();
            expect(result).toEqual(mockCep);
        });
    });

    describe('setFavorite', () => {
        it('should update the favorite status of a CEP', async () => {
            const updatedCep = {
                id: '123e4567-e89b-12d3-a456-426614174000',
                favorito: true,
                cep: '12345-678',
            };

            // Configure mock to return an array with the updated CEP
            const returningMock = vi.fn().mockReturnValue([updatedCep]);
            const whereMock = vi.fn().mockReturnValue({ returning: returningMock });
            const setMock = vi.fn().mockReturnValue({ where: whereMock });
            mockDb.update = vi.fn().mockReturnValue({ set: setMock });

            const result = await cepRepository.setFavorite('12345-678', true);

            expect(mockDb.update).toHaveBeenCalled();
            expect(setMock).toHaveBeenCalledWith({ favorito: true });
            expect(whereMock).toHaveBeenCalled();
            expect(eq).toHaveBeenCalled();
            expect(returningMock).toHaveBeenCalled();
            expect(result).toEqual(updatedCep);
        });
    });

    describe('updateCep', () => {
        it('should update CEP data fields', async () => {
            const updatedCep = {
                id: '123e4567-e89b-12d3-a456-426614174000',
                bairro: 'Novo Bairro',
                logradouro: 'Nova Rua',
                cep: '12345-678',
            };

            // Configure mock to return an array with the updated CEP
            const returningMock = vi.fn().mockReturnValue([updatedCep]);
            const whereMock = vi.fn().mockReturnValue({ returning: returningMock });
            const setMock = vi.fn().mockReturnValue({ where: whereMock });
            mockDb.update = vi.fn().mockReturnValue({ set: setMock });

            const updateData = {
                bairro: 'Novo Bairro',
                logradouro: 'Nova Rua'
            };

            const result = await cepRepository.patchCep('12345-678', updateData);

            expect(mockDb.update).toHaveBeenCalled();
            expect(setMock).toHaveBeenCalledWith(updateData);
            expect(whereMock).toHaveBeenCalled();
            expect(eq).toHaveBeenCalled();
            expect(returningMock).toHaveBeenCalled();
            expect(result).toEqual(updatedCep);
        });
    });

    describe('getAll', () => {
        it('should return all CEPs', async () => {
            const mockCeps = [
                { id: '1', cep: '12345-678' },
                { id: '2', cep: '98765-432' }
            ];

            // Correctly configure the mock chain
            const fromMock = vi.fn().mockReturnValue(mockCeps);
            mockDb.select = vi.fn().mockReturnValue({ from: fromMock });

            const result = await cepRepository.getAll();

            expect(mockDb.select).toHaveBeenCalled();
            expect(fromMock).toHaveBeenCalled();
            expect(result).toEqual(mockCeps);
        });
    });
});