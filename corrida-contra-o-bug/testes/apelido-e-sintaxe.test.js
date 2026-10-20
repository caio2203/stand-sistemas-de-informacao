import { test } from "node:test";
import assert from "node:assert/strict";
import { limparApelido } from "../www/src/dominio/apelido.js";
import { tokenizarPython } from "../www/src/dominio/sintaxe.js";

test("apelido remove símbolos, junta espaços e limita o tamanho", () => {
  assert.equal(limparApelido("  Dev<script>  Ninja!! ", 20), "Devscript Ninja");
  assert.equal(limparApelido("João_Bug-2", 12), "João_Bug-2");
  assert.equal(limparApelido("abcdefghijklmnop", 12), "abcdefghijkl");
  assert.equal(limparApelido("!!!", 12), "");
});

test("apelido não termina com espaço depois de cortado", () => {
  assert.equal(limparApelido("abcde fghij", 6), "abcde");
});

const tipos = (linha) => tokenizarPython(linha).filter((p) => p.tipo !== "outro").map((p) => `${p.tipo}:${p.texto}`);

test("destaca palavras-chave, funções, textos e números", () => {
  assert.deepEqual(tipos('if idade >= 15:'), ["palavra:if", "numero:15"]);
  assert.deepEqual(tipos('print("Olá", 3)'), ["funcao:print", 'texto:"Olá"', "numero:3"]);
});

test("aspas sem fechar viram texto até o fim da linha", () => {
  assert.deepEqual(tipos('nome = "Ana'), ['texto:"Ana']);
});

test("comentário ocupa o resto da linha", () => {
  assert.deepEqual(tipos("# mostrar de 1 a 5"), ["comentario:# mostrar de 1 a 5"]);
});

test("os pedaços remontam exatamente a linha original", () => {
  const linha = '    total = total + preco  # soma';
  assert.equal(tokenizarPython(linha).map((p) => p.texto).join(""), linha);
});

test("número dentro de nome não é destacado como número", () => {
  assert.deepEqual(tipos("x1 = 2"), ["numero:2"]);
});
