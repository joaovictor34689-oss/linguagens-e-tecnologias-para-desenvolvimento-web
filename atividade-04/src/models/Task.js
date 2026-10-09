import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "O título é obrigatório."],
      trim: true,
      minlength: [3, "O título deve ter pelo menos 3 caracteres."],
      maxlength: [120, "O título deve ter no máximo 120 caracteres."],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "A descrição deve ter no máximo 500 caracteres."],
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["pendente", "em andamento", "concluída"],
        message: "O status deve ser pendente, em andamento ou concluída.",
      },
      default: "pendente",
      required: true,
    },
  },
  {
    timestamps: true,
    strict: "throw",
  },
);

export default mongoose.model("Task", taskSchema);
