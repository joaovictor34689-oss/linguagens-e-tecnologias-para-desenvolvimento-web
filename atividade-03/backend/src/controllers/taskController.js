import mongoose from "mongoose";
import Task from "../models/Task.js";
import { isObject } from "../middlewares/validate.js";

const allowedStatuses = new Set(["pendente", "concluída"]);

function validateTaskFields(body, partial = false) {
  if (!isObject(body)) {
    return "Informe os dados da tarefa.";
  }
  const keys = Object.keys(body);
  if (keys.some((key) => !["title", "description", "status"].includes(key))) {
    return "A requisição contém campos não permitidos.";
  }
  if (!partial && typeof body.title !== "string") {
    return "O título da tarefa é obrigatório.";
  }
  if ("title" in body && (typeof body.title !== "string" || body.title.trim().length < 1 || body.title.trim().length > 120)) {
    return "O título deve ter entre 1 e 120 caracteres.";
  }
  if ("description" in body && (typeof body.description !== "string" || body.description.trim().length > 1000)) {
    return "A descrição deve ter no máximo 1000 caracteres.";
  }
  if ("status" in body && !allowedStatuses.has(body.status)) {
    return "O status deve ser pendente ou concluída.";
  }
  if (partial && keys.length === 0) {
    return "Informe ao menos um campo para atualizar.";
  }
  return null;
}

function validId(id) {
  return mongoose.isValidObjectId(id);
}

export async function listTasks(request, response, next) {
  try {
    const tasks = await Task.find({ user: request.userId }).sort({ createdAt: -1 });
    response.json({ tasks });
  } catch (error) {
    next(error);
  }
}

export async function createTask(request, response, next) {
  try {
    const validationError = validateTaskFields(request.body);
    if (validationError) {
      response.status(400).json({ message: validationError });
      return;
    }
    const task = await Task.create({
      title: request.body.title.trim(),
      description: request.body.description?.trim() || "",
      status: request.body.status || "pendente",
      user: request.userId,
    });
    response.status(201).json({ task });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(request, response, next) {
  try {
    const validationError = validateTaskFields(request.body, true);
    if (validationError) {
      response.status(400).json({ message: validationError });
      return;
    }
    if (!validId(request.params.id)) {
      response.status(404).json({ message: "Tarefa não encontrada." });
      return;
    }
    const updates = { ...request.body };
    if (typeof updates.title === "string") updates.title = updates.title.trim();
    if (typeof updates.description === "string") updates.description = updates.description.trim();

    const task = await Task.findOneAndUpdate(
      { _id: request.params.id, user: request.userId },
      updates,
      { new: true, runValidators: true },
    );
    if (!task) {
      response.status(404).json({ message: "Tarefa não encontrada." });
      return;
    }
    response.json({ task });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(request, response, next) {
  try {
    if (!validId(request.params.id)) {
      response.status(404).json({ message: "Tarefa não encontrada." });
      return;
    }
    const task = await Task.findOneAndDelete({
      _id: request.params.id,
      user: request.userId,
    });
    if (!task) {
      response.status(404).json({ message: "Tarefa não encontrada." });
      return;
    }
    response.status(204).end();
  } catch (error) {
    next(error);
  }
}
