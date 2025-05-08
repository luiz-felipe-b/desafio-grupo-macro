export const httpErrors = {
    'cep-not-found': {
        statusCode: 404,
        message: 'CEP não encontrado',
        description: 'O CEP informado não foi encontrado na base de dados.',
    },
    'invalid-cep': {
        statusCode: 400,
        message: 'CEP inválido',
        description: 'O CEP informado não é válido.',
    },
    'need-to-format-cep': {
        statusCode: 400,
        message: 'CEP precisa ser formatado',
        description: 'O CEP informado precisa ser formatado com o traço (-).',
    },
    'needs-nine-digits': {
        statusCode: 400,
        message: 'CEP precisa ter 9 dígitos',
        description: 'O CEP informado precisa ter 9 dígitos.',
    },
    'no-data-to-update': {
        statusCode: 400,
        message: 'Nâo existem dados para atualizar',
        description: 'Nenhum dado que necessita ou pode ser atualizado foi fornecido.'
    },
    'invalid-cep-patch-body': {
        statusCode: 400,
        message: 'O corpo da requisição não é válido',
        description: 'O corpo da requisição nâo pode ser usado para atualizar os dados.'
    }
}