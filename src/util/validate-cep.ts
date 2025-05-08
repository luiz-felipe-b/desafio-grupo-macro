/**
 * Função para validar um CEP.
 * @param {string} cep CEP a ser validado
 * @returns {boolean} Retorna true se o CEP for válido
 */
export const validateCep = (cep: string): boolean => {
    const cepRegex = /^[0-9]{5}-?[0-9]{3}$/;

    // Verifica se o CEP está no formato correto
    if (!cep.includes('-')) {
        throw new Error('need-to-format-cep');
    }

    // Verifica se o CEP tem 8 dígitos
    if (cep.length !== 9) {
        throw new Error('needs-nine-digits');
    }

    // Verifica se o CEP é um número válido
    if (!cepRegex.test(cep)) {
        throw new Error('invalid-cep');
    }

    return true;
}