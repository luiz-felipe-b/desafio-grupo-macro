import { PostalRepository } from "../repositories/postal.repository.js";

export class PostalService {
    private postalRepository: PostalRepository;

    constructor(postalRepository: PostalRepository) {
        this.postalRepository = postalRepository;
    }

    async getPostalCode(postalCode: string) {

        const result = await this.postalRepository.getPostalCode(postalCode);

        return result;
    }
}