import { CepRepository } from "../repositories/cep.repository.js";

export class CepService {
    private cepRepository: CepRepository;

    constructor(cepRepository: CepRepository) {
        this.cepRepository = cepRepository;
    }

    async getByCep(cep: string) {

        const result = await this.cepRepository.getCepByCep(cep);

        return result;
    }
}