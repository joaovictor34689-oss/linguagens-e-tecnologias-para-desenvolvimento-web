# Atividade 03 — Gerenciador de tarefas com autenticação

Aplicação MERN para cadastro de usuários e gerenciamento individual de tarefas, com autenticação JWT, senhas criptografadas com bcrypt e persistência no MongoDB.

## Estrutura

- `backend/` — API REST com Express e Mongoose.
- `frontend/` — interface React com Vite e React Router.

## Requisitos

- Node.js 20 ou superior.
- npm.
- Uma instância MongoDB local ou um cluster MongoDB Atlas.

## Configuração

Clone o repositório e acesse a atividade:

```bash
git clone https://github.com/joaovictor34689-oss/linguagens-e-tecnologias-para-desenvolvimento-web.git
cd linguagens-e-tecnologias-para-desenvolvimento-web/atividade-03
```

### Back-end

```bash
cd backend
npm install
cp .env.example .env
```

Configure `MONGODB_URI` com a conexão do MongoDB, `JWT_SECRET` com uma chave aleatória de pelo menos 32 caracteres e `CLIENT_ORIGIN` com a origem permitida para o front-end. Não publique o arquivo `.env`.

Inicie a API:

```bash
npm run dev
```

A API ficará disponível em `http://localhost:3000`. O endpoint `GET /api/health` verifica se o servidor está ativo.

### Front-end

Em outro terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Acesse o endereço exibido pelo Vite, normalmente `http://localhost:5173`. Se a API estiver em outro endereço, atualize `VITE_API_URL` no arquivo `frontend/.env` e adicione a origem do front-end a `CLIENT_ORIGIN` no back-end.

## Endpoints

| Método | Caminho | Acesso | Descrição |
|---|---|---|---|
| `GET` | `/api/health` | Público | Verifica o servidor |
| `POST` | `/api/auth/register` | Público | Cadastra usuário |
| `POST` | `/api/auth/login` | Público | Autentica usuário |
| `GET` | `/api/auth/me` | Autenticado | Retorna o usuário autenticado |
| `GET` | `/api/tasks` | Autenticado | Lista tarefas do usuário |
| `POST` | `/api/tasks` | Autenticado | Cria tarefa |
| `PUT` | `/api/tasks/:id` | Autenticado | Atualiza tarefa |
| `DELETE` | `/api/tasks/:id` | Autenticado | Remove tarefa |

As rotas autenticadas exigem `Authorization: Bearer <token>`. Cada tarefa é vinculada ao usuário autenticado; operações não acessam tarefas de outras contas.
