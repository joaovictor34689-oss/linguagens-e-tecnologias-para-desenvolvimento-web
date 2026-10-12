import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app.js";

let mongo;
let server;
let baseUrl;

before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
  await mongoose.disconnect();
  if (mongo) {
    await mongo.stop();
  }
});

test("executa o CRUD completo e rejeita dados inválidos", async () => {
  const createdResponse = await fetch(`${baseUrl}/api/tarefas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Preparar o trabalho final" }),
  });
  assert.equal(createdResponse.status, 201);
  const created = (await createdResponse.json()).tarefa;
  assert.equal(created.status, "pendente");
  assert.equal(created.description, "");

  const listResponse = await fetch(`${baseUrl}/api/tarefas`);
  assert.equal(listResponse.status, 200);
  assert.equal((await listResponse.json()).tarefas.length, 1);

  const getResponse = await fetch(`${baseUrl}/api/tarefas/${created._id}`);
  assert.equal(getResponse.status, 200);
  assert.equal((await getResponse.json()).tarefa._id, created._id);

  const putResponse = await fetch(`${baseUrl}/api/tarefas/${created._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Implementar a API",
      description: "CRUD completo",
      status: "em andamento",
    }),
  });
  assert.equal(putResponse.status, 200);
  assert.equal((await putResponse.json()).tarefa.title, "Implementar a API");

  const patchResponse = await fetch(`${baseUrl}/api/tarefas/${created._id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "concluída" }),
  });
  assert.equal(patchResponse.status, 200);
  assert.equal((await patchResponse.json()).tarefa.status, "concluída");

  const invalidCreateResponse = await fetch(`${baseUrl}/api/tarefas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "ab" }),
  });
  assert.equal(invalidCreateResponse.status, 400);

  const invalidUpdateResponse = await fetch(`${baseUrl}/api/tarefas/${created._id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "ab" }),
  });
  assert.equal(invalidUpdateResponse.status, 400);

  const invalidIdResponse = await fetch(`${baseUrl}/api/tarefas/id-invalido`);
  assert.equal(invalidIdResponse.status, 400);

  const deleteResponse = await fetch(`${baseUrl}/api/tarefas/${created._id}`, {
    method: "DELETE",
  });
  assert.equal(deleteResponse.status, 204);

  const missingResponse = await fetch(`${baseUrl}/api/tarefas/${created._id}`);
  assert.equal(missingResponse.status, 404);
});
