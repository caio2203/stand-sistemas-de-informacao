import { test } from "node:test";
import assert from "node:assert/strict";
import { TRECHOS } from "../www/src/dados/trechos.js";

test("todo trecho tem tipo, dica e correção preenchidos", () => {
  TRECHOS.forEach((trecho, i) => {
    for (const campo of ["tipo", "dica", "correcao"]) {
      assert.ok(typeof trecho[campo] === "string" && trecho[campo].length > 0, `trecho ${i + 1}: ${campo}`);
    }
  });
});

test("a correção é diferente da linha errada", () => {
  TRECHOS.forEach((trecho, i) => {
    assert.notEqual(trecho.correcao, trecho.linhas[trecho.linhaErrada - 1], `trecho ${i + 1}`);
  });
});

test("nenhum texto do conteúdo usa exclamação fora do código", () => {
  TRECHOS.forEach((trecho, i) => {
    for (const campo of ["explicacao", "tipo", "dica"]) {
      assert.ok(!trecho[campo].includes("!"), `trecho ${i + 1}: ${campo}`);
    }
  });
});
