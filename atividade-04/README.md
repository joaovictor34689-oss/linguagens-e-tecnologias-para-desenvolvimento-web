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

Execute os testes do schema sem conectar ao banco:

```bash
npm test
```

Para testar os endpoints com o MongoDB conectado, importe `postman_collection.json` no Postman e execute as requisições na ordem apresentada. A coleção cria uma tarefa, lista e busca os dados, atualiza com `PUT` e `PATCH`, valida entradas inválidas e remove a tarefa.
