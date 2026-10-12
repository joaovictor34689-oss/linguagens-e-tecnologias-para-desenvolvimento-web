# Atividade 04 — API REST do trabalho final

API de tarefas construída com Node.js, Express e MongoDB. Inclui operações CRUD, validação de dados pelo Mongoose e uma coleção do Postman para testar as rotas e os erros de validação.

## Requisitos

- Node.js 20 ou superior.
- npm.
- MongoDB Atlas ou uma instância local do MongoDB.

## Configuração

Na pasta `atividade-04`, instale as dependências e crie o arquivo de ambiente:

```bash
npm install
cp .env.example .env
```

Adicione `MONGODB_URI` ao `.env` com a string de conexão do seu MongoDB. Não publique esse arquivo.

Inicie o servidor:

```bash
npm run dev
```

A API ficará disponível em `http://localhost:3001`. O endpoint `GET /api/health` confirma que o servidor está ativo.

## Rotas

| Método | Caminho | Descrição |
|---|---|---|
| `GET` | `/api/tarefas` | Lista as tarefas |
| `GET` | `/api/tarefas/:id` | Busca uma tarefa |
| `POST` | `/api/tarefas` | Cria uma tarefa |
| `PUT` | `/api/tarefas/:id` | Atualiza uma tarefa |
| `PATCH` | `/api/tarefas/:id` | Atualiza os campos enviados |
| `DELETE` | `/api/tarefas/:id` | Remove uma tarefa |

O título é obrigatório e deve ter de 3 a 120 caracteres. A descrição aceita até 500 caracteres. O status pode ser `pendente`, `em andamento` ou `concluída`; o padrão é `pendente`.

Exemplo para criar uma tarefa:

```bash
curl -X POST http://localhost:3001/api/tarefas \
  -H "Content-Type: application/json" \
  -d '{"title":"Preparar a API","description":"Validar o CRUD","status":"pendente"}'
```

## Testes

Execute os testes do schema e do CRUD com um MongoDB temporário:

```bash
npm install
npm test
```

Os testes automatizados iniciam um MongoDB temporário, executam o CRUD pela API e validam entradas inválidas, sem precisar de uma URI do Atlas.

Para testar os endpoints no MongoDB Atlas, configure a conexão no `.env`, inicie o servidor e importe `postman_collection.json` no Postman. Execute as requisições na ordem apresentada para criar, listar, buscar, atualizar, validar erros e remover uma tarefa.
