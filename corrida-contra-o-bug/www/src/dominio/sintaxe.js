/**
 * Divide uma linha de Python em pedaços para o destaque de sintaxe.
 * Não gera HTML: a interface decide como pintar cada tipo.
 *
 * Tipos: "comentario", "texto", "numero", "palavra", "funcao", "outro".
 */
const PALAVRAS = new Set(["if", "elif", "else", "for", "while", "in", "def", "return", "and", "or", "not", "True", "False", "None", "import", "from", "break", "continue"]);
const FUNCOES = new Set(["print", "range", "len", "str", "int", "float", "input", "list"]);

// comentário | texto (aceita aspas sem fechar) | número | nome | qualquer outro caractere
const PADRAO = /(#.*$)|("[^"]*"?|'[^']*'?)|(\b\d+(?:\.\d+)?\b)|([\p{L}_][\p{L}\p{N}_]*)|([\s\S])/gu;

export function tokenizarPython(linha) {
  const pedacos = [];
  for (const [texto, comentario, cadeia, numero, nome] of linha.matchAll(PADRAO)) {
    let tipo = "outro";
    if (comentario) tipo = "comentario";
    else if (cadeia) tipo = "texto";
    else if (numero) tipo = "numero";
    else if (nome && PALAVRAS.has(nome)) tipo = "palavra";
    else if (nome && FUNCOES.has(nome)) tipo = "funcao";

    // junta pedaços "outro" vizinhos para gerar menos elementos na tela
    const ultimo = pedacos[pedacos.length - 1];
    if (tipo === "outro" && ultimo && ultimo.tipo === "outro") ultimo.texto += texto;
    else pedacos.push({ tipo, texto });
  }
  return pedacos;
}
