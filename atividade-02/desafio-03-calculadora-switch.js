"use strict";

const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function converterNumero(valor) {
  return Number(valor.trim().replace(",", "."));
}

rl.question("Digite o primeiro número: ", (primeiroInformado) => {
  rl.question("Digite o segundo número: ", (segundoInformado) => {
    rl.question("Digite o operador (+, -, *, /): ", (operadorInformado) => {
      const primeiroNumero = converterNumero(primeiroInformado);
      const segundoNumero = converterNumero(segundoInformado);
      const operador = operadorInformado.trim();

      if (!Number.isFinite(primeiroNumero) || !Number.isFinite(segundoNumero)) {
        console.log("Informe dois números válidos.");
        rl.close();
        return;
      }

      let resultado;
      switch (operador) {
        case "+":
          resultado = primeiroNumero + segundoNumero;
          break;
        case "-":
          resultado = primeiroNumero - segundoNumero;
          break;
        case "*":
          resultado = primeiroNumero * segundoNumero;
          break;
        case "/":
          if (segundoNumero === 0) {
            console.log("Não é possível dividir por zero.");
            rl.close();
            return;
          }
          resultado = primeiroNumero / segundoNumero;
          break;
        default:
          console.log("Operador inválido. Use +, -, * ou /.");
          rl.close();
          return;
      }

      console.log("Resultado: " + resultado);
      rl.close();
    });
  });
});
