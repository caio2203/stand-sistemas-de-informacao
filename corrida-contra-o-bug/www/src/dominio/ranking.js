/**
 * REGRAS DO RANKING (domínio). Funções puras, testadas em testes/ranking.test.js.
 *
 * Um registro é: { id, apelido, pontos, acertos, erros, data (ISO 8601) }
 */

/** Maior pontuação primeiro; em empate, quem fez antes fica na frente. */
export function ordenarRanking(registros) {
  return [...registros].sort((a, b) => b.pontos - a.pontos || a.data.localeCompare(b.data));
}

/**
 * Insere um registro e devolve a nova lista (ordenada e limitada) e a posição dele.
 * `recorde` é true quando a pontuação supera o melhor resultado anterior.
 */
export function inserirNoRanking(registros, registro, limite = Infinity) {
  const anteriores = ordenarRanking(registros);
  const melhorAnterior = anteriores[0];
  const lista = ordenarRanking([...anteriores, registro]).slice(0, limite);
  const indice = lista.findIndex((r) => r.id === registro.id);

  return {
    lista,
    posicao: indice === -1 ? null : indice + 1, // null se ficou fora do limite
    total: lista.length,
    recorde: registro.pontos > 0 && (!melhorAnterior || registro.pontos > melhorAnterior.pontos)
  };
}

/** Confere se um objeto lido do armazenamento tem o formato de registro. */
export function ehRegistroValido(r) {
  return Boolean(
    r &&
      typeof r.id === "string" &&
      typeof r.apelido === "string" &&
      Number.isFinite(r.pontos) &&
      typeof r.data === "string"
  );
}

/**
 * Gera o CSV do ranking (separador ";" para abrir direto no Excel em português).
 * `formatarData` recebe a data ISO e devolve o texto da coluna.
 */
export function rankingParaCsv(registros, formatarData = (iso) => new Date(iso).toLocaleString("pt-BR")) {
  const campo = (valor) => `"${String(valor).replace(/"/g, '""')}"`;
  const linhas = ["posicao;apelido;pontos;acertos;erros;data_hora"];
  ordenarRanking(registros).forEach((r, i) => {
    linhas.push([i + 1, campo(r.apelido), r.pontos, r.acertos ?? 0, r.erros ?? 0, campo(formatarData(r.data))].join(";"));
  });
  return linhas.join("\r\n");
}
