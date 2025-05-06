export class PostalRepository {
    async getPostalCode(postalCode: string) {
        const postalData = {
            code: postalCode,
            city: 'São Paulo',
            state: 'SP',
            neighborhood: 'Centro',
            street: 'Avenida Paulista',
        };

        return postalData;
    }
}