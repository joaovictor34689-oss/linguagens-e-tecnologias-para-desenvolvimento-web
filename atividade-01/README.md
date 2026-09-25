# Atividade 01 — Servidor Node.js com Docker e MongoDB

**Aluno:** João Victor Crispim Pinheiro  
**Matrícula:** 2024010275

Esta atividade contém um servidor HTTP simples em Node.js, empacotado com Docker Compose e conectado a um serviço MongoDB.

## Arquivos

- `app.js` — servidor HTTP e rotas da API.
- `package.json` — metadados e dependência do driver oficial do MongoDB.
- `Dockerfile` — imagem da aplicação Node.js.
- `docker-compose.yml` — aplicação, MongoDB, verificação de saúde e volume persistente.

## Executar com Docker Compose

Tenha Docker e Docker Compose instalados e execute na pasta `atividade-01`:

```bash
docker compose up --build
```

Quando os serviços estiverem prontos, a API ficará disponível em `http://localhost:3000`.

### Rotas

| Método | Caminho | Descrição |
|---|---|---|
| `GET` | `/` | Mostra as rotas disponíveis. |
| `GET` | `/health` | Informa o estado do servidor e da conexão com o MongoDB. |
| `GET` | `/api/recados` | Lista os 20 recados mais recentes. |
| `POST` | `/api/recados` | Salva um recado no MongoDB. |

Exemplo para criar um recado:

```bash
curl -X POST http://localhost:3000/api/recados \
  -H "Content-Type: application/json" \
  -d '{"mensagem":"Meu primeiro recado"}'
```

Para conferir os recados, acesse `http://localhost:3000/api/recados`.

Os dados do MongoDB ficam no volume Docker `mongo_data` e continuam disponíveis após parar e iniciar os contêineres. Para parar a aplicação:

```bash
docker compose down
```

> `docker compose down -v` também apaga o volume do banco e os dados salvos.

## Abrir no GitHub Codespaces

No GitHub, abra o repositório e selecione **Code → Codespaces → Create codespace**. No terminal do Codespace, entre em `atividade-01` e execute `docker compose up --build`. A porta 3000 será encaminhada pelo Codespaces.

## Branch e pull request

Esta solução foi preparada na branch `atividade-01`, separada da branch principal para revisão por pull request.