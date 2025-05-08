import { CepRepository } from "../repositories/cep.repository.js";
import { v4 as uuid } from 'uuid';
import { validateCep } from "../util/validate-cep.js";

/** 
 * Classe de serviço para gerenciar operações relacionadas a CEPs.
 * 
 * Essa classe é responsável por interagir com o repositório de CEPs, aplicar regras de negócio e realizar operações como buscar todos os CEPs, buscar um CEP específico e criar um novo CEP.
 * 
 * @param {CepRepository} cepRepository - Instância do repositório de CEPs.
 */
export class CepService {
    private cepRepository: CepRepository;

    constructor(cepRepository: CepRepository) {
        this.cepRepository = cepRepository;
    }

    /**
     * Método para buscar todos os CEPs.
     * @returns {Promise<any>}result - Retorna uma lista de todos os CEPs.
     */
    async getAll(): Promise<any> {
        const result = await this.cepRepository.getAll();
        return result;
    }

    /**
     * Método para buscar informações de um CEP específico.
     * @param {string} cep - O CEP a ser buscado.
     * @returns {Promise<any>} result - Retorna as informações do CEP.
     */
    async getCepByCep(cep: string): Promise<any> {
        // Validação do CEP
        validateCep(cep);

        // Verifica se o CEP já existe no banco de dados
        const existingCep = await this.cepRepository.getCepByCep(cep);
        if (existingCep) {
            return existingCep;
        }

        // Buscar CEP na API externa
        const formattedCep = cep.replace('-', '');
        const response = await fetch(`https://viacep.com.br/ws/${formattedCep}/json/`);
        const data = await response.json();

        // Verificar se a API retornou erro
        if (data.erro) {
            throw new Error('cep-not-found');
        }

        const result = await this.cepRepository.createCep(formattedCep, {
            cep: data.cep,
            logradouro: data.logradouro,
            complemento: data.complemento,
            bairro: data.bairro,
            localidade: data.localidade,
            uf: data.uf,
            ibge: data.ibge,
            gia: data.gia,
            ddd: data.ddd,
            siafi: data.siafi,
            estado: data.estado,
            regiao: data.uf,
        });

        return result;
    }

    /**
     * Método para definir o favoritismo de um CEP.
     * @param cep CEP a ser definido como favorito
     * @param favorite Valor booleano indicando se o CEP é favorito ou nâo
     */
    async setFavorite(cep: string, favorite: boolean): Promise<void> {
        // Validação do CEP
        validateCep(cep);

        // Verifica se o CEP já existe no banco de dados
        const existingCep = await this.cepRepository.getCepByCep(cep);
        if (!existingCep) {
            throw new Error('CEP não encontrado na base de dados');
        }
        
        await this.cepRepository.setFavorite(cep, favorite);

        return;
    }

    /**
     * Método para atualiar o Bairro ou Logradouro de um CEP.
     * @param {string} cep - O CEP a ser atualizado.
     * @param {any} data - Os dados do CEP a serem atualizados.
     */
    async patch(cep: string, data: { bairro?: string | undefined, logradouro?: string | undefined }): Promise<void> {
        // Validação do CEP
        validateCep(cep);

        // Verifica se possui algum dos dois dados
        if (!(data.bairro || data.logradouro)) {
            throw Error('no-data-to-update')
        }

        const result = await this.cepRepository.patchCep(cep, data)

        // Verifica se o cep foi atualizado com sucesso
        if (!result) {
            throw Error('cep-not-found')
        }

        return;
    }
}