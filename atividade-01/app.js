const http = require("node:http");
const { MongoClient } = require("mongodb");

const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/atividade01";
const client = new MongoClient(MONGO_URI);

let recados;

function enviarJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(data));
}

async function lerJson(request) {
  const partes = [];
  let tamanho = 0;

  for await (const parte of request) {
    tamanho += parte.length;
    if (tamanho > 1024 * 1024) {
      const erro = new Error("O corpo da requisição excede 1 MB.");
      erro.statusCode = 413;
      throw erro;
    }
    partes.push(parte);
  }

  try {
    return JSON.parse(Buffer.concat(partes).toString("utf8"));
  } catch {
    const erro = new Error("Envie um JSON válido no corpo da requisição.");
    erro.statusCode = 400;
    throw erro;
  }
}

const server = http.createServer(async (request, response) => {
  try {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);

  if (request.method === "GET" && url.pathname === "/") {
    return enviarJson(response, 200, {
      mensagem: "Servidor da Atividade 01 está funcionando.",
      rotas: ["GET /health", "GET /api/recados", "POST /api/recados"],
    });
  }

  if (request.method === "GET" && url.pathname === "/health") {
    const conectado = Boolean(recados);
    return enviarJson(response, conectado ? 200 : 503, {
      status: conectado ? "ok" : "indisponível",
      bancoDeDados: conectado ? "conectado" : "desconectado",
    });
  }

  if (url.pathname === "/api/recados" && request.method === "GET") {
    if (!recados) {
      return enviarJson(response, 503, {
        erro: "O banco de dados ainda não está disponível.",
      });
    }

    const lista = await recados.find().sort({ _id: -1 }).limit(20).toArray();
    return enviarJson(response, 200, lista);
  }

  if (url.pathname === "/api/recados" && request.method === "POST") {
    if (!recados) {
      return enviarJson(response, 503, {
        erro: "O banco de dados ainda não está disponível.",
      });
    }

    try {
      const corpo = await lerJson(request);
      const mensagem =
        typeof corpo.mensagem === "string" ? corpo.mensagem.trim() : "";

      if (!mensagem || mensagem.length > 300) {
        return enviarJson(response, 400, {
          erro: "Informe uma mensagem com até 300 caracteres.",
        });
      }

      const resultado = await recados.insertOne({
        mensagem,
        criadoEm: new Date(),
      });

      return enviarJson(response, 201, {
        id: resultado.insertedId,
        mensagem,
      });
    } catch (erro) {
      return enviarJson(response, erro.statusCode || 400, {
        erro: erro.message,
      });
    }
  }

    return enviarJson(response, 404, { erro: "Rota não encontrada." });
  } catch (erro) {
    console.error("Erro ao processar requisição:", erro);
    if (!response.headersSent) {
      return enviarJson(response, 500, { erro: "Erro interno do servidor." });
    }
    response.destroy();
  }
});

async function conectarAoMongoDB() {
  const tentativasMaximas = 10;

  for (let tentativa = 1; tentativa <= tentativasMaximas; tentativa += 1) {
    try {
      await client.connect();
      recados = client.db("atividade01").collection("recados");
      console.log("Conectado ao MongoDB.");
      return;
    } catch (erro) {
      console.error(
        `Tentativa ${tentativa}/${tentativasMaximas}: não foi possível conectar ao MongoDB.`,
      );

      if (tentativa === tentativasMaximas) {
        throw erro;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

async function iniciarServidor() {
  try {
    await conectarAoMongoDB();
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor disponível na porta ${PORT}.`);
    });
  } catch (erro) {
    console.error("O servidor não foi iniciado:", erro.message);
    process.exitCode = 1;
    await client.close();
  }
}

async function encerrarServidor() {
  await client.close();
  server.close(() => process.exit(0));
}

process.on("SIGINT", encerrarServidor);
process.on("SIGTERM", encerrarServidor);

iniciarServidor();