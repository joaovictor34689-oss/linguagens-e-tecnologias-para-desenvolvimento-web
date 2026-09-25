"use strict";

const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function converterNumero(valor) {
  return Number(valor.trim().replace(",", "."));
}

rl.question("Digite seu peso em kg: ", (pesoInformado) => {
  rl.question("Digite sua altura em metros: ", (alturaInformada) => {
    const peso = converterNumero(pesoInformado);
    const altura = converterNumero(alturaInformada);

    if (!Number.isFinite(peso) || peso <= 0 || !Number.isFinite(altura) || altura <= 0) {
      console.log("Informe um peso e uma altura válidos, maiores que zero.");
      rl.close();
      return;
    }

    const imc = peso / (altura * altura);
    console.log("Seu IMC é " + imc.toFixed(2) + ".");

    if (imc < 18.5) {
      console.log("Você está abaixo do peso.");
    } else if (imc >= 25) {
      console.log("Você está acima do peso.");
    } else {
      console.log("Seu peso está na faixa considerada adequada.");
    }

    rl.close();
  });
});
