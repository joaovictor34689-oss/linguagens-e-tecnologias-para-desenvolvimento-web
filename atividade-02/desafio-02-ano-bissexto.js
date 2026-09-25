"use strict";

const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Digite um ano: ", (anoInformado) => {
  const ano = Number(anoInformado.trim());

  if (!Number.isInteger(ano) || ano <= 0) {
    console.log("Informe um ano inteiro positivo.");
    rl.close();
    return;
  }

  const bissexto = (ano % 4 === 0) && (ano % 100 !== 0 || ano % 400 === 0);

  if (bissexto) {
    console.log(ano + " é um ano bissexto.");
  } else {
    console.log(ano + " não é um ano bissexto.");
  }

  rl.close();
});
