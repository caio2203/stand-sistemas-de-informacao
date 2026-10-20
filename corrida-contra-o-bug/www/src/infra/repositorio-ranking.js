import { ehRegistroValido } from "../dominio/ranking.js";

/**
 * Guarda o ranking no localStorage do aparelho.
 *
 * O armazenamento é recebido de fora (padrão: localStorage), então os testes
 * usam um armazenamento falso em memória. Para trocar por um banco de dados
 * ou servidor no futuro, basta outra classe com os mesmos métodos.
 */
export class RepositorioRanking {
  constructor({ chave, armazenamento = globalThis.localStorage }) {
    this.chave = chave;
    this.armazenamento = armazenamento;
  }

  /** Lê todos os registros. Dados corrompidos são ignorados em vez de travar o jogo. */
  listar() {
    try {
      const dados = JSON.parse(this.armazenamento.getItem(this.chave) || "[]");
      return Array.isArray(dados) ? dados.filter(ehRegistroValido) : [];
    } catch (erro) {
      return [];
    }
  }

  /** Substitui todos os registros. Devolve false se o aparelho não deixar gravar. */
  substituir(registros) {
    try {
      this.armazenamento.setItem(this.chave, JSON.stringify(registros));
      return true;
    } catch (erro) {
      return false;
    }
  }

  limpar() {
    return this.substituir([]);
  }
}
