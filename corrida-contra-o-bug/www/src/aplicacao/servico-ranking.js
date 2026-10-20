import { inserirNoRanking, ordenarRanking, rankingParaCsv } from "../dominio/ranking.js";

/**
 * Casos de uso do ranking. Junta as regras (dominio/ranking.js) com o
 * armazenamento (infra/repositorio-ranking.js). As telas só falam com este serviço.
 */
export class ServicoRanking {
  constructor({ repositorio, limiteRegistros, agora = () => new Date(), gerarId = gerarIdPadrao }) {
    this.repositorio = repositorio;
    this.limiteRegistros = limiteRegistros;
    this.agora = agora;
    this.gerarId = gerarId;
  }

  /** Salva o resultado de uma partida e devolve { id, posicao, total, recorde }. */
  registrarPartida({ apelido, pontos, acertos, erros }) {
    const registro = { id: this.gerarId(), apelido, pontos, acertos, erros, data: this.agora().toISOString() };
    const resultado = inserirNoRanking(this.repositorio.listar(), registro, this.limiteRegistros);
    this.repositorio.substituir(resultado.lista);
    return { id: registro.id, posicao: resultado.posicao, total: resultado.total, recorde: resultado.recorde };
  }

  top(quantidade) {
    return ordenarRanking(this.repositorio.listar()).slice(0, quantidade);
  }

  melhor() {
    return this.top(1)[0] || null;
  }

  quantidade() {
    return this.repositorio.listar().length;
  }

  zerar() {
    return this.repositorio.limpar();
  }

  exportarCsv() {
    return rankingParaCsv(this.repositorio.listar());
  }
}

function gerarIdPadrao() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
