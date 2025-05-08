# DESAFIO GRUPO MACRO 2025

Esse é o meu projeto para o desafio da vaga de desenvolvedor full-stack no Grupo Macro.

## FERRAMENTAS UTILIZADAS
O projeto foi feito seguindo os requisitos definidos no pdf de briefing.

#### Tecnologias:
- Node.js com Typescript.
- Fastify como framework web.
- Drizzle ORM para interações com o banco de dados.
- Zod para validação dos dados.
- Vitest para a realização de testes unitários.
- Swagger e Swagger UI para documentação e implementação da interface de interação com a API.
- Docker para conteinerização de serviços externos.
- Postgres como banco de dados relacional (conteinerizado).
- PgAdmin 4 para interação direta com a base de dados (conteinerizado). 

## COMO RODAR O PROJETO
Primeiramente, clone o repositório do github para a sua máquina local utilizando:
```
git clone https://github.com/luiz-felipe-b/desafio-grupo-macro.git .
```
Depois, certifique-se que o ```pnpm``` está instalado, ele é um gerenciador de pacotes similar ao ```npm```.
Você pode instalá-lo com o próprio npm usando o seguinte comando:
```
npm install -g pnpm@latest-10
```
E também instale o Docker. Ele pode ser instalado no seguinte link: https://www.docker.com/

Com essas ferramentas instaladas, devemos criar um arquivo ```.env```, assim que criado, preencha-o com as variáveis de ambiente que, por segurança, foram enviadas por e-mail juntos com o link deste repositório.

Com as variáveis de ambiente preenchidas, devemos iniciar nossos serviços docker com o comando:
```
docker compose up -d
```
Na porta 5050 terá uma instância do pgAdmin em execução, essa instância terá acesso direto ao banco de dados Postgres que também estará em execução.

Para acessar o painel do pgAdmin, você deve usar as credenciais presentes no próprio arquivo ```docker-compose.yaml``` para fazer login e depois as credenciais do banco de dados que estão no mesmo arquivo para se conectar ao banco.

Depois instalamos as dependências do projeto:
```
pnpm i
```

Com os serviços Docker em execução e as dependências instaladas, podemos popular o banco de dados com o comando:
```
pnpm db-init
```
Esse script migra as schemas do Drizzle ORM para o banco de dados Postgres e depois o popula com os dados indicados no pdf de briefing.

Com todas essas configurações, podemos rodar o projeto com:
```
pnpm dev
```
A aplicação agora pode ser acessada na porta 3000 do host local.

Com o projeto rodando, já podemos interagir com a API, temos duas formas de fazer isso:

- Utilizando um cliente HTTP como o Postman
- **Utilizar a UI interativa no endpoint /api/docs**

É recomendado usar a UI interativa pela facilidade de interação.

Na API, temos 4 endpoints, correspondentes com os requisitos descritos no pdf de briefing.

- *GET* **/api/{cep}**
 
  Recebe um CEP e retorna informações daquele CEP específico.

- *PATCH* **/api/{cep}**
 
  Atualiza o bairro e logradouro de um CEP.

- *GET* **/api/**
 
  Obtém todos os CEPs registrados no banco de dados.

- *POST* **/api/{cep}/favorite**
 
  Recebe um CEP e o marca ou desmarca como favorito de acordo com o que foi passado na payload.

- *GET* **/api/health**
 
  Checa o status da aplicação.

Foi usada uma simples arquitetura de camadas para receber, gerenciar e tratar as requisições enviadas aos endpoints com um esquema de:

Route -> Controller -> Service -> Repository

Route é responsável por definir as rotas de fato, e é representada pelo diretório ```routes```.

Controller é responsável por capturar as requisições e validar se elas tem o formato esperado, representado pelo diretório ```controllers```.

Service é responsável por manter as regras de negócio da aplicação, validando dados, aplicando formatações e entre outros. Indicado pelo diretório ```services```.

Repository é responsável pela interação com o banco de dados, exclusivamente. Está no diretório ```repositories```.

Também exitem testes unitários na aplicação, esses podem ser executados com o script:

```
pnpm test
```

Quando terminar de interagir com a aplicação, é só apertar ```CTRL + C``` no terminal onde a aplicação está presente e depois desligar os serviços do Docker com ```docker compose down -v```.

Muito obrigado pelo tempo dedicado para ler essa documentação!