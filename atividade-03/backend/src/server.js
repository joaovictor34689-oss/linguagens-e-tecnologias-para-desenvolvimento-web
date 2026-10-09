import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const port = Number(process.env.PORT) || 3000;
const requiredEnvironment = ["MONGODB_URI", "JWT_SECRET"];
const missingEnvironment = requiredEnvironment.filter((key) => !process.env[key]);

if (missingEnvironment.length > 0) {
  console.error(`Variáveis obrigatórias ausentes: ${missingEnvironment.join(", ")}`);
  process.exit(1);
}

if (process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET deve ter pelo menos 32 caracteres.");
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => {
    console.log(`API disponível em http://localhost:${port}`);
  });
} catch {
  console.error("Não foi possível conectar ao MongoDB.");
  process.exit(1);
}
