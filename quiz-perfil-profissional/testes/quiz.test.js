/**
 * Testes das regras do quiz. Rode com: npm test
 * Usa apenas o executor de testes nativo do Node (sem dependências).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { PartidaQuiz, calcularResultado, somarPontos, validarConteudo } from "../www/src/dominio/quiz.js";
import { AREAS } from "../www/src/dados/areas.js";
import { PERGUNTAS } from "../www/src/dados/perguntas.js";

const PERGUNTAS_TESTE = [
  { texto: "P1", alternativas: [{ texto: "a", pontos: { x: 2 } }, { texto: "b", pontos: { y: 3 } }] },
  { texto: "P2", alternativas: [{ texto: "a", pontos: { x: 1, y: 1 } }, { texto: "b", pontos: { z: 1 } }] }
];

test("o conteúdo real (áreas e perguntas) não tem problemas", () => {
  assert.deepEqual(validarConteudo(AREAS, PERGUNTAS), []);
});

test("o conteúdo real tem 7 perguntas com 4 alternativas cada", () => {
  assert.equal(PERGUNTAS.length, 7);
  PERGUNTAS.forEach((p) => assert.equal(p.alternativas.length, 4, p.texto));
});

test("partida soma pontos e avança até terminar", () => {
  const partida = new PartidaQuiz(PERGUNTAS_TESTE, ["x", "y", "z"]);
  assert.equal(partida.perguntaAtual.texto, "P1");
  partida.responder(0);
  assert.equal(partida.perguntaAtual.texto, "P2");
  partida.responder(0);
  assert.equal(partida.terminou, true);
  assert.equal(partida.perguntaAtual, null);
  assert.deepEqual(partida.pontuacao, { x: 3, y: 1, z: 0 });
});

test("pular não soma pontos", () => {
  const partida = new PartidaQuiz(PERGUNTAS_TESTE, ["x", "y", "z"]);
  partida.pular();
  partida.pular();
  assert.equal(partida.terminou, true);
  assert.deepEqual(partida.pontuacao, { x: 0, y: 0, z: 0 });
});

test("responder com alternativa inexistente gera erro", () => {
  const partida = new PartidaQuiz(PERGUNTAS_TESTE, ["x", "y", "z"]);
  assert.throws(() => partida.responder(9));
});

test("somarPontos ignora área desconhecida e não altera o original", () => {
  const original = { x: 1 };
  const nova = somarPontos(original, { x: 2, fantasma: 5 });
  assert.deepEqual(nova, { x: 3 });
  assert.deepEqual(original, { x: 1 });
});

test("resultado escolhe a maior pontuação e a segunda colocada", () => {
  const r = calcularResultado({ x: 1, y: 5, z: 3 });
  assert.equal(r.vencedora, "y");
  assert.equal(r.segunda, "z");
});

test("empate no primeiro lugar é decidido pelo sorteio", () => {
  const pontos = { x: 4, y: 4, z: 1 };
  assert.equal(calcularResultado(pontos, () => 0).vencedora, "x");
  assert.equal(calcularResultado(pontos, () => 0.99).vencedora, "y");
  assert.equal(calcularResultado(pontos, () => 0).segunda, "y");
});

test("sem segunda área com pontos, segunda é null", () => {
  assert.equal(calcularResultado({ x: 2, y: 0 }).segunda, null);
});

test("validarConteudo aponta área desconhecida e área inalcançável", () => {
  const areas = {
    x: { nome: "X", cor: "#000", icone: "i", descricao: "d", incentivo: "i", estudos: ["a", "b", "c"] },
    y: { nome: "Y", cor: "#000", icone: "i", descricao: "d", incentivo: "i", estudos: ["a", "b", "c"] }
  };
  const perguntas = [{ texto: "P", alternativas: [{ texto: "a", pontos: { x: 1 } }, { texto: "b", pontos: { w: 1 } }] }];
  const problemas = validarConteudo(areas, perguntas);
  assert.ok(problemas.some((p) => p.includes('área desconhecida "w"')));
  assert.ok(problemas.some((p) => p.includes('Área "y" nunca recebe pontos')));
});
