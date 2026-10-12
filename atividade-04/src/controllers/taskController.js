import Task from "../models/Task.js";

const allowedFields = new Set(["title", "description", "status"]);

function readTaskFields(body, partial = false) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    const error = new Error("Envie um objeto JSON com os dados da tarefa.");
    error.statusCode = 400;
    throw error;
  }

  const keys = Object.keys(body);
  const unexpected = keys.find((key) => !allowedFields.has(key));
  if (unexpected) {
    const error = new Error(`Campo não permitido: ${unexpected}.`);
    error.statusCode = 400;
    throw error;
  }
  if (partial && keys.length === 0) {
    const error = new Error("Informe ao menos um campo para atualizar.");
    error.statusCode = 400;
    throw error;
  }
  if (!partial && typeof body.title !== "string") {
    const error = new Error("O título é obrigatório.");
    error.statusCode = 400;
    throw error;
  }

  return body;
}

export async function listTasks(_request, response) {
  const tarefas = await Task.find().sort({ createdAt: -1 });
  response.json({ tarefas });
}

export async function getTask(request, response) {
  const tarefa = await Task.findById(request.params.id);
  if (!tarefa) {
    response.status(404).json({ message: "Tarefa não encontrada." });
    return;
  }
  response.json({ tarefa });
}

export async function createTask(request, response) {
  const tarefa = await Task.create(readTaskFields(request.body));
  response.status(201).json({ tarefa });
}

export async function replaceTask(request, response) {
  const fields = readTaskFields(request.body);
  const tarefa = await Task.findByIdAndUpdate(request.params.id, fields, {
    new: true,
    runValidators: true,
    strict: "throw",
  });
  if (!tarefa) {
    response.status(404).json({ message: "Tarefa não encontrada." });
    return;
  }
  response.json({ tarefa });
}

export async function updateTask(request, response) {
  const fields = readTaskFields(request.body, true);
  const tarefa = await Task.findByIdAndUpdate(request.params.id, fields, {
    new: true,
    runValidators: true,
    strict: "throw",
  });
  if (!tarefa) {
    response.status(404).json({ message: "Tarefa não encontrada." });
    return;
  }
  response.json({ tarefa });
}

export async function deleteTask(request, response) {
  const tarefa = await Task.findByIdAndDelete(request.params.id);
  if (!tarefa) {
    response.status(404).json({ message: "Tarefa não encontrada." });
    return;
  }
  response.status(204).end();
}
