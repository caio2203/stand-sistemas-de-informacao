/**
 * Limpa o apelido digitado: só letras (com acento), números, espaço, _ e -.
 * Espaços repetidos viram um só, e o tamanho é limitado.
 */
export function limparApelido(texto, tamanhoMaximo) {
  return String(texto)
    .replace(/[^\p{L}\p{N} _-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, tamanhoMaximo)
    .trim();
}
