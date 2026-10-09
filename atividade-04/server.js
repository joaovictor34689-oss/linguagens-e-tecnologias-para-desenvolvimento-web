import "dotenv/config";
import mongoose from "mongoose";
import app from "./src/app.js";

const port = Number(process.env.PORT) || 3001;

if (!process.env.MONGODB_URI) {
  console.error("Configure MONGODB_URI no arquivo .env.");
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => {
    console.log(`API disponível em http://localhost:${port}`);
  });
} catch (error) {
  console.error("Não foi possível conectar ao MongoDB.", error.message);
  process.exit(1);
}
