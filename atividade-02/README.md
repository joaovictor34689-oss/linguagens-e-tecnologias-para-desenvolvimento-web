# Atividade 02 — Operadores e estruturas condicionais

Os três desafios são programas independentes feitos em JavaScript para execução no terminal com Node.js. Não é necessário instalar dependências.

## Como executar

Abra o terminal nesta pasta e rode o arquivo desejado:

- Desafio 1 — IMC: `node desafio-01-imc.js`
- Desafio 2 — Ano bissexto: `node desafio-02-ano-bissexto.js`
- Desafio 3 — Calculadora: `node desafio-03-calculadora-switch.js`

Os programas aceitam números decimais com ponto ou vírgula.

## O que cada desafio pratica

- **IMC:** entrada com `readline`, conversão com `Number()`, fórmula `peso / altura²` e classificação com `if/else`.
- **Ano bissexto:** operadores `%`, `&&` e `||` para aplicar a regra do calendário gregoriano.
- **Calculadora:** entrada de dois números e seleção da operação por `switch`, incluindo tratamento de operador inválido e divisão por zero.

## Exemplos para conferir

- IMC: peso 70 e altura 1,75 → IMC 22,86, faixa adequada.
- Ano bissexto: 2000 é bissexto; 1900 não é; 2024 é.
- Calculadora: 8, 2 e `/` → resultado 4.
