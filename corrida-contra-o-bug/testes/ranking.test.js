import { test } from "node:test";
import assert from "node:assert/strict";
import { ordenarRanking, inserirNoRanking, rankingParaCsv, ehRegistroValido } from "../www/src/dominio/ranking.js";
import { RepositorioRanking } from "../www/src/infra/repositorio-ranking.js";
import { ServicoRanking } from "../www/src/aplicacao/servico-ranking.js";

const R = (id, pontos, data = "2026-10-20T10:00:00.000Z", apelido = id) => ({ id, apelido, pontos, acertos: 1, erros: 0, data });

/** Armazenamento falso em memória, no lugar do localStorage. */
function armazenamentoFalso(inicial = {}) {
  const dados = { ...inicial };
  return {
    getItem: (chave) => (chave in dados ? dados[chave] : null),
    setItem: (chave, valor) => { dados[chave] = String(valor); },
    dados
  };
}

test("ordena por pontos e, no empate, quem jogou antes fica na frente", () => {
  const lista = [R("b", 50, "2026-10-20T11:00:00Z"), R("a", 50, "2026-10-20T10:00:00Z"), R("c", 90)];
  assert.deepEqual(ordenarRanking(lista).map((r) => r.id), ["c", "a", "b"]);
});

test("inserir devolve a posição e marca recorde só quando supera o melhor", () => {
  const base = [R("a", 100), R("b", 50)];
  const meio = inserirNoRanking(base, R("x", 70));
  assert.equal(meio.posicao, 2);
  assert.equal(meio.total, 3);
  assert.equal(meio.recorde, false);

  assert.equal(inserirNoRanking(base, R("y", 150)).recorde, true);
  assert.equal(inserirNoRanking(base, R("z", 100, "2026-10-21T00:00:00Z")).recorde, false); // empatar não é recorde
  assert.equal(inserirNoRanking([], R("w", 0)).recorde, false); // zero pontos não é recorde
  assert.equal(inserirNoRanking([], R("v", 10)).recorde, true);
});

test("inserir respeita o limite de registros", () => {
  const cheio = [R("a", 100), R("b", 90)];
  const resultado = inserirNoRanking(cheio, R("c", 10), 2);
  assert.equal(resultado.lista.length, 2);
  assert.equal(resultado.posicao, null);
});

test("CSV escapa aspas e usa ponto e vírgula", () => {
  const csv = rankingParaCsv([R("1", 80, "2026-10-20T10:00:00Z", 'Zé "Bug"')], () => "20/10/2026");
  const [cabecalho, linha] = csv.split("\r\n");
  assert.equal(cabecalho, "posicao;apelido;pontos;acertos;erros;data_hora");
  assert.equal(linha, '1;"Zé ""Bug""";80;1;0;"20/10/2026"');
});

test("registro inválido é reconhecido", () => {
  assert.equal(ehRegistroValido(R("a", 10)), true);
  assert.equal(ehRegistroValido({ apelido: "x" }), false);
  assert.equal(ehRegistroValido(null), false);
});

test("repositório ignora dados corrompidos em vez de travar", () => {
  const corrompido = new RepositorioRanking({ chave: "k", armazenamento: armazenamentoFalso({ k: "{nao e json" }) });
  assert.deepEqual(corrompido.listar(), []);

  const misturado = new RepositorioRanking({ chave: "k", armazenamento: armazenamentoFalso({ k: JSON.stringify([R("a", 5), { lixo: 1 }]) }) });
  assert.deepEqual(misturado.listar().map((r) => r.id), ["a"]);
});

test("repositório devolve false quando o aparelho não deixa gravar", () => {
  const cheio = { getItem: () => null, setItem: () => { throw new Error("cota excedida"); } };
  assert.equal(new RepositorioRanking({ chave: "k", armazenamento: cheio }).substituir([]), false);
});

test("serviço registra partidas, informa posição, top e zera", () => {
  let n = 0;
  const servico = new ServicoRanking({
    repositorio: new RepositorioRanking({ chave: "k", armazenamento: armazenamentoFalso() }),
    limiteRegistros: 1000,
    agora: () => new Date(Date.UTC(2026, 9, 20, 10, 0, n)),
    gerarId: () => `id${++n}`
  });

  const primeiro = servico.registrarPartida({ apelido: "Ana", pontos: 200, acertos: 3, erros: 0 });
  assert.deepEqual(primeiro, { id: "id1", posicao: 1, total: 1, recorde: true });

  const segundo = servico.registrarPartida({ apelido: "Rui", pontos: 120, acertos: 2, erros: 1 });
  assert.equal(segundo.posicao, 2);
  assert.equal(segundo.recorde, false);

  assert.equal(servico.melhor().apelido, "Ana");
  assert.deepEqual(servico.top(10).map((r) => r.apelido), ["Ana", "Rui"]);
  assert.equal(servico.quantidade(), 2);
  assert.match(servico.exportarCsv(), /"Ana";200/);

  servico.zerar();
  assert.equal(servico.quantidade(), 0);
  assert.equal(servico.melhor(), null);
});
