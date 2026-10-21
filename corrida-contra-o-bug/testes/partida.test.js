import { test } from "node:test";
import assert from "node:assert/strict";
import { PartidaBug, montarFila, pontosPorAcerto, validarTrecho, embaralhar } from "../www/src/dominio/partida.js";
import { TRECHOS } from "../www/src/dados/trechos.js";
import { CONFIG } from "../www/src/config.js";

const T = (nivel, linhaErrada = 2) => ({ nivel, linhas: ["a", "b", "c"], linhaErrada, explicacao: "x" });
const CONFIG_TESTE = {
  duracaoRodada: 90,
  ordemNiveis: ["facil", "medio", "dificil"],
  pontuacao: { maximos: 100, minimos: 10, perdaPorSegundo: 6, penalidadeErro: 30 }
};

test("os trechos reais são válidos e cada nível tem mais trechos do que uma partida usa", () => {
  TRECHOS.forEach((trecho, i) => assert.deepEqual(validarTrecho(trecho, CONFIG.ordemNiveis), [], `trecho ${i + 1}`));
  for (const nivel of CONFIG.ordemNiveis) {
    assert.ok(TRECHOS.filter((t) => t.nivel === nivel).length > CONFIG.trechosPorNivel, nivel);
  }
});

test("nenhum trecho real se repete", () => {
  const codigos = TRECHOS.map((t) => t.linhas.join("\n"));
  assert.equal(new Set(codigos).size, codigos.length);
});

test("validarTrecho aponta linhaErrada fora do trecho e tamanho inválido", () => {
  assert.ok(validarTrecho(T("facil", 9), CONFIG.ordemNiveis).length > 0);
  assert.ok(validarTrecho({ ...T("facil"), linhas: ["a"] }, CONFIG.ordemNiveis).length > 0);
  assert.ok(validarTrecho(T("impossivel"), CONFIG.ordemNiveis).length > 0);
});

test("pontos por acerto caem com o tempo, sem passar do mínimo", () => {
  const regras = CONFIG_TESTE.pontuacao;
  assert.equal(pontosPorAcerto(0, regras), 100);
  assert.equal(pontosPorAcerto(5, regras), 70);
  assert.equal(pontosPorAcerto(60, regras), 10);
});

test("embaralhar não perde nem repete itens", () => {
  const lista = [1, 2, 3, 4, 5, 6];
  const resultado = embaralhar(lista);
  assert.deepEqual([...resultado].sort(), lista);
  assert.deepEqual(lista, [1, 2, 3, 4, 5, 6]); // original intacto
});

test("fila segue fácil, médio, difícil e não repete trechos", () => {
  const fila = montarFila(TRECHOS, CONFIG.ordemNiveis);
  assert.equal(new Set(fila).size, TRECHOS.length);
  const niveis = fila.map((t) => t.nivel);
  assert.deepEqual(niveis, [...niveis].sort((a, b) => CONFIG.ordemNiveis.indexOf(a) - CONFIG.ordemNiveis.indexOf(b)));
});

test("cada partida sorteia trechosPorNivel de cada nível, na ordem dos níveis", () => {
  const fila = montarFila(TRECHOS, CONFIG.ordemNiveis, Math.random, CONFIG.trechosPorNivel);
  const esperado = CONFIG.ordemNiveis.flatMap((nivel) => Array(CONFIG.trechosPorNivel).fill(nivel));
  assert.deepEqual(fila.map((t) => t.nivel), esperado);
  assert.equal(new Set(fila).size, fila.length);
});

test("o sorteio varia os trechos entre partidas", () => {
  const filas = Array.from({ length: 20 }, () => montarFila(TRECHOS, CONFIG.ordemNiveis, Math.random, CONFIG.trechosPorNivel));
  const usados = new Set(filas.flat());
  assert.ok(usados.size > CONFIG.ordemNiveis.length * CONFIG.trechosPorNivel);
});

test("acerto rápido soma mais pontos que acerto lento", () => {
  const rapida = new PartidaBug({ apelido: "A", trechos: [T("facil")], config: CONFIG_TESTE });
  rapida.proximoTrecho();
  rapida.avancarTempo(1);
  const r1 = rapida.responder(1);

  const lenta = new PartidaBug({ apelido: "B", trechos: [T("facil")], config: CONFIG_TESTE });
  lenta.proximoTrecho();
  lenta.avancarTempo(10);
  const r2 = lenta.responder(1);

  assert.equal(r1.acertou, true);
  assert.equal(r1.delta, 94);
  assert.equal(r2.delta, 40);
  assert.ok(rapida.pontos > lenta.pontos);
});

test("erro desconta pontos, mas a pontuação nunca fica negativa", () => {
  const partida = new PartidaBug({ apelido: "A", trechos: [T("facil"), T("facil")], config: CONFIG_TESTE });
  partida.proximoTrecho();
  const r = partida.responder(0);
  assert.equal(r.acertou, false);
  assert.equal(r.delta, -30);
  assert.equal(r.indiceCerto, 1);
  assert.equal(partida.pontos, 0);
  assert.equal(partida.erros, 1);
});

test("só vale um toque por trecho", () => {
  const partida = new PartidaBug({ apelido: "A", trechos: [T("facil")], config: CONFIG_TESTE });
  partida.proximoTrecho();
  assert.notEqual(partida.responder(1), null);
  assert.equal(partida.responder(1), null);
  assert.equal(partida.acertos, 1);
});

test("o relógio para enquanto a explicação está na tela", () => {
  const partida = new PartidaBug({ apelido: "A", trechos: [T("facil"), T("facil")], config: CONFIG_TESTE });
  partida.proximoTrecho();
  partida.avancarTempo(3);
  partida.responder(1);
  partida.avancarTempo(20); // explicação na tela: não conta
  assert.equal(partida.restante, 87);
  partida.proximoTrecho();
  partida.avancarTempo(2);
  assert.equal(partida.restante, 85);
  assert.equal(partida.tempoNoTrecho, 2);
});

test("partida encerra quando o tempo acaba", () => {
  const partida = new PartidaBug({ apelido: "A", trechos: [T("facil")], config: CONFIG_TESTE });
  partida.proximoTrecho();
  partida.avancarTempo(95);
  assert.equal(partida.encerrada, true);
  assert.equal(partida.motivo, "tempo");
  assert.equal(partida.restante, 0);
  assert.equal(partida.responder(1), null);
});

test("partida encerra quando acabam os trechos", () => {
  const partida = new PartidaBug({ apelido: "A", trechos: [T("facil")], config: CONFIG_TESTE });
  partida.proximoTrecho();
  partida.responder(1);
  assert.equal(partida.proximoTrecho(), null);
  assert.equal(partida.encerrada, true);
  assert.equal(partida.motivo, "zerou");
});
