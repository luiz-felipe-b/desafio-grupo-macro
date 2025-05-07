import { CepRepository } from "../repositories/cep.repository.js";
import { v4 as uuid } from 'uuid';

export class CepService {
    private cepRepository: CepRepository;

    constructor(cepRepository: CepRepository) {
        this.cepRepository = cepRepository;
    }

    async getAll() {
        const result = await this.cepRepository.getAll();
        return result;
    }

    async getCepByCep(cep: string) {
        // Validação do CEP
        const cepRegex = /^[0-9]{5}-?[0-9]{3}$/;
        if (!cepRegex.test(cep)) {
            throw new Error('CEP inválido');
        }

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
            throw new Error('CEP não encontrado na base de dados externa');
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
        console.log('result', result);

        return result;

        // // Salvar o CEP no banco de dados
        // await this.cepRepository.saveCep({
        //     cep: data.cep,
        //     logradouro: data.logradouro,
        //     complemento: data.complemento,
        //     bairro: data.bairro,
        //     localidade: data.localidade,
        //     uf: data.uf,
        //     ibge: data.ibge,
        //     gia: data.gia,
        //     ddd: data.ddd,
        //     siafi: data.siafi
        // });
    }
}