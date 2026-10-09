import assert from "node:assert/strict";
import test from "node:test";
import Task from "../src/models/Task.js";

test("define os valores padrão da tarefa", () => {
  const task = new Task({ title: "Organizar o projeto" });

  assert.equal(task.description, "");
  assert.equal(task.status, "pendente");
  assert.equal(task.validateSync(), undefined);
});

test("exige um título com pelo menos três caracteres", () => {
  const missingTitle = new Task({});
  const shortTitle = new Task({ title: "ab" });

  assert.equal(missingTitle.validateSync().errors.title.kind, "required");
  assert.equal(shortTitle.validateSync().errors.title.kind, "minlength");
});

test("rejeita valores fora dos limites do schema", () => {
  const longTitle = new Task({ title: "t".repeat(121) });
  const invalidStatus = new Task({ title: "Tarefa válida", status: "finalizada" });
  const longDescription = new Task({ title: "Tarefa válida", description: "d".repeat(501) });

  assert.equal(longTitle.validateSync().errors.title.kind, "maxlength");
  assert.equal(invalidStatus.validateSync().errors.status.kind, "enum");
  assert.equal(longDescription.validateSync().errors.description.kind, "maxlength");
});

test("rejeita campos fora do contrato estrito", () => {
  assert.throws(
    () => new Task({ title: "Tarefa válida", administrador: true }),
    { name: "StrictModeError" },
  );
});
