# Refund API

API REST para solicitações de reembolso, com autenticação JWT, controle de acesso por role e persistência com Prisma e PostgreSQL.

Projeto desenvolvido como peça de portfólio para demonstrar construção de backend com Node.js, TypeScript e regras de negócio reais.

## Felipe Mendes
Desenvolvedor Web Júnior

[![Portfólio](https://img.shields.io/badge/Portf%C3%B3lio-Acessar-111827?style=for-the-badge&logo=google-chrome&logoColor=white)](https://felipemasdev.github.io/Portfolio-Dev/)

**Contato**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Perfil-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/felipe-mendes-a-s-dev/)

[![E-mail](https://img.shields.io/badge/E--mail-Contato-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:felipe.mas.dev@gmail.com)

## Sobre o projeto

A aplicação organiza o fluxo de reembolso de forma simples:

1. O usuário cria sua conta e faz login.
2. O sistema emite um token JWT para acesso às rotas protegidas.
3. O colaborador cria solicitações de reembolso com comprovante.
4. O gestor visualiza e consulta as solicitações cadastradas.

## Funcionalidades

- Cadastro de usuários
- Autenticação com JWT
- Autorização por perfil: `employee` e `manager`
- Criação de solicitações de reembolso
- Listagem de reembolsos com paginação e filtro por nome
- Consulta de reembolso por ID
- Upload de comprovantes de imagem
- Health check da API
- Validação com Zod e tratamento centralizado de erros

## Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- Zod
- JWT
- Multer
- Docker

## Estrutura principal

- `src/controllers`: controladores das rotas
- `src/services`: regras de negócio
- `src/routes`: definição das rotas públicas e protegidas
- `src/middlewares`: autenticação, autorização e tratamento de erros
- `src/configs`: configurações de autenticação e upload
- `prisma/schema.prisma`: modelagem do banco de dados

## Como executar localmente

### Pré-requisitos

- Node.js 22+
- PostgreSQL
- npm

### Passos

```bash
# 1) Instalar dependências
npm install

# 2) Criar o arquivo .env a partir do exemplo
cp .env.example .env

# 3) Ajustar as variáveis conforme seu ambiente 

# 4) Gerar o Prisma Client
npx prisma generate

# 5) Aplicar o schema no banco
npx prisma db push

# 6) Iniciar a aplicação
npm run dev
```

Servidor local: `http://localhost:3333`

## Arquivo de ambiente

Use o arquivo [.env.example](.env.example) como base para criar o `.env`. Ele já traz os nomes das variáveis e comentários curtos para orientar o preenchimento, sem expor dados sensíveis.

## Variáveis de ambiente

- `DATABASE_URL`
- `DATABASE_URL_DOCKER`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `JWT_SECRET`
- `PORT`

## Banco de dados com Docker

O `docker-compose.yml` já inclui o serviço de PostgreSQL. Para subir o banco junto com a API, use os scripts definidos no `package.json`:

```bash
# desenvolvimento: sobe PostgreSQL + app-dev
npm run dkdev

# produção: sobe PostgreSQL + app
npm run dkprod
```

O perfil de desenvolvimento expõe a aplicação em `http://localhost:3334` e o banco usa a `DATABASE_URL_DOCKER`.

## Insomnia

O arquivo [insominia-config.yaml](insominia-config.yaml) pode ser importado no Insomnia para testar a API sem montar as requisições manualmente.

### Como usar

1. No Insomnia, importe o arquivo `insominia-config.yaml`.
2. Selecione o ambiente desejado:
   - `Dev:Docker` usa `http://localhost:3334`
   - `Prod` deve receber a URL da API publicada no campo `BASE_URL_`
3. Execute a rota de login em `POST /sessions` para gerar o token.
4. As requisições protegidas de reembolsos e uploads já usam bearer token a partir da resposta do login.
5. Ajuste apenas os campos do body, IDs e o arquivo anexado quando necessário.

## Endpoints

### Health

- `GET /health`

### Usuários

- `POST /users` cadastra usuário

### Sessões

- `POST /sessions` autentica usuário

### Reembolsos

- `POST /refunds` cria solicitação protegida por `employee`
- `GET /refunds` lista solicitações protegida por `manager`
- `GET /refunds/:id` consulta solicitação protegida por `employee` e `manager`

### Uploads

- `POST /uploads` envia comprovante protegido por `employee`

## Exemplos de payload

### Criar usuário

```http
POST /users
Content-Type: application/json
```

```json body
{
  "name": "Felipe Mendes",
  "email": "felipe@example.com",
  "password": "123456",
  "role": "employee"
}
```

### Login

```http
POST /sessions
Content-Type: application/json
```

```json body
{
  "email": "felipe@example.com",
  "password": "123456"
}
```

### Criar solicitação de reembolso

```http
POST /refunds
Authorization: Bearer <token>
Content-Type: application/json
```

```json body
{
  "name": "Almoço com cliente",
  "category": "food",
  "amount": 89.9,
  "filename": "comprovante.jpg"
}
```

### Enviar comprovante

```http
POST /uploads
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Campo esperado:

- `file`

## Docker

O projeto possui suporte a Docker Compose com perfis separados para desenvolvimento e produção. Os comandos já sobem o PostgreSQL junto com a API.

```bash
# desenvolvimento
npm run dkdev

# produção
npm run dkprod
```

## Observações

- O upload aceita imagens `jpeg`, `jpg` e `png`, com limite de 3 MB.
- As rotas protegidas exigem token JWT válido no header `Authorization`.
- O Prisma Client é gerado em `src/generated/prisma`.
- O arquivo `insominia-config.yaml` já contém exemplos de requisições para testar a API.

## Licença

ISC