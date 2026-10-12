import express from "express";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

app.use(express.json({ limit: "10kb", strict: true }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/tarefas", taskRoutes);

app.use((_request, response) => {
  response.status(404).json({ message: "Rota não encontrada." });
});

app.use((error, _request, response, _next) => {
  if (error instanceof SyntaxError && "body" in error) {
    response.status(400).json({ message: "JSON inválido." });
    return;
  }

  if (error.statusCode) {
    response.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));
    response.status(400).json({ message: "Dados inválidos.", errors });
    return;
  }

  if (error.name === "CastError") {
    response.status(400).json({
      message: "Identificador inválido.",
      errors: [{ field: error.path, message: error.message }],
    });
    return;
  }

  if (error.name === "StrictModeError") {
    response.status(400).json({
      message: "A requisição contém um campo não permitido.",
      errors: [{ field: error.path, message: error.message }],
    });
    return;
  }

  console.error(error);
  response.status(500).json({ message: "Erro interno do servidor." });
});

export default app;
